"use client";
import Link from "next/link";
import {
  HeartHandshake, Users, Calendar, MessageCircle,
  ArrowRight, TrendingUp, ChevronRight, Plus, Flame,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useMentorData } from "@/lib/use-mentor-data";
import { DEMO_ECOSYSTEM } from "@/lib/demo-ecosystem";
import type { MenteeStatus } from "@/lib/demo-mentor-data";

const STATUS_MAP: Record<MenteeStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-teal-50 text-teal-700" },
  new:    { label: "New",    color: "bg-blue-50 text-blue-700" },
  paused: { label: "Paused", color: "bg-gray-100 text-gray-500" },
};

export default function MentorOverview() {
  const { displayName, isMentorDemo } = useAuth();
  const { stats, mentees, upcomingSessions, messages, loading, unreadCount } = useMentorData();
  const firstName = displayName.split(" ")[0];
  const marcus = mentees.find((m) => m.name === DEMO_ECOSYSTEM.member.name);
  const recentMessages = messages.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="bg-black rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className="h-7 w-7 rounded-full bg-teal-500 flex items-center justify-center">
              <HeartHandshake className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="text-teal-400 text-sm font-semibold">Good morning, {firstName} 👋</span>
            {isMentorDemo && (
              <Badge className="bg-teal-500/20 text-teal-300 border-teal-500/30" size="sm">Demo mode</Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">
            {isMentorDemo ? "Your mentees are showing up." : "Welcome to your mentor portal."}
          </h1>
          <p className="text-gray-400 text-sm">
            {mentees.length} mentees · {upcomingSessions.length} sessions upcoming
            {unreadCount > 0 && ` · ${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
          <Link href="/dashboard/mentor/sessions?schedule=1" className="w-full sm:w-auto">
            <Button variant="gold" size="md" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-1.5" /> Schedule Session
            </Button>
          </Link>
          <Link href="/dashboard/mentor/messages" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 bg-transparent">
              View Messages
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => {
          const icons = [Users, Calendar, Flame, HeartHandshake];
          const colors = ["text-teal-600", "text-amber-600", "text-orange-600", "text-purple-600"];
          const bgs = ["bg-teal-50", "bg-amber-50", "bg-orange-50", "bg-purple-50"];
          const Icon = icons[i] ?? Users;
          return (
            <Card key={s.label} className="hover:shadow-card-hover transition-shadow duration-300">
              <CardContent className="p-4 sm:p-5">
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center mb-3", bgs[i])}>
                  <Icon className={cn("h-4.5 w-4.5", colors[i])} />
                </div>
                <div className="text-xl sm:text-2xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs font-medium text-gray-600 mt-0.5">{s.label}</div>
                <div className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-teal-500 shrink-0" />
                  <span className="line-clamp-2">{s.delta}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isMentorDemo && marcus && (
        <Card className="border-teal-100 bg-gradient-to-r from-teal-50/80 to-white">
          <CardContent className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar name={marcus.name} size="lg" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h3 className="font-bold text-gray-900">{marcus.name}</h3>
                <Badge className="bg-teal-100 text-teal-700 border-teal-200" size="sm">Connected demo</Badge>
              </div>
              <p className="text-sm text-gray-600">
                Same person as <strong>Marcus Williams</strong> at {DEMO_ECOSYSTEM.barber.shop} and{" "}
                <strong>{DEMO_ECOSYSTEM.member.name}</strong> on the member app — one journey across barber, member & mentor.
              </p>
              <p className="text-xs text-gray-500 mt-1">
                BP {marcus.bp} · {marcus.streak}-day streak · Referred by {marcus.referredBy}
              </p>
            </div>
            <Link href="/dashboard/mentor/mentees">
              <Button variant="outline" size="sm">View mentee</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6">
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Upcoming Sessions</h2>
              <Link href="/dashboard/mentor/sessions" className="text-xs text-teal-600 font-medium flex items-center gap-0.5 hover:underline">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {upcomingSessions.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No sessions scheduled yet.</p>
            ) : (
              <div className="space-y-3">
                {upcomingSessions.slice(0, 3).map((s) => (
                  <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center shrink-0">
                      <Calendar className="h-4 w-4 text-teal-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">{s.title}</p>
                      <p className="text-xs text-gray-500">{s.menteeName} · {s.date} · {s.time}</p>
                    </div>
                    <Badge size="sm" className="bg-teal-50 text-teal-700 shrink-0">{s.format}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900">Active Mentees</h2>
              <Link href="/dashboard/mentor/mentees" className="text-xs text-teal-600 font-medium flex items-center gap-0.5 hover:underline">
                View all <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            {mentees.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No mentees matched yet.</p>
            ) : (
              <div className="space-y-3">
                {mentees.slice(0, 4).map((m) => {
                  const st = STATUS_MAP[m.status];
                  return (
                    <div key={m.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
                      <Avatar name={m.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-500">{m.focus.slice(0, 2).join(" · ")}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", st.color)}>{st.label}</span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{m.streak}d streak</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {recentMessages.length > 0 && (
        <Card>
          <CardContent className="p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-teal-600" />
                Recent Messages
              </h2>
              <Link href="/dashboard/mentor/messages">
                <Button variant="ghost" size="sm" className="text-teal-600">
                  Open inbox <ArrowRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </Link>
            </div>
            <div className="space-y-2">
              {recentMessages.map((msg) => (
                <div key={msg.id} className={cn(
                  "p-3 rounded-xl text-sm",
                  !msg.read && msg.sender === "mentee" ? "bg-teal-50 border border-teal-100" : "bg-gray-50"
                )}>
                  <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className="font-semibold text-gray-900">{msg.menteeName}</span>
                    <span className="text-xs text-gray-400">{msg.time}</span>
                  </div>
                  <p className="text-gray-600 line-clamp-2">{msg.text}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
