"use client";
import { useState, useEffect } from "react";
import {
  Calendar, Clock, MapPin, Phone, Plus, CheckCircle,
  XCircle, AlertCircle, ChevronRight, Video, Building2,
  Scissors, Heart, Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Appointment,
  ApptStatus,
  ApptType,
  loadUserAppointments,
  saveUserAppointments,
} from "@/lib/appointments-store";
import { useAuth } from "@/lib/auth-context";

const STATUS_CONFIG: Record<ApptStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  confirmed:  { label: "Confirmed",  color: "bg-green-50 text-green-700",  icon: CheckCircle  },
  pending:    { label: "Pending",    color: "bg-amber-50 text-amber-700",  icon: AlertCircle  },
  completed:  { label: "Completed",  color: "bg-gray-100 text-gray-500",   icon: CheckCircle  },
  cancelled:  { label: "Cancelled",  color: "bg-red-50 text-red-600",      icon: XCircle      },
};

const TYPE_ICONS: Record<ApptType, typeof Building2> = {
  clinic:     Building2,
  barbershop: Scissors,
  virtual:    Video,
  ai:         Heart,
};

const TYPE_COLORS: Record<ApptType, string> = {
  clinic:     "bg-blue-100 text-blue-700",
  barbershop: "bg-amber-100 text-amber-700",
  virtual:    "bg-purple-100 text-purple-700",
  ai:         "bg-black text-amber-400",
};

