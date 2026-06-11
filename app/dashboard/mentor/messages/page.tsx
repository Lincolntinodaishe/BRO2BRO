"use client";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Send, MessageCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useMentorData } from "@/lib/use-mentor-data";
import { DEMO_ECOSYSTEM } from "@/lib/demo-ecosystem";

export default function MentorMessagesPage() {
  const searchParams = useSearchParams();
  const { mentees, messages, loading, sendMessage, markMessagesRead } = useMentorData();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");

  const threads = useMemo(() => {
    const byMentee = new Map<string, typeof messages>();
    for (const m of messages) {
      const list = byMentee.get(m.menteeId) ?? [];
      list.push(m);
      byMentee.set(m.menteeId, list);
    }
    return mentees
      .map((mentee) => ({
        mentee,
        msgs: (byMentee.get(mentee.id) ?? []).sort((a, b) => (a.time > b.time ? -1 : 1)),
      }))
      .filter((t) =>
        t.msgs.length > 0 ||
        messages.some((m) => m.menteeId === t.mentee.id && !m.read && m.sender === "mentee")
      );
  }, [mentees, messages]);

  useEffect(() => {
    const param = searchParams.get("mentee");
    if (param) setActiveId(param);
    else if (!activeId && threads.length) setActiveId(threads[0].mentee.id);
  }, [searchParams, threads, activeId]);

  useEffect(() => {
    if (activeId) void markMessagesRead(activeId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId]);

  const activeThread = threads.find((t) => t.mentee.id === activeId);
  const activeMsgs = activeThread?.msgs ?? [];

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || !activeId || !activeThread) return;
    await sendMessage({
      id: `m-${Date.now()}`,
      menteeId: activeId,
      menteeName: activeThread.mentee.name,
      sender: "mentor",
      text: draft.trim(),
      time: "Just now",
      read: true,
    });
    setDraft("");
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {activeThread?.mentee.name === DEMO_ECOSYSTEM.member.name
            ? `Chat with ${DEMO_ECOSYSTEM.member.name} — same account as member demo`
            : "Stay connected with your mentees"}
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col lg:flex-row min-h-[min(70vh,480px)] lg:min-h-[480px]">
        <div
          className={cn(
            "lg:w-72 border-b lg:border-b-0 lg:border-r border-gray-100 shrink-0 max-h-[40vh] lg:max-h-none overflow-y-auto",
            activeId ? "hidden lg:block" : "block"
          )}
        >
          {threads.length === 0 ? (
            <p className="p-6 text-sm text-gray-500 text-center">No conversations yet.</p>
          ) : (
            threads.map(({ mentee, msgs }) => {
              const unread = msgs.filter((m) => !m.read && m.sender === "mentee").length;
              const last = msgs[0];
              return (
                <button
                  key={mentee.id}
                  onClick={() => setActiveId(mentee.id)}
                  className={cn(
                    "w-full flex items-center gap-3 p-4 text-left hover:bg-gray-50 transition-colors border-b border-gray-50",
                    activeId === mentee.id && "bg-teal-50"
                  )}
                >
                  <Avatar name={mentee.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-gray-900 truncate">{mentee.name}</span>
                      {unread > 0 && (
                        <span className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                          {unread}
                        </span>
                      )}
                    </div>
                    {last && <p className="text-xs text-gray-500 truncate mt-0.5">{last.text}</p>}
                  </div>
                </button>
              );
            })
          )}
        </div>

        <div
          className={cn(
            "flex-1 flex flex-col min-h-[360px]",
            activeId ? "flex" : "hidden lg:flex"
          )}
        >
          {!activeThread ? (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8">
              <MessageCircle className="h-10 w-10 mb-3" />
              <p className="text-sm">Select a conversation</p>
            </div>
          ) : (
            <>
              <div className="px-3 sm:px-5 py-3 border-b border-gray-100 flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setActiveId(null)}
                  className="lg:hidden p-2 -ml-1 rounded-lg hover:bg-gray-100 shrink-0"
                  aria-label="Back to conversations"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-600" />
                </button>
                <Avatar name={activeThread.mentee.name} size="sm" />
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">{activeThread.mentee.name}</p>
                  <p className="text-xs text-gray-500 truncate">{activeThread.mentee.focus.join(" · ")}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-3">
                {[...activeMsgs].reverse().map((msg) => (
                  <div
                    key={msg.id}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                      msg.sender === "mentor"
                        ? "ml-auto bg-black text-white"
                        : "bg-gray-100 text-gray-800"
                    )}
                  >
                    <p>{msg.text}</p>
                    <p className={cn("text-[10px] mt-1", msg.sender === "mentor" ? "text-gray-400" : "text-gray-500")}>
                      {msg.time}
                    </p>
                  </div>
                ))}
              </div>
              <form onSubmit={handleSend} className="p-4 border-t border-gray-100 flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type a message…"
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
                <Button type="submit" variant="gold" disabled={!draft.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
