import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { uidFromPhone } from "@/lib/twilio-client";

if (process.env.NODE_ENV !== "production") {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
}

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const DB_URL = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

const SMS_SYSTEM = `You are Bro AI — a wellness companion for Black men in Arkansas, responding via SMS.

Your mission: help users with health questions, BRO2BRO features, blood pressure, diabetes, mental wellness, and local resources.

Context:
- 60% of Black men in Arkansas have hypertension, half uncontrolled
- UAMS has 61 partner barbershops for BP checks and referrals
- BRO2BRO app: bro2bro.app — appointments, mentors, community, AI chat
- Crisis line: 988 Suicide & Crisis Lifeline (24/7)

Tone: Warm, direct, real — like a trusted friend, not a doctor.
SMS format: SHORT replies only. Max 2-3 sentences. Never long paragraphs.
If user needs to do something in the app (book appointment, view resources), give them the link: bro2bro.app.
If any crisis signal, always include: "Text 988 anytime."

Today's date: ${new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}`;

function twimlMessage(body: string): NextResponse {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><Response><Message>${escaped}</Message></Response>`;
  return new NextResponse(xml, {
    status: 200,
    headers: { "Content-Type": "text/xml; charset=utf-8" },
  });
}

async function loadAppointmentsFromDB(uid: string): Promise<string> {
  if (!DB_URL) return "";
  try {
    const res = await fetch(`${DB_URL}/users/${uid}/appointments.json`);
    if (!res.ok) return "";
    const data = await res.json();
    if (!data) return "";
    const appts = Object.values(data) as Array<{
      title: string; provider: string; date: string; time: string; status: string;
    }>;
    const upcoming = appts.filter((a) => a.status === "confirmed" || a.status === "pending");
    if (!upcoming.length) return "";
    return (
      "\n\nUser's upcoming appointments:\n" +
      upcoming.map((a) => `- "${a.title}" with ${a.provider} on ${a.date} at ${a.time}`).join("\n")
    );
  } catch {
    return "";
  }
}

export async function POST(req: NextRequest) {
  // Parse Twilio's application/x-www-form-urlencoded body
  const formText = await req.text();
  const params = Object.fromEntries(new URLSearchParams(formText));

  const from    = params.From ?? "";
  const body    = (params.Body ?? "").trim();
  const numMedia = parseInt(params.NumMedia ?? "0", 10);

  if (!from || (!body && numMedia === 0)) {
    return twimlMessage("Hey! Send me a message and I'll help you out. Visit bro2bro.app for the full experience.");
  }

  // Image-only (no text)
  if (!body && numMedia > 0) {
    return twimlMessage("Got your image! I'm a text-based assistant right now. Type your question and I'll help. For more, visit bro2bro.app");
  }

  // Look up user account by phone number
  const uid = await uidFromPhone(from);
  const apptContext = uid ? await loadAppointmentsFromDB(uid) : "";

  const systemPrompt = SMS_SYSTEM + apptContext + (uid
    ? "\n\nThis user has a connected BRO2BRO account."
    : "\n\nThis user has NOT linked a BRO2BRO account yet. Remind them to save their phone number in Settings at bro2bro.app to unlock full features like appointment management via SMS.");

  let reply = "";

  try {
    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: systemPrompt,
      messages: [{ role: "user", content: body }],
    });

    reply = response.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("")
      .trim();
  } catch (err) {
    console.error("SMS AI error:", err);
    reply = "I'm having a moment. Try again or visit bro2bro.app for full support.";
  }

  // SMS length cap — split if over 1600 chars (rare but safe)
  if (reply.length > 1600) reply = reply.slice(0, 1597) + "…";

  return twimlMessage(reply);
}
