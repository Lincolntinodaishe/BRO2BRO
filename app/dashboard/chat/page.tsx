"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, Heart, Shield, RefreshCw, Phone, MoreVertical, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "ai" | "user";
  text: string;
  timestamp: string;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    text: "Hey. I'm Pulse — your personal wellness companion. I'm here to check in on how you're doing, help you find care, and keep you connected to the community. How are you feeling today?",
    timestamp: "Just now",
  },
];

const AI_RESPONSES: Array<{ match: RegExp | string[]; response: string }> = [
  {
    match: ["stressed", "stress", "work", "pressure"],
    response: "That kind of stress builds up in the body — and for us, it often shows up as high blood pressure before we even notice. Is it mostly work, or is life outside work piling on too? Either way, I'm here.",
  },
  {
    match: ["tired", "exhaust", "worn out", "no energy"],
    response: "Physical tired or that deeper tired — where you're going through the motions but not really present? Sometimes those are different problems with different answers. Which one feels closer?",
  },
  {
    match: ["good", "great", "fine", "alright", "okay"],
    response: "Glad to hear it. Staying consistent when things are good is the real key. Are you keeping up with check-ins — blood pressure, glucose, anything like that? It's the best time to build the habit.",
  },
  {
    match: ["blood pressure", "bp", "hypertension", "heart"],
    response: "Blood pressure is the big one for us — 60% of Black men in Arkansas have it, half uncontrolled. The good news: with consistent monitoring and small changes, the turnaround is fast. Want me to find free BP check spots near you?",
  },
  {
    match: ["mental", "anxiety", "depression", "sad", "lonely"],
    response: "Thank you for saying that — it takes real strength to name it. Mental health is health. There are counselors in this network who've worked specifically with Black men, and your first session can be free. Do you want me to connect you?",
  },
  {
    match: ["appointment", "book", "clinic", "doctor"],
    response: "Let's find someone you can actually trust. I can show you clinics near you, filter by insurance (or no insurance), and book directly. Want me to pull up options?",
  },
  {
    match: ["barber", "barbershop", "trustee"],
    response: "Your barber might already be trained in this — UAMS has 61 partner barbershops in Arkansas. They can do BP readings, screen for diabetes, and refer you. Want to see if your spot is on the list?",
  },
  {
    match: ["mentor", "advice", "someone who"],
    response: "Sometimes what you need is someone who's been through it — not a doctor, not a hotline, just a man who gets it. I can connect you with a peer mentor in your area. What's the main thing you'd want to talk through?",
  },
  {
    match: ["crisis", "harm", "hurt", "end it", "suicide"],
    response: "I hear you, and I'm not going anywhere. If things feel urgent right now — please text or call 988. That's the Suicide & Crisis Lifeline and they're there 24/7. You can also reply here and I'll stay with you.",
  },
];

function getAIResponse(input: string): string {
  const lower = input.toLowerCase();
  for (const { match, response } of AI_RESPONSES) {
    const terms = Array.isArray(match) ? match : [];
    if (terms.some((t) => lower.includes(t))) return response;
  }
  return "I hear you. Tell me more — what's going on day to day? Sometimes just talking it through helps me figure out what kind of support would actually be useful.";
}

const QUICK_REPLIES = [
  "I've been stressed lately",
  "I'm doing okay",
  "I want to check my blood pressure",
  "I need to talk to someone",
  "Find resources near me",
  "Book an appointment",
];

function formatTime(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setInput("");

    setMessages((prev) => [
      ...prev,
      { id: Date.now().toString(), role: "user", text: trimmed, timestamp: formatTime() },
    ]);

    setTyping(true);
    const delay = 1200 + Math.random() * 800;
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: getAIResponse(trimmed),
          timestamp: formatTime(),
        },
      ]);
      setTyping(false);
    }, delay);
  }

  function clearChat() {
    setMessages(INITIAL_MESSAGES);
    setTyping(false);
    inputRef.current?.focus();
  }

  return (
    <div className="max-w-3xl mx-auto h-[calc(100vh-8rem)] flex flex-col">
      {/* Chat card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-card flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
            <Heart className="h-5 w-5 text-amber-400 fill-amber-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-gray-900">Pulse AI</span>
              <Badge className="bg-green-50 text-green-700 border-green-100" size="sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 inline-block" />
                Online
              </Badge>
              <Badge className="bg-gray-50 text-gray-600" size="sm">
                <Sparkles className="h-3 w-3 mr-1" />
                Motivational Interviewing
              </Badge>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-0.5">
              <Shield className="h-3 w-3" />
              End-to-end encrypted · Private · Zero data retention
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon-sm" title="Emergency resources">
              <Phone className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm" onClick={clearChat} title="New conversation">
              <RefreshCw className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn("flex gap-3 max-w-[88%]", m.role === "user" ? "flex-row-reverse ml-auto" : "flex-row")}
            >
              {m.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="h-4 w-4 text-amber-400 fill-amber-400" />
                </div>
              )}
              <div className="space-y-1">
                <div
                  className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    m.role === "ai"
                      ? "bg-gray-100 text-gray-800 rounded-tl-sm msg-in"
                      : "bg-black text-white rounded-tr-sm msg-out"
                  )}
                >
                  {m.text}
                </div>
                <div className={cn("text-xs text-gray-400", m.role === "user" ? "text-right" : "text-left")}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-3 max-w-[88%]">
              <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5">
                <Heart className="h-4 w-4 text-amber-400 fill-amber-400" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3.5 flex items-center gap-1.5 msg-in">
                <span className="dot1 w-2 h-2 bg-gray-400 rounded-full inline-block" />
                <span className="dot2 w-2 h-2 bg-gray-400 rounded-full inline-block" />
                <span className="dot3 w-2 h-2 bg-gray-400 rounded-full inline-block" />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Quick replies */}
        {messages.length <= 2 && (
          <div className="px-5 pb-3">
            <p className="text-xs text-gray-400 mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-2">
              {QUICK_REPLIES.map((r) => (
                <button
                  key={r}
                  onClick={() => send(r)}
                  className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-4 py-4 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Type how you're feeling…"
              className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-colors"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              className="h-10 w-10 bg-black rounded-full flex items-center justify-center shrink-0 hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              <ArrowRight className="h-4.5 w-4.5 text-white" />
            </button>
          </div>
          <p className="text-xs text-gray-400 text-center mt-2">
            In crisis?{" "}
            <a href="tel:988" className="text-black font-semibold underline">
              Text or call 988
            </a>{" "}
            · Pulse AI is a wellness tool, not a substitute for emergency care.
          </p>
        </div>
      </div>
    </div>
  );
}
