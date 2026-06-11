"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Calendar, Video, Phone, MapPin, Plus, X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMentorData } from "@/lib/use-mentor-data";
import type { MentorSession, SessionStatus } from "@/lib/demo-mentor-data";

const FORMAT_ICONS = { video: Video, phone: Phone, "in-person": MapPin };
const STATUS_STYLE: Record<SessionStatus, string> = {
  upcoming:  "bg-teal-50 text-teal-700",
  completed: "bg-gray-100 text-gray-600",
  cancelled: "bg-red-50 text-red-600",
};

export default function MentorSessionsPage() {
  const searchParams = useSearchParams();
  const { sessions, mentees, loading, addSession, updateSession } = useMentorData();
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    menteeId: "",
    title: "",
    date: "",
    time: "",
    format: "video" as MentorSession["format"],
    notes: "",
  });

  useEffect(() => {
    if (searchParams.get("schedule") === "1") setShowModal(true);
  }, [searchParams]);

  async function handleSchedule(e: React.FormEvent) {
    e.preventDefault();
    const mentee = mentees.find((m) => m.id === form.menteeId);
    if (!mentee) return;
    await addSession({
      id: `s-${Date.now()}`,
      menteeId: mentee.id,
      menteeName: mentee.name,
      title: form.title || "Wellness Check-in",
      date: form.date || "TBD",
      time: form.time || "TBD",
      format: form.format,
      status: "upcoming",
      notes: form.notes,
    });
    setShowModal(false);
    setForm({ menteeId: "", title: "", date: "", time: "", format: "video", notes: "" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  const upcoming = sessions.filter((s) => s.status === "upcoming");
  const past = sessions.filter((s) => s.status !== "upcoming");

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Sessions</h1>
          <p className="text-sm text-gray-500 mt-0.5">{upcoming.length} upcoming · {past.length} past</p>
        </div>
        <Button variant="gold" onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Schedule Session
        </Button>
      </div>

      {sessions.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Calendar className="h-10 w-10 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 mb-4">No sessions yet. Schedule your first check-in with a mentee.</p>
            <Button variant="gold" onClick={() => setShowModal(true)}>Schedule Session</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Upcoming</h2>
              <div className="space-y-3">
                {upcoming.map((s) => (
                  <SessionRow key={s.id} session={s} onComplete={() => updateSession(s.id, { status: "completed" })} />
                ))}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Past</h2>
              <div className="space-y-3">
                {past.map((s) => (
                  <SessionRow key={s.id} session={s} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowModal(false)} />
          <form onSubmit={handleSchedule} className="relative bg-white w-full max-w-md rounded-2xl shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-gray-900">Schedule Session</h2>
              <button type="button" onClick={() => setShowModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Mentee</label>
              <select
                required
                value={form.menteeId}
                onChange={(e) => setForm((f) => ({ ...f, menteeId: e.target.value }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              >
                <option value="">Select mentee…</option>
                {mentees.map((m) => (
                  <option key={m.id} value={m.id}>{m.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                placeholder="Weekly BP & Wellness Check-in"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Date</label>
                <input
                  value={form.date}
                  onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                  placeholder="Tomorrow"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Time</label>
                <input
                  value={form.time}
                  onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                  placeholder="6:00 PM"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
                />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Format</label>
              <select
                value={form.format}
                onChange={(e) => setForm((f) => ({ ...f, format: e.target.value as MentorSession["format"] }))}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm"
              >
                <option value="video">Video</option>
                <option value="phone">Phone</option>
                <option value="in-person">In-person</option>
              </select>
            </div>
            <Button type="submit" variant="gold" className="w-full">Schedule</Button>
          </form>
        </div>
      )}
    </div>
  );
}

function SessionRow({ session, onComplete }: { session: MentorSession; onComplete?: () => void }) {
  const Icon = FORMAT_ICONS[session.format];
  return (
    <Card>
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-teal-50 flex items-center justify-center shrink-0">
          <Icon className="h-5 w-5 text-teal-600" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900">{session.title}</h3>
          <p className="text-sm text-gray-500">{session.menteeName} · {session.date} · {session.time}</p>
          {session.notes && <p className="text-xs text-gray-400 mt-1 line-clamp-2">{session.notes}</p>}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge size="sm" className={cn(STATUS_STYLE[session.status])}>{session.status}</Badge>
          {session.status === "upcoming" && onComplete && (
            <Button variant="outline" size="sm" onClick={onComplete}>
              <CheckCircle className="h-3.5 w-3.5 mr-1" /> Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
