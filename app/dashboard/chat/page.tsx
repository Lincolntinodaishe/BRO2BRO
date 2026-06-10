"use client";
import { useState, useRef, useEffect } from "react";
import { ArrowRight, Shield, RefreshCw, Phone, MoreVertical, Sparkles, CheckCircle, XCircle, Calendar, Clock } from "lucide-react";
import Image from "next/image";
import bro2broLogo from "@/brand_assets/Bro2Bro logo.png";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageContent } from "@/components/chat/message-content";
import {
  loadAppointments,
  saveAppointments,
  Appointment,
  ApptType,
} from "@/lib/appointments-store";

interface ActionResult {
  type: "create_appointment" | "cancel_appointment" | "reschedule_appointment" | "register_event";
  data: Record<string, string>;
}

interface Message {
  id: string;
  role: "ai" | "user";
  text: string;
  timestamp: string;
  action?: ActionResult;
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "ai",
    text: "Hey. I'm Bro — your personal wellness companion. I'm here to check in on how you're doing, help you find care, and keep you connected to the community. How are you feeling today?",
    timestamp: "Just now",
  },
];

const QUICK_REPLIES = [
  "I've been stressed lately",
  "I'm doing okay",
  "I want to check my blood pressure",
  "I need to talk to someone",
  "Book an appointment for me",
  "Cancel my pending appointment",
];

