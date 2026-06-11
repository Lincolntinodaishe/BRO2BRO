"use client";
import { useState } from "react";
import { Search, Flame, Phone, MapPin, X, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useMentorData } from "@/lib/use-mentor-data";
import { DEMO_ECOSYSTEM } from "@/lib/demo-ecosystem";
import type { MentorMentee, MenteeStatus } from "@/lib/demo-mentor-data";

const STATUS_MAP: Record<MenteeStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-teal-50 text-teal-700" },
  new:    { label: "New",    color: "bg-blue-50 text-blue-700" },
  paused: { label: "Paused", color: "bg-gray-100 text-gray-500" },
};

export default function MentorMenteesPage() {
  const { mentees, loading, updateMentee } = useMentorData();
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<MentorMentee | null>(null);
  const [note, setNote] = useState("");

  const filtered = mentees.filter((m) =>
    !query.trim() || m.name.toLowerCase().includes(query.toLowerCase())
  );

  function openDetail(m: MentorMentee) {
    setSelected(m);
    setNote(m.notes);
  }

  async function saveNotes() {
    if (!selected) return;
    await updateMentee(selected.id, { notes: note, lastCheckIn: "Today" });
    setSelected({ ...selected, notes: note, lastCheckIn: "Today" });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-gray-900">Mentees</h1>
          <p className="text-sm text-gray-500 mt-0.5">{mentees.length} people in your care</p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mentees…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30 focus:border-teal-500"
          />
        </div>
      </div>

      {mentees.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-gray-500">No mentees yet. Matches appear here when members connect through BRO2BRO.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((m) => {
            const st = STATUS_MAP[m.status];
            const isMarcus = m.name === DEMO_ECOSYSTEM.member.name;
            return (
              <Card
                key={m.id}
                className="cursor-pointer hover:shadow-card-hover transition-shadow duration-300"
                onClick={() => openDetail(m)}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    <Avatar name={m.name} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-gray-900">{m.name}</h3>
                        {isMarcus && (
                          <Badge size="sm" className="bg-teal-100 text-teal-700">Demo link</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{m.city}</p>
                    </div>
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0", st.color)}>
                      {st.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {m.focus.map((f) => (
                      <Badge key={f} size="sm" className="bg-gray-100 text-gray-600">{f}</Badge>
                    ))}
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Flame className="h-3 w-3 text-orange-500" /> {m.streak}d streak
                    </span>
                    <span>BP {m.bp}</span>
                    {m.unread > 0 && (
                      <span className="text-teal-600 font-semibold">{m.unread} new</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar name={selected.name} size="md" />
                <div>
                  <h2 className="font-bold text-gray-900">{selected.name}</h2>
                  <p className="text-xs text-gray-500">Last check-in: {selected.lastCheckIn}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-gray-100">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {selected.name === DEMO_ECOSYSTEM.member.name && (
                <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 text-sm text-teal-800">
                  Connected to member demo ({DEMO_ECOSYSTEM.member.email}) and barber client Marcus Williams at {DEMO_ECOSYSTEM.barber.shop}.
                </div>
              )}
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="h-4 w-4 text-gray-400" /> {selected.phone}
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="h-4 w-4 text-gray-400" /> {selected.city}
                </div>
              </div>
              <p className="text-xs text-gray-500">Referred by: {selected.referredBy}</p>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1.5">Mentor notes</label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={4}
                  className="w-full rounded-xl border border-gray-200 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/30"
                />
              </div>
              <div className="flex gap-2">
                <Button variant="gold" className="flex-1" onClick={saveNotes}>Save notes</Button>
                <Link href={`/dashboard/mentor/messages?mentee=${selected.id}`} className="flex-1">
                  <Button variant="outline" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-1.5" /> Message
                  </Button>
                </Link>
                <Link href="/dashboard/mentor/sessions?schedule=1">
                  <Button variant="outline">
                    <Calendar className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
