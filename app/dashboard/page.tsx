"use client";
import Link from "next/link";
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

const quickStats = [
  { label: "Check-in Streak",  value: "12 days",  icon: Flame,      color: "text-orange-600", bg: "bg-orange-50",  delta: "+3 this week" },
  { label: "AI Conversations", value: "8",         icon: MessageCircle, color: "text-blue-600",  bg: "bg-blue-50",   delta: "4 this month" },
  { label: "Resources Found",  value: "5",         icon: MapPin,     color: "text-teal-600",  bg: "bg-teal-50",   delta: "2 new nearby" },
  { label: "Crew Members",     value: "4",         icon: Users,      color: "text-purple-600",bg: "bg-purple-50", delta: "1 joined today" },
];

const appointments = [
  {
    title: "Blood Pressure Check",
    provider: "UAMS Community Clinic",
    time: "Tomorrow · 2:00 PM",
    type: "In-person",
    confirmed: true,
  },
  {
    title: "Mental Wellness Check-in",
    provider: "Pulse AI",
    time: "Every Monday · 8:00 AM",
    type: "Automated",
    confirmed: true,
  },
  {
    title: "Barbershop Talk Follow-up",
    provider: "Joe's Cuts — Little Rock",
    time: "Friday · 10:00 AM",
    type: "In-person",
    confirmed: false,
  },
];

const crewActivity = [
  { name: "Dre M.",   action: "Completed BP check-in",    time: "2h ago",  badge: "streak" },
  { name: "Trev J.",  action: "Booked clinic appointment", time: "5h ago",  badge: "new" },
  { name: "Carlos W.",action: "Hit 30-day streak!",        time: "1d ago",  badge: "milestone" },
  { name: "Reggie T.",action: "Joined the community forum",time: "2d ago",  badge: null },
];

const milestones = [
  { label: "First Check-in",    done: true  },
  { label: "7-day Streak",      done: true  },
  { label: "Found a Clinic",    done: true  },
  { label: "30-day Streak",     done: false },
  { label: "Book Appointment",  done: false },
  { label: "Connect w/ Mentor", done: false },
];

export default function DashboardOverview() {
  const completed = milestones.filter((m) => m.done).length;

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Welcome banner */}
      <div className="bg-black rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center">
              <Heart className="h-3.5 w-3.5 text-black fill-black" />
            </div>
            <span className="text-amber-400 text-sm font-semibold">Good morning, Marcus 👋</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">Your health is on track.</h1>
          <p className="text-gray-400 text-sm">12-day streak — you&apos;re in the top 15% of active members this month.</p>
        </div>
        <Link href="/dashboard/chat">
          <Button variant="gold" size="md" className="shrink-0">
            Chat with Pulse <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </Link>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((s) => (
          <Card key={s.label} className="hover:shadow-card-hover transition-all duration-300">
            <CardContent className="p-5">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", s.bg)}>
                <s.icon className={cn("h-4.5 w-4.5", s.color)} />
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
        {/* Upcoming appointments */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-base">Upcoming Appointments</CardTitle>
              <Link href="/dashboard/appointments">
                <Button variant="ghost" size="xs">View all <ChevronRight className="ml-1 h-3 w-3" /></Button>
              </Link>
            </CardHeader>
            <CardContent className="p-0">
              {appointments.map((a, i) => (
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
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Journey progress */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">90-Day Journey</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Progress ring (CSS) */}
              <div className="flex items-center justify-center mb-5">
                <div className="relative w-24 h-24">
                  <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                    <circle
                      cx="18" cy="18" r="15.9"
                      fill="none" stroke="#f59e0b" strokeWidth="3"
                      strokeDasharray={`${(completed / milestones.length) * 100} 100`}
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

      {/* Crew activity */}
      <Card>
        <CardHeader className="flex-row items-center justify-between pb-2">
          <CardTitle className="text-base">Crew Activity</CardTitle>
          <Link href="/dashboard/community">
            <Button variant="ghost" size="xs">View community <ChevronRight className="ml-1 h-3 w-3" /></Button>
          </Link>
        </CardHeader>
        <CardContent className="p-0">
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
        </CardContent>
      </Card>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Chat with AI",      href: "/dashboard/chat",         icon: MessageCircle, color: "bg-black text-white" },
          { label: "Find Resources",    href: "/dashboard/resources",    icon: MapPin,        color: "bg-amber-50 text-amber-700" },
          { label: "Connect a Mentor",  href: "/dashboard/mentors",      icon: Star,          color: "bg-teal-50 text-teal-700" },
          { label: "Book Appointment",  href: "/dashboard/appointments", icon: Calendar,      color: "bg-blue-50 text-blue-700" },
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