function AppointmentCard({ appt, onCancel }: { appt: Appointment; onCancel: (id: string) => void }) {
  const status = STATUS_CONFIG[appt.status];
  const TypeIcon = TYPE_ICONS[appt.providerType];
  const isPast = appt.status === "completed" || appt.status === "cancelled";

  return (
    <div className={cn("bg-white rounded-2xl border p-5 transition-all duration-200 hover:shadow-card", isPast && "opacity-70")}>
      <div className="flex items-start gap-4">
        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", TYPE_COLORS[appt.providerType])}>
          <TypeIcon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3 className="text-sm font-bold text-gray-900">{appt.title}</h3>
            <Badge className={cn("shrink-0 text-xs", status.color)} size="sm">
              <status.icon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>
          <p className="text-xs text-gray-500 mb-2">{appt.provider}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1.5 gap-x-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 text-gray-400" />
              {appt.date}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3 text-gray-400" />
              {appt.time}
            </span>
            <span className="flex items-center gap-1.5 col-span-full sm:col-span-2">
              <MapPin className="h-3 w-3 text-gray-400 shrink-0" />
              <span className="truncate">{appt.location}</span>
            </span>
            {appt.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3 w-3 text-gray-400" />
                {appt.phone}
              </span>
            )}
          </div>

          {appt.notes && (
            <p className="mt-2 text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2 leading-relaxed">
              {appt.notes}
            </p>
          )}

          {!isPast && (
            <div className="flex items-center gap-2 mt-3">
              {appt.status === "pending" && (
                <Button size="xs" variant="outline">Confirm</Button>
              )}
              {appt.providerType === "virtual" && (
                <Button size="xs" className="gap-1.5">
                  <Video className="h-3 w-3" /> Join Call
                </Button>
              )}
              <Button
                size="xs"
                variant="ghost"
                className={cn("gap-1.5", appt.reminder ? "text-amber-600" : "text-gray-400")}
              >
                <Bell className="h-3 w-3" />
                {appt.reminder ? "Reminder on" : "Add reminder"}
              </Button>
              {appt.status !== "cancelled" && (
                <button
                  onClick={() => onCancel(appt.id)}
                  className="ml-auto text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const TYPE_TITLES: Record<string, string> = {
  clinic: "Clinic Visit",
  barbershop: "Barbershop Screening",
  virtual: "Virtual Counseling",
  ai: "AI Check-in",
};

const TYPE_PROVIDERS: Record<string, string> = {
  clinic: "UAMS Community Clinic",
  barbershop: "Partner Barbershop",
  virtual: "Telehealth Provider",
  ai: "Bro AI",
};

const TYPE_LOCATIONS: Record<string, string> = {
  clinic: "4301 W Markham St, Little Rock",
  barbershop: "1523 Main St, Little Rock",
  virtual: "Telehealth — link sent to email",
  ai: "In-app",
};

function BookModal({ onClose, onBook }: { onClose: () => void; onBook: (appt: Appointment) => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [type, setType] = useState("");
  const [form, setForm] = useState({ date: "", time: "", notes: "" });
  const [booked, setBooked] = useState(false);

  const types = [
    { id: "clinic",     label: "Clinic Visit",          icon: Building2, desc: "Primary care, screenings, follow-ups" },
    { id: "barbershop", label: "Barbershop Screening",   icon: Scissors,  desc: "BP check, glucose, weight at partner shops" },
    { id: "virtual",    label: "Virtual Counseling",     icon: Video,     desc: "Telehealth mental health or wellness" },
    { id: "ai",         label: "AI Check-in",            icon: Heart,     desc: "Scheduled wellness conversation with Bro AI" },
  ];

  const slots = ["9:00 AM", "10:00 AM", "11:30 AM", "2:00 PM", "3:30 PM", "4:30 PM", "6:00 PM"];

  async function handleBook() {
    await new Promise((r) => setTimeout(r, 800));
    const newAppt: Appointment = {
      id: Date.now().toString(),
      title: TYPE_TITLES[type] ?? "Appointment",
      provider: TYPE_PROVIDERS[type] ?? "Provider",
      providerType: type as ApptType,
      date: form.date
        ? new Date(form.date).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
        : "TBD",
      time: form.time,
      location: TYPE_LOCATIONS[type] ?? "",
      notes: form.notes || undefined,
      status: "confirmed",
      reminder: true,
    };
    onBook(newAppt);
    setBooked(true);
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-float max-h-[90vh] flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between shrink-0">
          <div>
            <h2 className="text-base font-bold text-gray-900">Book Appointment</h2>
            {!booked && <p className="text-xs text-gray-400 mt-0.5">Step {step} of 3</p>}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-lg leading-none">×</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {booked ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-black text-gray-900 mb-2">Appointment Booked!</h3>
              <p className="text-sm text-gray-500 mb-6">
                You&apos;ll receive a confirmation text and email. Reminder 24 hours before.
              </p>
              <Button onClick={onClose} className="w-full">Done</Button>
            </div>
          ) : step === 1 ? (
            <div className="space-y-3">
              <p className="text-sm font-semibold text-gray-700 mb-4">What kind of appointment?</p>
              {types.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setType(t.id)}
                  className={cn(
                    "w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all",
                    type === t.id ? "border-black bg-gray-50" : "border-gray-100 hover:border-gray-200"
                  )}
                >
                  <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0", TYPE_COLORS[t.id as ApptType])}>
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">{t.label}</div>
                    <div className="text-xs text-gray-500">{t.desc}</div>
                  </div>
                  <div className={cn("ml-auto h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0", type === t.id ? "border-black" : "border-gray-300")}>
                    {type === t.id && <div className="h-2.5 w-2.5 rounded-full bg-black" />}
                  </div>
                </button>
              ))}
            </div>
          ) : step === 2 ? (
            <div className="space-y-5">
              <p className="text-sm font-semibold text-gray-700">Choose a date and time</p>
              <Input
                label="Date"
                type="date"
                value={form.date}
                onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
              />
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">Available Time Slots</label>
                <div className="grid grid-cols-3 gap-2">
                  {slots.map((s) => (
                    <button
                      key={s}
                      onClick={() => setForm((p) => ({ ...p, time: s }))}
                      className={cn(
                        "py-2.5 rounded-xl text-sm font-medium border transition-all",
                        form.time === s ? "bg-black text-white border-black" : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              <p className="text-sm font-semibold text-gray-700">Any notes for the provider?</p>
              <div>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={4}
                  placeholder="Optional: mention specific concerns, current medications, or anything you want the provider to know…"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/5 transition-colors resize-none"
                />
              </div>
              <div className="bg-amber-50 rounded-xl p-4 text-xs text-amber-800 space-y-1">
                <p className="font-semibold">Your notes are private</p>
                <p>Only the provider you&apos;re booking with can see what you write here.</p>
              </div>
            </div>
          )}
        </div>

        {!booked && (
          <div className="px-6 pb-6 pt-4 border-t border-gray-100 flex gap-3 justify-end shrink-0">
            {step > 1 && <Button variant="outline" onClick={() => setStep((p) => (p - 1) as 1 | 2 | 3)}>Back</Button>}
            {step < 3 ? (
              <Button
                disabled={step === 1 ? !type : !form.date || !form.time}
                onClick={() => setStep((p) => (p + 1) as 2 | 3)}
              >
                Continue <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            ) : (
              <Button onClick={handleBook}>
                Confirm Booking <CheckCircle className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppointmentsPage() {
  const { user }                          = useAuth();
  const [appointments, setAppointments]   = useState<Appointment[]>([]);
  const [loaded, setLoaded]               = useState(false);
  const [showModal, setShowModal]         = useState(false);

  // Load from Firebase when user is known
  useEffect(() => {
    if (!user) return;
    setLoaded(false);
    loadUserAppointments(user.uid).then((data) => {
      setAppointments(data);
      setLoaded(true);
    });
  }, [user?.uid]);

  // Save to Firebase whenever appointments change (after initial load)
  useEffect(() => {
    if (!user || !loaded) return;
    saveUserAppointments(user.uid, appointments).catch(console.error);
  }, [appointments, loaded, user?.uid]);

  function cancelAppt(id: string) {
    setAppointments((prev: Appointment[]) =>
      prev.map((a: Appointment) => a.id === id ? { ...a, status: "cancelled" as ApptStatus } : a)
    );
  }

  const upcoming = appointments.filter((a) => a.status === "confirmed" || a.status === "pending");
  const past = appointments.filter((a) => a.status === "completed" || a.status === "cancelled");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Appointments</h1>
          <p className="text-gray-500 text-sm mt-1">Book, track, and manage all your health appointments in one place.</p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-1.5" /> Book Appointment
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Upcoming",  value: upcoming.length,                                       color: "text-black",       bg: "bg-gray-50"    },
          { label: "Confirmed", value: upcoming.filter((a) => a.status === "confirmed").length, color: "text-green-700",   bg: "bg-green-50"   },
          { label: "Pending",   value: upcoming.filter((a) => a.status === "pending").length,   color: "text-amber-700",   bg: "bg-amber-50"   },
          { label: "Completed", value: past.filter((a) => a.status === "completed").length,     color: "text-gray-500",    bg: "bg-gray-50"    },
        ].map((s) => (
          <Card key={s.label} className={s.bg}>
            <CardContent className="p-4">
              <div className={cn("text-2xl font-black", s.color)}>{s.value}</div>
              <div className="text-xs text-gray-500 mt-0.5">{s.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="upcoming">
        <TabsList>
          <TabsTrigger value="upcoming">Upcoming ({upcoming.length})</TabsTrigger>
          <TabsTrigger value="past">Past ({past.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <div className="space-y-3 mt-4">
            {upcoming.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Calendar className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                <p className="text-base font-semibold text-gray-700 mb-2">No upcoming appointments</p>
                <p className="text-sm text-gray-500 mb-6">Book a check-in, screening, or counseling session.</p>
                <Button onClick={() => setShowModal(true)}>
                  <Plus className="h-4 w-4 mr-1.5" /> Book Now
                </Button>
              </div>
            )}
            {upcoming.map((a) => (
              <AppointmentCard key={a.id} appt={a} onCancel={cancelAppt} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="past">
          <div className="space-y-3 mt-4">
            {past.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                <Clock className="h-10 w-10 text-gray-200 mx-auto mb-4" />
                <p className="text-sm text-gray-500">No past appointments yet.</p>
              </div>
            )}
            {past.map((a) => (
              <AppointmentCard key={a.id} appt={a} onCancel={cancelAppt} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {showModal && (
        <BookModal
          onClose={() => setShowModal(false)}
          onBook={(appt) => setAppointments((prev: Appointment[]) => [...prev, appt])}
        />
      )}
    </div>
  );
}
