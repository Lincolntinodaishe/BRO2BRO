"use client";
import { useState, useRef, useEffect } from "react";
import {
  ArrowUp, Shield, RefreshCw, Phone, Sparkles,
  CheckCircle, XCircle, Calendar, Clock, Plus,
  MoreVertical, Pencil, Trash2,
} from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MessageContent } from "@/components/chat/message-content";
import {
  loadUserAppointments,
  saveUserAppointments,
  Appointment,
  ApptType,
} from "@/lib/appointments-store";
import { useAuth } from "@/lib/auth-context";

/* ── Types ──────────────────────────────────────────────────────────── */
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

/* ── Mock history ────────────────────────────────────────────────────── */
interface ChatHistoryItem {
  id: string;
  title: string;
  active: boolean;
}

const INITIAL_CHAT_HISTORY: ChatHistoryItem[] = [
  { id: "curr", title: "Current session",      active: true  },
  { id: "h1",   title: "Blood pressure check", active: false },
  { id: "h2",   title: "Mental wellness",      active: false },
  { id: "h3",   title: "Finding resources",    active: false },
  { id: "h4",   title: "Appointment booking",  active: false },
  { id: "h5",   title: "Stress & sleep",       active: false },
];

/* ── Helpers ─────────────────────────────────────────────────────────── */
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
  "Check my blood pressure",
  "I need to talk to someone",
  "Book an appointment",
];

function formatTime() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

/* ── Action cards ────────────────────────────────────────────────────── */
function ActionCard({ action }: { action: ActionResult }) {
  if (action.type === "create_appointment") return (
    <div className="mt-2 bg-green-50 border border-green-100 rounded-xl p-3 text-xs text-green-800">
      <div className="flex items-center gap-1.5 font-semibold mb-1">
        <CheckCircle className="h-3.5 w-3.5 text-green-600" /> Appointment Booked
      </div>
      <p className="font-medium">{action.data.title}</p>
      <p className="text-green-700">{action.data.provider}</p>
      <div className="flex flex-wrap gap-x-3 gap-y-0.5 mt-1 text-green-600">
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{action.data.date}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{action.data.time}</span>
      </div>
    </div>
  );

  if (action.type === "cancel_appointment") return (
    <div className="mt-2 bg-red-50 border border-red-100 rounded-xl p-3 text-xs text-red-800">
      <div className="flex items-center gap-1.5 font-semibold">
        <XCircle className="h-3.5 w-3.5 text-red-500" /> Appointment Cancelled
      </div>
      {action.data.reason && <p className="mt-0.5 text-red-600">{action.data.reason}</p>}
    </div>
  );

  if (action.type === "reschedule_appointment") return (
    <div className="mt-2 bg-amber-50 border border-amber-100 rounded-xl p-3 text-xs text-amber-800">
      <div className="flex items-center gap-1.5 font-semibold mb-1">
        <CheckCircle className="h-3.5 w-3.5 text-amber-600" /> Rescheduled
      </div>
      <div className="flex flex-wrap gap-x-3 text-amber-700">
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{action.data.new_date}</span>
        <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{action.data.new_time}</span>
      </div>
    </div>
  );

  if (action.type === "register_event") return (
    <div className="mt-2 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-800">
      <div className="flex items-center gap-1.5 font-semibold mb-1">
        <CheckCircle className="h-3.5 w-3.5 text-blue-600" /> Registered
      </div>
      <p className="font-medium">{action.data.event_name}</p>
      <div className="flex flex-wrap gap-x-3 mt-1 text-blue-600">
        <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{action.data.event_date}</span>
        {action.data.event_location && <span>{action.data.event_location}</span>}
      </div>
    </div>
  );

  return null;
}

