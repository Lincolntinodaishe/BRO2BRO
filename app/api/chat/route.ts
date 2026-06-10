import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";

// Corporate proxy has a self-signed cert — disable SSL verification in dev
if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const SYSTEM_PROMPT = `You are Bro AI — a wellness companion built specifically for Black men in Arkansas. You use motivational interviewing: open-ended questions, reflective listening, affirming strengths, meeting people where they are.

Your mission: Help users navigate health, mental wellness, and community resources — feeling like a trusted friend, not a clinical tool.

Key context:
- 60% of Black men in Arkansas have hypertension, half uncontrolled
- UAMS has 61 partner barbershops for BP checks, glucose screenings, and referrals
- App connects users to clinics, peer mentors, virtual counseling, and barbershop screenings
- Crisis resources: 988 Suicide & Crisis Lifeline (available 24/7)
- Many users distrust healthcare — build trust first

Tone: Warm, direct, real. Keep responses concise (2-4 sentences). Never be preachy or clinical.

You can also take action on appointments:
- CREATE new appointments when user wants to book something
- CANCEL appointments by ID when asked
- RESCHEDULE appointments when asked
- REGISTER for community health events

IMPORTANT: When the user clearly states an intent to create/cancel/reschedule/register (after any needed confirmation), use the appropriate tool immediately. Do not ask for confirmation more than once.

For appointment creation, use sensible defaults if details aren't provided (e.g. nearest UAMS clinic for clinic visits, a future date/time that makes sense).`;

const TOOLS: Anthropic.Tool[] = [
  {
    name: "create_appointment",
    description: "Book a new health appointment. Use when user confirms they want to schedule something.",
    input_schema: {
      type: "object" as const,
      properties: {
        title: { type: "string", description: "Appointment title (e.g. 'Blood Pressure Check')" },
        provider: { type: "string", description: "Provider or location name" },
        providerType: {
          type: "string",
          enum: ["clinic", "barbershop", "virtual", "ai"],
          description: "Type of appointment",
        },
        date: { type: "string", description: "Date string (e.g. 'Wednesday, Jun 18')" },
        time: { type: "string", description: "Time (e.g. '2:00 PM')" },
        location: { type: "string", description: "Location or address" },
        notes: { type: "string", description: "Optional notes" },
      },
      required: ["title", "provider", "providerType", "date", "time", "location"],
    },
  },
  {
    name: "cancel_appointment",
    description: "Cancel an existing appointment by its ID.",
    input_schema: {
      type: "object" as const,
      properties: {
        appointment_id: { type: "string", description: "The ID of the appointment to cancel" },
        reason: { type: "string", description: "Reason for cancellation (optional)" },
      },
      required: ["appointment_id"],
    },
  },
  {
    name: "reschedule_appointment",
    description: "Move an existing appointment to a new date and time.",
    input_schema: {
      type: "object" as const,
      properties: {
        appointment_id: { type: "string", description: "The ID of the appointment to reschedule" },
        new_date: { type: "string", description: "New date string" },
        new_time: { type: "string", description: "New time string" },
      },
      required: ["appointment_id", "new_date", "new_time"],
    },
  },
  {
    name: "register_event",
    description: "Register the user for a community health event or program.",
    input_schema: {
      type: "object" as const,
      properties: {
        event_name: { type: "string", description: "Name of the event" },
        event_date: { type: "string", description: "Date of the event" },
        event_location: { type: "string", description: "Location of the event" },
        event_type: {
          type: "string",
          description: "Type of event (e.g. 'health fair', 'support group', 'screening')",
        },
      },
      required: ["event_name", "event_date"],
    },
  },
];

export async function POST(req: NextRequest) {
  try {
    const { messages, appointments } = await req.json();

    // Convert chat messages to Anthropic format
    const anthropicMessages: Anthropic.MessageParam[] = messages
      .filter((m: { role: string }) => m.role !== "system")
      .map((m: { role: string; text: string }) => ({
        role: m.role === "ai" ? ("assistant" as const) : ("user" as const),
        content: m.text,
      }));

    // Inject appointments context into system prompt
    let systemWithContext = SYSTEM_PROMPT;
    if (appointments && appointments.length > 0) {
      const upcoming = appointments.filter(
        (a: { status: string }) => a.status === "confirmed" || a.status === "pending"
      );
      const apptList = appointments
        .map(
          (a: { id: string; title: string; provider: string; date: string; time: string; status: string }) =>
            `- ID: ${a.id} | "${a.title}" with ${a.provider} | ${a.date} at ${a.time} | Status: ${a.status}`
        )
        .join("\n");
      systemWithContext += `\n\nUser's appointments (${upcoming.length} upcoming):\n${apptList}`;
    }

    systemWithContext += `\n\nToday's date: ${new Date().toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`;

    let action: { type: string; data: Record<string, unknown> } | null = null;
    let finalText = "";

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemWithContext,
      tools: TOOLS,
      messages: anthropicMessages,
    });

    if (response.stop_reason === "tool_use") {
      const toolUseBlock = response.content.find(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );

      if (toolUseBlock) {
        action = {
          type: toolUseBlock.name,
          data: toolUseBlock.input as Record<string, unknown>,
        };

        const toolResultText: Record<string, string> = {
          create_appointment: "Appointment successfully created and added to your schedule.",
          cancel_appointment: "Appointment successfully cancelled.",
          reschedule_appointment: "Appointment successfully rescheduled.",
          register_event: "You're registered for the event.",
        };

        const continueMessages: Anthropic.MessageParam[] = [
          ...anthropicMessages,
          { role: "assistant" as const, content: response.content },
          {
            role: "user" as const,
            content: [
              {
                type: "tool_result" as const,
                tool_use_id: toolUseBlock.id,
                content: toolResultText[toolUseBlock.name] ?? "Done.",
              },
            ],
          },
        ];

        const continueResponse = await anthropic.messages.create({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 512,
          system: systemWithContext,
          tools: TOOLS,
          messages: continueMessages,
        });

        finalText = continueResponse.content
          .filter((b): b is Anthropic.TextBlock => b.type === "text")
          .map((b) => b.text)
          .join("");
      }
    } else {
      finalText = response.content
        .filter((b): b is Anthropic.TextBlock => b.type === "text")
        .map((b) => b.text)
        .join("");
    }

    return NextResponse.json({ text: finalText, action });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      {
        text: "I'm having trouble connecting right now. Please try again in a moment.",
        action: null,
      },
      { status: 500 }
    );
  }
}
