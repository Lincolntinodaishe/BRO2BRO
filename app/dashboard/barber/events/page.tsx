"use client";
import { useState } from "react";
import {
  CalendarDays, MapPin, Clock, Users, CheckCircle,
  Scissors, Mic2, Heart, Award, X, ChevronRight,
  BookOpen, Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

type EventType = "barbershop-talk" | "training" | "health-fair" | "community";

interface BarberEvent {
  id: string;
  type: EventType;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  address: string;
  seats: number;
  seatsLeft: number;
  host: string;
  hostRole: string;
  tags: string[];
  isPast?: boolean;
  isRegistered?: boolean;
  isFeatured?: boolean;
}

const EVENTS: BarberEvent[] = [
  {
    id: "1",
    type: "barbershop-talk",
    title: "Barbershop Talk: Men's Mental Health",
    description: "A guided conversation for barbers and clients on recognizing depression, reducing stigma, and making referrals without losing the trust of the chair. Facilitated by a licensed counselor, held in a real shop.",
    date: "Sat, Jun 14",
    time: "10:00 AM – 12:00 PM",
    location: "Joe's Classic Cuts",
    address: "1523 Main St, Little Rock, AR",
    seats: 20,
    seatsLeft: 6,
    host: "BRO2BRO & UAMS",
    hostRole: "Program Partners",
    tags: ["Mental Health", "In-Person", "Free"],
    isFeatured: true,
    isRegistered: false,
  },
  {
    id: "2",
    type: "training",
    title: "CHW Module Workshop: Diabetes Awareness",
    description: "Live walkthrough of Module 4 with a UAMS diabetes educator. Earn your module credit, get hands-on with glucose meters, and ask your questions in a small group. Counts toward certification.",
    date: "Wed, Jun 18",
    time: "6:00 PM – 7:30 PM",
    location: "UAMS Community Health Center",
    address: "4301 W Markham St, Little Rock, AR",
    seats: 15,
    seatsLeft: 4,
    host: "Dr. Keisha Moore, DNP",
    hostRole: "UAMS Diabetes Educator",
    tags: ["Training", "Certification Credit", "Free"],
    isRegistered: false,
  },
  {
    id: "3",
    type: "health-fair",
    title: "Little Rock Health & Wellness Fair",
    description: "Partner with other CHW barbers at a community health fair. Set up a BP screening booth, distribute BRO2BRO resources, and connect 50+ community members with local providers. Counts as 10 client screenings.",
    date: "Sat, Jun 21",
    time: "9:00 AM – 2:00 PM",
    location: "Dunbar Community Center",
    address: "1100 Wright Ave, Little Rock, AR",
    seats: 12,
    seatsLeft: 5,
    host: "Pulaski County Health Dept.",
    hostRole: "Community Partner",
    tags: ["Health Fair", "Volunteer", "Counts as 10 Screenings"],
    isRegistered: false,
  },
  {
    id: "4",
    type: "barbershop-talk",
    title: "Barbershop Talk: Fatherhood & Stress",
    description: "An honest, facilitated conversation on the pressures of fatherhood, provider stress, and how to ask for help before a crisis hits. Guest speaker is a therapist and father of three.",
    date: "Sat, Jun 28",
    time: "11:00 AM – 1:00 PM",
    location: "Cuts by King",
    address: "2200 Geyer Springs Rd, Little Rock, AR",
    seats: 18,
    seatsLeft: 11,
    host: "BRO2BRO",
    hostRole: "Program Host",
    tags: ["Mental Health", "In-Person", "Free"],
    isRegistered: false,
  },
  {
    id: "5",
    type: "training",
    title: "Live Q&A: Handling High-BP Discoveries",
    description: "Weekly live session for certified and in-training CHW barbers. Bring your toughest client scenarios. What do you say when BP is 158/100 and the client refuses to go to the doctor?",
    date: "Thu, Jul 3",
    time: "7:00 PM – 8:00 PM",
    location: "Zoom (virtual)",
    address: "Link sent after registration",
    seats: 50,
    seatsLeft: 33,
    host: "Marcus T., Head CHW",
    hostRole: "BRO2BRO Lead Trainer",
    tags: ["Virtual", "Training", "Free"],
    isRegistered: false,
  },
  {
    id: "6",
    type: "community",
    title: "CHW Barber Cohort Meetup",
    description: "Monthly meetup for all certified and in-training CHW barbers in Central Arkansas. Share wins, troubleshoot tough cases, pick up new referral cards, and meet the latest cohort of barbers.",
    date: "Sat, Jul 12",
    time: "10:00 AM – 12:00 PM",
    location: "Fellowship Christian Center",
    address: "12100 Colonel Glenn Rd, Little Rock, AR",
    seats: 30,
    seatsLeft: 18,
    host: "BRO2BRO Chapter — LR",
    hostRole: "Community Organizer",
    tags: ["Networking", "In-Person", "Free"],
    isRegistered: false,
  },
  // Past events
  {
    id: "7",
    type: "barbershop-talk",
    title: "Barbershop Talk: Blood Pressure & Black Men",
    description: "Last month's inaugural Barbershop Talk — 22 attendees, 9 BP screenings, 3 referrals made on the spot.",
    date: "Sat, May 17",
    time: "10:00 AM",
    location: "Joe's Classic Cuts",
    address: "1523 Main St, Little Rock, AR",
    seats: 20,
    seatsLeft: 0,
    host: "BRO2BRO",
    hostRole: "Program Host",
    tags: ["Barbershop Talk", "Past"],
    isPast: true,
    isRegistered: true,
  },
];

const TYPE_CONFIG: Record<EventType, { label: string; color: string; icon: typeof Scissors }> = {
  "barbershop-talk": { label: "Barbershop Talk", color: "bg-amber-50 text-amber-700 border-amber-100", icon: Mic2      },
  training:          { label: "Training",         color: "bg-blue-50 text-blue-700 border-blue-100",   icon: BookOpen  },
  "health-fair":     { label: "Health Fair",      color: "bg-teal-50 text-teal-700 border-teal-100",   icon: Heart     },
  community:         { label: "Community",        color: "bg-purple-50 text-purple-700 border-purple-100", icon: Users },
};

function EventDetailModal({ event: ev, onClose, onRegister }: { event: BarberEvent; onClose: () => void; onRegister: (id: string) => void }) {
  const t = TYPE_CONFIG[ev.type];
  const pctFull = Math.round(((ev.seats - ev.seatsLeft) / ev.seats) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-fade-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="relative overflow-hidden rounded-t-2xl bg-black px-6 pt-6 pb-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge className={cn("mb-2", t.color)} size="sm">
                <t.icon className="h-2.5 w-2.5 mr-1" />{t.label}
              </Badge>
              <h2 className="text-lg font-black text-white leading-snug">{ev.title}</h2>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-sm text-gray-700 leading-relaxed">{ev.description}</p>

          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: CalendarDays, label: "Date", value: ev.date },
              { icon: Clock,        label: "Time", value: ev.time },
              { icon: MapPin,       label: "Location", value: ev.location },
              { icon: Users,        label: "Host", value: ev.host },
            ].map(d => (
              <div key={d.label} className="bg-gray-50 rounded-xl p-3">
                <div className="flex items-center gap-1.5 mb-1">
                  <d.icon className="h-3 w-3 text-gray-400" />
                  <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{d.label}</span>
                </div>
                <span className="text-xs font-semibold text-gray-800">{d.value}</span>
              </div>
            ))}
          </div>

          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5 flex items-center gap-2">
              Seats remaining
              <span className={cn("font-bold", ev.seatsLeft <= 5 ? "text-red-600" : "text-gray-700")}>
                {ev.seatsLeft} of {ev.seats}
              </span>
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className={cn("h-2 rounded-full transition-all", pctFull >= 80 ? "bg-red-500" : "bg-amber-500")}
                style={{ width: `${pctFull}%` }}
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {ev.tags.map(tag => (
              <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          <p className="text-xs text-gray-400 flex items-center gap-1">
            <MapPin className="h-3 w-3" />{ev.address}
          </p>
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Close</Button>
          {!ev.isPast && (
            <Button
              size="sm" className="flex-1 gap-2"
              disabled={ev.isRegistered || ev.seatsLeft === 0}
              onClick={() => { onRegister(ev.id); onClose(); }}
            >
              {ev.isRegistered ? <><CheckCircle className="h-3.5 w-3.5" /> Registered</> : "Register Now"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BarberEventsPage() {
  const { displayName } = useAuth();
  const [events, setEvents]     = useState<BarberEvent[]>(EVENTS);
  const [selected, setSelected] = useState<BarberEvent | null>(null);
  const [filter, setFilter]     = useState<"all" | EventType | "registered">("all");

  function handleRegister(id: string) {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, isRegistered: true, seatsLeft: Math.max(0, e.seatsLeft - 1) } : e));
  }

  const upcoming = events.filter(e => !e.isPast);
  const past     = events.filter(e => e.isPast);
  const registered = upcoming.filter(e => e.isRegistered);

  const filteredUpcoming = upcoming.filter(e => {
    if (filter === "registered") return e.isRegistered;
    if (filter === "all") return true;
    return e.type === filter;
  });

  return (
    <div className="space-y-6">

      {/* Hero */}
      <div className="bg-black rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center">
              <Mic2 className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="text-amber-400 text-sm font-semibold">Events & Workshops</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">
            The barbershop is the classroom.
          </h1>
          <p className="text-gray-400 text-sm">
            {upcoming.length} upcoming events · {registered.length} registered · open to all CHW barbers
          </p>
        </div>
        <div className="shrink-0">
          <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 px-3 py-2 text-sm">
            {registered.length > 0 ? `${registered.length} event${registered.length > 1 ? "s" : ""} registered` : "Register for an event below"}
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Barbershop Talks", count: upcoming.filter(e => e.type === "barbershop-talk").length, icon: Mic2,       color: "bg-amber-50 text-amber-600" },
          { label: "Training Events",  count: upcoming.filter(e => e.type === "training").length,          icon: BookOpen,   color: "bg-blue-50 text-blue-600"   },
          { label: "Health Fairs",     count: upcoming.filter(e => e.type === "health-fair").length,       icon: Heart,      color: "bg-teal-50 text-teal-600"   },
          { label: "My Registrations", count: registered.length,                                           icon: CheckCircle,color: "bg-green-50 text-green-600" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", s.color)}>
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xl font-black text-gray-900">{s.count}</div>
              <div className="text-xs text-gray-500 leading-tight">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {([
          { key: "all",             label: "All Events"       },
          { key: "barbershop-talk", label: "Barbershop Talk"  },
          { key: "training",        label: "Training"          },
          { key: "health-fair",     label: "Health Fairs"     },
          { key: "registered",      label: `Registered (${registered.length})` },
        ] as const).map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
              filter === f.key ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Upcoming events */}
      <div>
        <h2 className="text-sm font-bold text-gray-900 mb-3">Upcoming</h2>
        <div className="space-y-3">
          {filteredUpcoming.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center">
                <p className="text-sm text-gray-500">No events match this filter.</p>
              </CardContent>
            </Card>
          ) : (
            filteredUpcoming.map(ev => {
              const t = TYPE_CONFIG[ev.type];
              const pctFull = Math.round(((ev.seats - ev.seatsLeft) / ev.seats) * 100);
              return (
                <Card
                  key={ev.id}
                  className={cn(
                    "cursor-pointer hover:shadow-md transition-all duration-200",
                    ev.isFeatured && "ring-2 ring-amber-500/40",
                    ev.isRegistered && "ring-2 ring-green-500/40"
                  )}
                  onClick={() => setSelected(ev)}
                >
                  <CardContent className="p-0">
                    <div className="flex items-start gap-4 p-5">
                      {/* Date block */}
                      <div className="shrink-0 text-center bg-gray-50 rounded-xl p-2.5 min-w-[52px] border border-gray-100">
                        <div className="text-[10px] text-gray-400 font-semibold uppercase">
                          {ev.date.split(",")[0]}
                        </div>
                        <div className="text-xl font-black text-gray-900 leading-none">
                          {ev.date.split(" ")[1]}
                        </div>
                        <div className="text-[10px] text-gray-500">{ev.date.split(" ")[2]}</div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap mb-1">
                            <Badge className={t.color} size="sm">
                              <t.icon className="h-2.5 w-2.5 mr-1" />{t.label}
                            </Badge>
                            {ev.isFeatured && !ev.isRegistered && (
                              <Badge className="bg-amber-500 text-black border-transparent" size="sm">Featured</Badge>
                            )}
                            {ev.isRegistered && (
                              <Badge className="bg-green-500 text-white border-transparent" size="sm">
                                <CheckCircle className="h-2.5 w-2.5 mr-1" /> Registered
                              </Badge>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-gray-300 shrink-0 mt-0.5" />
                        </div>
                        <h3 className="text-sm font-bold text-gray-900 mb-1.5">{ev.title}</h3>
                        <div className="flex items-center gap-3 text-xs text-gray-500 flex-wrap">
                          <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{ev.time}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" />{ev.location}</span>
                        </div>
                        {/* Seat fill bar */}
                        <div className="mt-2.5 flex items-center gap-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-1.5">
                            <div
                              className={cn("h-1.5 rounded-full transition-all", pctFull >= 80 ? "bg-red-500" : "bg-amber-500")}
                              style={{ width: `${pctFull}%` }}
                            />
                          </div>
                          <span className={cn("text-[10px] font-semibold shrink-0", ev.seatsLeft <= 3 ? "text-red-600" : "text-gray-400")}>
                            {ev.seatsLeft} seats left
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Past events */}
      {past.length > 0 && filter === "all" && (
        <div>
          <h2 className="text-sm font-bold text-gray-500 mb-3">Past Events</h2>
          <div className="space-y-2">
            {past.map(ev => {
              const t = TYPE_CONFIG[ev.type];
              return (
                <Card key={ev.id} className="opacity-60 hover:opacity-80 transition-opacity cursor-pointer" onClick={() => setSelected(ev)}>
                  <CardContent className="p-4 flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", t.color)}>
                      <t.icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700 truncate">{ev.title}</p>
                      <p className="text-xs text-gray-400">{ev.date} · {ev.location}</p>
                    </div>
                    {ev.isRegistered && (
                      <Badge className="bg-green-50 text-green-700 shrink-0" size="sm">Attended</Badge>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Host your own CTA */}
      <Card>
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center shrink-0">
            <Scissors className="h-5 w-5 text-amber-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">Want to host a Barbershop Talk?</p>
            <p className="text-xs text-gray-500 mt-0.5">BRO2BRO provides facilitators, materials, and a trained counselor — you just provide the shop and the chairs.</p>
          </div>
          <Button size="sm" variant="outline" className="shrink-0 gap-2" onClick={() => {
            navigator.clipboard?.writeText("contact@bro2bro.app");
            alert("Contact email copied: contact@bro2bro.app");
          }}>
            <Share2 className="h-3.5 w-3.5" /> Get in Touch
          </Button>
        </CardContent>
      </Card>

      {selected && (
        <EventDetailModal
          event={selected}
          onClose={() => setSelected(null)}
          onRegister={handleRegister}
        />
      )}
    </div>
  );
}
