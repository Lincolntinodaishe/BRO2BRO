"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight, MessageCircle, MapPin, Calendar, Users,
  TrendingUp, Activity, Heart, CheckCircle, Flame,
  Clock, Star, ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import {
  DEMO_QUICK_STATS,
  DEMO_OVERVIEW_APPOINTMENTS,
  DEMO_CREW_ACTIVITY,
  DEMO_MILESTONES,
  EMPTY_QUICK_STATS,
  EMPTY_MILESTONES,
} from "@/lib/demo-data";
import { loadUserAppointments, type Appointment } from "@/lib/appointments-store";

function toOverviewAppt(a: Appointment) {
  return {
    title: a.title,
    provider: a.provider,
    time: `${a.date} · ${a.time}`,
    type: a.providerType === "ai" ? "Automated" : "In-person",
    confirmed: a.status === "confirmed",
  };
}

export default function DashboardOverview() {
  const { displayName, isTestAccount, user } = useAuth();
  const [realAppts, setRealAppts] = useState<ReturnType<typeof toOverviewAppt>[]>([]);

  useEffect(() => {
    if (!user || isTestAccount) return;
    loadUserAppointments(user.uid).then((data) => {
      const upcoming = data
        .filter((a) => a.status === "confirmed" || a.status === "pending")
        .slice(0, 3)
        .map(toOverviewAppt);
      setRealAppts(upcoming);
    });
  }, [user, isTestAccount]);

  const quickStats = isTestAccount ? DEMO_QUICK_STATS : EMPTY_QUICK_STATS;
  const appointments = isTestAccount ? DEMO_OVERVIEW_APPOINTMENTS : realAppts;
  const crewActivity = isTestAccount ? DEMO_CREW_ACTIVITY : [];
  const milestones = isTestAccount ? DEMO_MILESTONES : EMPTY_MILESTONES;
  const completed = milestones.filter((m) => m.done).length;
  const firstName = displayName.split(" ")[0];

  return (
    <div className="space-y-8">
      <div className="bg-black rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <div className="h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center">
              <Heart className="h-3.5 w-3.5 text-black fill-black" />
            </div>
            <span className="text-amber-400 text-sm font-semibold">Good morning, {firstName} 👋</span>
            {isTestAccount && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30" size="sm">Demo mode</Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
            {isTestAccount ? "Your health is on track." : "Welcome to BRO2BRO."}
          </h1>
          <p className="text-gray-400 text-sm">
            {isTestAccount
              ? "12-day streak — you're in the top 15% of active members this month."
              : "Start a check-in with Bro AI or find care near you."}
          </p>
        </div>
        <Link href="/dashboard/chat">
          <Button variant="gold" size="md" className="shrink-0">
            Chat with Bro AI <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s) => (
          <Card key={s.label} className="hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-5">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", isTestAccount ? "bg-orange-50" : "bg-gray-50")}>
                {s.label.includes("Streak") && <Flame className="h-4.5 w-4.5 text-orange-600" />}
                {s.label.includes("AI") && <MessageCircle className="h-4.5 w-4.5 text-blue-600" />}
                {s.label.includes("Resources") && <MapPin className="h-4.5 w-4.5 text-teal-600" />}
                {s.label.includes("Crew") && <Users className="h-4.5 w-4.5 text-purple-600" />}
              </div>
              <div className="text-2xl font-black text-gray-900">{s.value}</div>
              <div className="text-xs font-medium text-gray-500 mt-0.5">{s.label}</div>
              <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3 text-teal-500" />
                {s.delta}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
              <Link href="/dashboard/appointments">
                <Button variant="ghost" size="xs">View all <ChevronRight className="ml-1 h-3 w-3" /></Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {appointments.length === 0 ? (
                <div className="px-6 py-10 text-center">
                  <p className="text-sm text-gray-500 mb-3">No upcoming appointments yet.</p>
                  <Link href="/dashboard/appointments">
                    <Button size="sm">Book your first appointment</Button>
                  </Link>
                </div>
              ) : (
                appointments.map((a, i) => (
                  <div
                    key={i}
                    className={cn(
                      "px-6 py-4 flex items-start gap-4",
                      i < appointments.length - 1 && "border-b border-gray-50"
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5",
                      a.type === "Automated" ? "bg-purple-50" : "bg-amber-50"
                    )}>
                      {a.type === "Automated"
                        ? <Activity className="h-4 w-4 text-purple-600" />
                        : <Calendar className="h-4 w-4 text-amber-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-gray-900">{a.title}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{a.provider}</div>
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" />
                          {a.time}
                        </span>
                        {a.confirmed
                          ? <Badge variant="success" size="sm">Confirmed</Badge>
                          : <Badge variant="warning" size="sm">Pending</Badge>}
                      </div>
                    </div>
                    <Button variant="ghost" size="icon-sm">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">90-Day Journey</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center mb-5">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9"
                      fill="none" stroke="#f59e0b" strokeWidth="3"
                      strokeDasharray={`${milestones.length ? (completed / milestones.length) * 100 : 0} 100`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-xl font-black text-gray-900">{completed}/{milestones.length}</div>
                    <div className="text-xs text-gray-400">goals</div>
                  </div>
                </div>
              </div>
              <ul className="space-y-2">
                {milestones.map((m) => (
                  <li key={m.label} className="flex items-center gap-2.5 text-sm">
                    <CheckCircle
                      className={cn("h-4 w-4 shrink-0", m.done ? "text-teal-600" : "text-gray-200")}
                    />
                    <span className={m.done ? "text-gray-700 line-through text-xs" : "text-gray-900 text-xs"}>
                      {m.label}
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Crew Activity</CardTitle>
          <Link href="/dashboard/community">
            <Button variant="ghost" size="xs">View community <ChevronRight className="ml-1 h-3 w-3" /></Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
          {crewActivity.length === 0 ? (
            <div className="px-6 py-8 text-center text-sm text-gray-500">
              Join the community to see crew activity and accountability updates.
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {crewActivity.map((a, i) => (
                <div key={i} className="px-6 py-3.5 flex items-center gap-3">
                  <Avatar name={a.name} size="sm" />
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-900">{a.name} </span>
                    <span className="text-sm text-gray-500">{a.action}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {a.badge === "streak" && <Badge variant="warning" size="sm">🔥 Streak</Badge>}
                    {a.badge === "milestone" && <Badge variant="success" size="sm">⭐ Milestone</Badge>}
                    {a.badge === "new" && <Badge variant="teal" size="sm">New</Badge>}
                    <span className="text-xs text-gray-400">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Chat with Bro AI", href: "/dashboard/chat", icon: MessageCircle, color: "bg-black text-white" },
          { label: "Find Resources", href: "/dashboard/resources", icon: MapPin, color: "bg-amber-50 text-amber-700" },
          { label: "Connect a Mentor", href: "/dashboard/mentors", icon: Star, color: "bg-teal-50 text-teal-700" },
          { label: "Book Appointment", href: "/dashboard/appointments", icon: Calendar, color: "bg-blue-50 text-blue-700" },
        ].map((q) => (
          <Link key={q.label} href={q.href}>
            <div className={cn("rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-center cursor-pointer hover:scale-[1.02] transition-transform border border-transparent", q.color)}>
              <q.icon className="h-6 w-6" />
              <span className="text-xs font-semibold">{q.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