/* ── History sidebar (hover-only expand) ────────────────────────────── */
function HistoryPanel({ onNewChat }: { onNewChat: () => void }) {
  const [history, setHistory] = useState<ChatHistoryItem[]>(INITIAL_CHAT_HISTORY);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-history-menu]")) setMenuOpenId(null);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function selectChat(id: string) {
    setHistory((prev) => prev.map((h) => ({ ...h, active: h.id === id })));
    setMenuOpenId(null);
    setEditingId(null);
  }

  function startRename(item: ChatHistoryItem) {
    setEditingId(item.id);
    setEditTitle(item.title);
    setMenuOpenId(null);
  }

  function saveRename(id: string) {
    const trimmed = editTitle.trim();
    if (!trimmed) return;
    setHistory((prev) => prev.map((h) => (h.id === id ? { ...h, title: trimmed } : h)));
    setEditingId(null);
    setEditTitle("");
  }

  function deleteChat(id: string) {
    setHistory((prev) => {
      const next = prev.filter((h) => h.id !== id);
      if (next.length === 0) {
        return [{ id: "curr", title: "New conversation", active: true }];
      }
      if (!next.some((h) => h.active)) {
        next[0] = { ...next[0], active: true };
      }
      return next;
    });
    setMenuOpenId(null);
    setEditingId(null);
  }

  return (
    <div className="group/hist flex-shrink-0 relative flex flex-col h-full border-r border-gray-100 bg-gray-50/60 overflow-hidden transition-[width] duration-300 ease-in-out w-[48px] hover:w-[210px]">

      {/* Collapsed strip — visible when NOT hovered */}
      <div className="absolute inset-0 flex flex-col items-center py-3 gap-2.5 group-hover/hist:opacity-0 transition-opacity duration-150 pointer-events-none">
        <div className="w-8 h-8 bg-black rounded-xl flex items-center justify-center shrink-0">
          <Plus className="h-3.5 w-3.5 text-white" />
        </div>
        <div className="w-px h-3 bg-gray-200 shrink-0" />
        {history.map((h) => (
          <div
            key={h.id}
            className={cn(
              "w-2 h-2 rounded-full shrink-0",
              h.active ? "bg-gray-900" : "bg-gray-300"
            )}
          />
        ))}
      </div>

      {/* Expanded panel — fades in on hover */}
      <div className="w-[210px] flex flex-col h-full opacity-0 group-hover/hist:opacity-100 transition-opacity duration-200 delay-100 pointer-events-none group-hover/hist:pointer-events-auto">
        <div className="px-3 pt-3 pb-2.5 flex items-center justify-between shrink-0">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">History</span>
          <button
            onClick={onNewChat}
            className="w-6 h-6 bg-black rounded-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
            title="New chat"
          >
            <Plus className="h-3 w-3 text-white" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
          {history.map((h) => (
            <div
              key={h.id}
              className={cn(
                "group/item relative flex items-center gap-1 rounded-xl",
                h.active ? "bg-gray-900" : "hover:bg-gray-100"
              )}
            >
              {editingId === h.id ? (
                <input
                  autoFocus
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onBlur={() => saveRename(h.id)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveRename(h.id);
                    if (e.key === "Escape") { setEditingId(null); setEditTitle(""); }
                  }}
                  className="flex-1 min-w-0 mx-2 my-2 px-2 py-1.5 text-xs font-medium rounded-lg border border-gray-200 outline-none focus:border-gray-400 bg-white text-gray-900"
                />
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => selectChat(h.id)}
                    className="flex-1 min-w-0 text-left px-2.5 py-2.5"
                  >
                    <span className={cn("text-xs font-semibold truncate block", h.active ? "text-white" : "text-gray-700")}>
                      {h.title}
                    </span>
                  </button>
                  <div className="relative shrink-0 pr-1.5" data-history-menu>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setMenuOpenId((prev) => (prev === h.id ? null : h.id));
                      }}
                      className={cn(
                        "p-1 rounded-md opacity-0 group-hover/item:opacity-100 transition-opacity",
                        h.active
                          ? "text-gray-400 hover:text-white hover:bg-white/10"
                          : "text-gray-400 hover:text-gray-700 hover:bg-gray-200/80",
                        menuOpenId === h.id && "opacity-100"
                      )}
                      aria-label="Chat options"
                    >
                      <MoreVertical className="h-3.5 w-3.5" />
                    </button>
                    {menuOpenId === h.id && (
                      <div className="absolute right-0 top-full mt-1 z-50 w-32 bg-white border border-gray-100 rounded-xl shadow-lg py-1 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => startRename(h)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Pencil className="h-3 w-3 text-gray-400" />
                          Rename
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteChat(h.id)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="h-3 w-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Main page ───────────────────────────────────────────────────────── */
export default function ChatPage() {
  const { user }                        = useAuth();
  const [messages, setMessages]         = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput]               = useState("");
  const [typing, setTyping]             = useState(false);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [apptLoaded, setApptLoaded]     = useState(false);
  const bottomRef   = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load appointments from Firebase when user is known
  useEffect(() => {
    if (!user) return;
    setApptLoaded(false);
    loadUserAppointments(user.uid).then((data) => {
      setAppointments(data);
      setApptLoaded(true);
    });
  }, [user?.uid]);

  // Save appointments to Firebase after any change (post-load only)
  useEffect(() => {
    if (!user || !apptLoaded) return;
    saveUserAppointments(user.uid, appointments).catch(console.error);
  }, [appointments, apptLoaded, user?.uid]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, typing]);

  function applyAction(action: ActionResult) {
    setAppointments((prev) => {
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
        return [...prev, newAppt];
      }
      if (action.type === "cancel_appointment") {
        return prev.map((a) =>
          a.id === action.data.appointment_id ? { ...a, status: "cancelled" as const } : a
        );
      }
      if (action.type === "reschedule_appointment") {
        return prev.map((a) =>
          a.id === action.data.appointment_id
            ? { ...a, date: action.data.new_date, time: action.data.new_time }
            : a
        );
      }
      return prev;
    });
  }

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || typing) return;
    setInput("");

    const userMsg: Message = { id: Date.now().toString(), role: "user", text: trimmed, timestamp: formatTime() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setTyping(true);

    try {
      const res  = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updated, appointments }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "ai", text: data.text, timestamp: formatTime(), action: data.action ?? undefined },
      ]);
      if (data.action) applyAction(data.action);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: (Date.now() + 1).toString(), role: "ai", text: "I'm having trouble connecting right now. Please try again.", timestamp: formatTime() },
      ]);
    } finally {
      setTyping(false);
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); }
  }

  function clearChat() {
    setMessages(INITIAL_MESSAGES);
    setTyping(false);
    textareaRef.current?.focus();
  }

  return (
    <div className="h-[calc(100dvh-8rem)] flex">
      <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">

        {/* ── History sidebar ── */}
        <HistoryPanel onNewChat={clearChat} />

        {/* ── Chat column ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Header */}
          <div className="flex items-center gap-3 px-5 py-3.5 border-b border-gray-100 shrink-0">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-white shrink-0 border border-gray-100">
              <BrandLogo alt="Bro AI" className="w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-bold text-gray-900">Bro AI</span>
                <Badge className="bg-green-50 text-green-700 border-green-100" size="sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1 inline-block" />
                  Online
                </Badge>
                <Badge className="bg-gray-50 text-gray-500 hidden sm:flex" size="sm">
                  <Sparkles className="h-2.5 w-2.5 mr-1" />
                  Motivational Interviewing
                </Badge>
              </div>
              <p className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                <Shield className="h-2.5 w-2.5" />
                End-to-end encrypted · Zero data retention
              </p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600" title="Call 988">
                <Phone className="h-4 w-4" />
              </button>
              <button onClick={clearChat} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-600" title="New chat">
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5">
            {messages.map((m) => (
              <div key={m.id} className={cn("flex gap-3", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                {m.role === "ai" && (
                  <div className="w-8 h-8 rounded-full overflow-hidden bg-white shrink-0 mt-0.5 border border-gray-100">
                    <BrandLogo alt="Bro" className="w-full h-full" />
                  </div>
                )}
                {/* ← NO flex-1 here — width is content-driven up to max-w */}
                <div className={cn("space-y-1 min-w-0", m.role === "user" ? "max-w-[68%]" : "max-w-[80%]")}>
                  <div className={cn(
                    "rounded-2xl px-4 py-3 text-sm leading-relaxed break-words",
                    m.role === "ai"
                      ? "bg-gray-100 text-gray-800 rounded-tl-sm"
                      : "bg-gray-900 text-white rounded-tr-sm"
                  )}>
                    <MessageContent text={m.text} role={m.role} />
                  </div>
                  {m.action && <ActionCard action={m.action} />}
                  <p className={cn("text-[11px] text-gray-400", m.role === "user" ? "text-right" : "text-left")}>
                    {m.timestamp}
                  </p>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-white shrink-0 mt-0.5 border border-gray-100">
                  <BrandLogo alt="Bro" className="w-full h-full" />
                </div>
                <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1.5">
                  <span className="dot1 w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <span className="dot2 w-1.5 h-1.5 bg-gray-400 rounded-full" />
                  <span className="dot3 w-1.5 h-1.5 bg-gray-400 rounded-full" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 2 && (
            <div className="px-5 pb-2 shrink-0">
              <p className="text-[11px] text-gray-400 mb-2">Quick replies</p>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_REPLIES.map((r) => (
                  <button
                    key={r}
                    onClick={() => send(r)}
                    className="text-xs bg-gray-50 border border-gray-200 rounded-full px-3 py-1.5 text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="px-4 pb-4 pt-2 border-t border-gray-100 shrink-0">
            <div className="flex items-end gap-2.5 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-gray-400 focus-within:ring-2 focus-within:ring-black/5 transition-all">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKey}
                placeholder="Type how you're feeling…"
                rows={1}
                className="flex-1 bg-transparent text-sm outline-none resize-none text-gray-900 placeholder:text-gray-400 max-h-32 leading-relaxed"
                style={{ minHeight: "22px" }}
              />
              <button
                onClick={() => send(input)}
                disabled={!input.trim() || typing}
                className="h-8 w-8 bg-black rounded-xl flex items-center justify-center shrink-0 hover:bg-gray-800 transition-colors disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-1"
              >
                <ArrowUp className="h-4 w-4 text-white" />
              </button>
            </div>
            <p className="text-[11px] text-gray-400 text-center mt-2">
              In crisis?{" "}
              <a href="tel:988" className="text-gray-900 font-semibold underline underline-offset-2">Text or call 988</a>
              {" "}· Bro AI is a wellness tool, not a substitute for emergency care.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