function formatTime(): string {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function ActionCard({ action }: { action: ActionResult }) {
  const isCreate = action.type === "create_appointment";
  const isCancel = action.type === "cancel_appointment";
  const isReschedule = action.type === "reschedule_appointment";
  const isRegister = action.type === "register_event";

  if (isCreate) {
    return (
      <div className="mt-2 bg-green-50 border border-green-100 rounded-xl p-2.5 sm:p-3 text-xs text-green-800 overflow-hidden">
        <div className="flex items-center gap-1.5 font-semibold mb-1">
          <CheckCircle className="h-3.5 w-3.5 text-green-600" />
          Appointment Booked
        </div>
        <p className="font-medium">{action.data.title}</p>
        <p className="text-green-700">{action.data.provider}</p>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-1 text-green-600">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{action.data.date}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{action.data.time}</span>
        </div>
      </div>
    );
  }

  if (isCancel) {
    return (
      <div className="mt-2 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-800">
        <div className="flex items-center gap-1.5 font-semibold">
          <XCircle className="h-3.5 w-3.5 text-red-500" />
          Appointment Cancelled
        </div>
        {action.data.reason && <p className="mt-0.5 text-red-600">{action.data.reason}</p>}
      </div>
    );
  }

  if (isReschedule) {
    return (
      <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
        <div className="flex items-center gap-1.5 font-semibold mb-1">
          <CheckCircle className="h-3.5 w-3.5 text-amber-600" />
          Appointment Rescheduled
        </div>
        <div className="flex items-center gap-3 text-amber-700">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{action.data.new_date}</span>
          <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{action.data.new_time}</span>
        </div>
      </div>
    );
  }

  if (isRegister) {
    return (
      <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
        <div className="flex items-center gap-1.5 font-semibold mb-1">
          <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
          Registered for Event
        </div>
        <p className="font-medium">{action.data.event_name}</p>
        <div className="flex items-center gap-3 mt-1 text-blue-600">
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{action.data.event_date}</span>
          {action.data.event_location && <span>{action.data.event_location}</span>}
        </div>
      </div>
    );
  }

  return null;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load appointments from localStorage on mount
  useEffect(() => {
    setAppointments(loadAppointments());
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function applyAction(action: ActionResult) {
    setAppointments((prev) => {
      let updated: Appointment[];

      if (action.type === "create_appointment") {
        const d = action.data;
        const newAppt: Appointment = {
          id: Date.now().toString(),
          title: d.title,
          provider: d.provider,
          providerType: (d.providerType as ApptType) ?? "clinic",
          date: d.date,
          time: d.time,
          location: d.location,
          notes: d.notes,
          status: "confirmed",
          reminder: true,
        };
        updated = [...prev, newAppt];
      } else if (action.type === "cancel_appointment") {
        updated = prev.map((a) =>
          a.id === action.data.appointment_id ? { ...a, status: "cancelled" as const } : a
        );
      } else if (action.type === "reschedule_appointment") {
        updated = prev.map((a) =>
          a.id === action.data.appointment_id
            ? { ...a, date: action.data.new_date, time: action.data.new_time }
            : a
        );
      } else {
        updated = prev;
      }

      saveAppointments(updated);
      return updated;
    });
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setInput("");

    const userMsg: Message = {
      id: Date.now().toString(),
      role: "user",
      text: trimmed,
      timestamp: formatTime(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages,
          appointments,
        }),
      });

      const data = await res.json();

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "ai",
        text: data.text,
        timestamp: formatTime(),
        action: data.action ?? undefined,
      };

      setMessages((prev) => [...prev, aiMsg]);

      if (data.action) {
        applyAction(data.action);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: "ai",
          text: "I'm having trouble connecting right now. Please try again.",
          timestamp: formatTime(),
        },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function clearChat() {
    setMessages(INITIAL_MESSAGES);
    setTyping(false);
    inputRef.current?.focus();
  }

  return (
    <div className="space-y-4 sm:space-y-6 flex flex-col flex-1 min-h-0">
      <div>
        <h1 className="text-2xl font-black text-gray-900">AI Wellness Chat</h1>
        <p className="text-gray-500 text-sm mt-1">
          Talk with Bro AI — your private wellness companion for check-ins, care, and community support.
        </p>
      </div>

      <div className="bg-white rounded-xl sm:rounded-2xl border border-gray-100 shadow-card flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Header */}
        <div className="px-3 sm:px-5 py-3 sm:py-4 border-b border-gray-100 flex items-start sm:items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden bg-white shrink-0 border border-gray-100">
            <Image src={bro2broLogo} alt="Bro AI" width={40} height={40} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="text-sm font-bold text-gray-900">Bro AI</span>
              <Badge className="bg-green-50 text-green-700 border-green-100 shrink-0" size="sm">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 inline-block" />
                Online
              </Badge>
              <Badge className="hidden sm:flex bg-gray-50 text-gray-600 shrink-0" size="sm">
                <Sparkles className="h-3 w-3 mr-1" />
                <span className="hidden sm:inline">Motivational Interviewing</span>
                <span className="sm:hidden">MI</span>
              </Badge>
            </div>
            <div className="flex items-start sm:items-center gap-1.5 text-[10px] sm:text-xs text-gray-400 mt-0.5 leading-snug">
              <Shield className="h-3 w-3 shrink-0 mt-0.5 sm:mt-0" />
              <span className="break-words">End-to-end encrypted · Private · Zero data retention</span>
            </div>
          </div>
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
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
        <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden px-3 sm:px-5 py-4 sm:py-5 space-y-3 sm:space-y-4">
          {messages.map((m) => (
            <div
              key={m.id}
              className={cn(
                "flex gap-2 sm:gap-3 w-full max-w-[95%] sm:max-w-[88%]",
                m.role === "user" ? "flex-row-reverse ml-auto" : "flex-row"
              )}
            >
              {m.role === "ai" && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white shrink-0 mt-0.5 border border-gray-100">
                  <Image src={bro2broLogo} alt="Bro AI" width={32} height={32} className="w-full h-full object-contain" />
                </div>
              )}
              <div className="space-y-1 min-w-0 flex-1">
                <div
                  className={cn(
                    "rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 text-sm leading-relaxed",
                    m.role === "ai"
                      ? "bg-gray-100 text-gray-800 rounded-tl-sm msg-in"
                      : "bg-black text-white rounded-tr-sm msg-out"
                  )}
                >
                  <MessageContent text={m.text} role={m.role} />
                </div>
                {m.action && <ActionCard action={m.action} />}
                <div className={cn("text-xs text-gray-400", m.role === "user" ? "text-right" : "text-left")}>
                  {m.timestamp}
                </div>
              </div>
            </div>
          ))}

          {typing && (
            <div className="flex gap-2 sm:gap-3 max-w-[95%] sm:max-w-[88%]">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden bg-white shrink-0 mt-0.5 border border-gray-100">
                <Image src={bro2broLogo} alt="Bro AI" width={32} height={32} className="w-full h-full object-contain" />
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
          <div className="px-3 sm:px-5 pb-2 sm:pb-3 shrink-0">
            <p className="text-xs text-gray-400 mb-2">Quick replies:</p>
            <div className="flex flex-wrap gap-1.5 sm:gap-2">
              {QUICK_REPLIES.map((r) => (
                <button
                  key={r}
                  onClick={() => send(r)}
                  className="text-[11px] sm:text-xs bg-gray-50 border border-gray-200 rounded-full px-2.5 sm:px-3 py-1.5 text-gray-700 hover:bg-gray-100 hover:border-gray-300 transition-colors max-w-full text-left"
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Type how you're feeling…"
              className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-colors"
            />
            <button
              onClick={() => send(input)}
              disabled={!input.trim() || typing}
              className="h-9 w-9 sm:h-10 sm:w-10 bg-black rounded-full flex items-center justify-center shrink-0 hover:bg-gray-800 transition-colors disabled:opacity-40"
            >
              <ArrowRight className="h-4 w-4 sm:h-4.5 sm:w-4.5 text-white" />
            </button>
          </div>
          <p className="text-[10px] sm:text-xs text-gray-400 text-center mt-2 leading-relaxed px-1">
            In crisis?{" "}
            <a href="tel:988" className="text-black font-semibold underline">
              Text or call 988
            </a>{" "}
            · Bro AI is a wellness tool, not a substitute for emergency care.
          </p>
        </div>
      </div>
    </div>
  );
}
