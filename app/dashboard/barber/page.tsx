"use client";
import Link from "next/link";
import {
  Scissors, Users, Activity, Share2, Award,
  ArrowRight, TrendingUp, Clock,
  Heart, ChevronRight, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { useBarberData } from "@/lib/use-barber-data";
import type { ClientStatus } from "@/lib/demo-barber-data";

const STATUS_MAP: Record<ClientStatus, { label: string; color: string }> = {
  healthy:   { label: "Healthy",   color: "bg-green-50 text-green-700" },
  monitored: { label: "Monitored", color: "bg-amber-50 text-amber-700" },
  referred:  { label: "Referred",  color: "bg-blue-50 text-blue-700" },
  upcoming:  { label: "Upcoming",  color: "bg-gray-100 text-gray-500" },
  new:       { label: "New",       color: "bg-gray-100 text-gray-600" },
};

export default function BarberOverview() {
  const { displayName, shopName, isBarberDemo } = useAuth();
  const { stats, todayClients, overviewScreenings, modules, loading } = useBarberData();
  const firstName = displayName.split(" ")[0];
  const completedModules = modules.filter((m) => m.status === "completed").length;
  const progressPct = modules.length ? (completedModules / modules.length) * 100 : 0;
  const flaggedCount = overviewScreenings.filter((s) => s.flag === "high" || s.bpFlag === "high").length;

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
            <div className="h-7 w-7 rounded-full bg-amber-500 flex items-center justify-center">
              <Scissors className="h-3.5 w-3.5 text-black" />
            </div>
            <span className="text-amber-400 text-sm font-semibold">Good morning, {firstName} 👋</span>
            {isBarberDemo && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30" size="sm">Demo mode</Badge>
            )}
            {!isBarberDemo && completedModules >= 3 && (
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30" size="sm">CHW Certified</Badge>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white mb-1.5">
            {isBarberDemo ? "Your shop is making a difference." : "Welcome to your barber portal."}
          </h1>
          <p className="text-gray-400 text-sm">
            {isBarberDemo
              ? `8 clients scheduled today · 3 screenings already done · ${shopName || "Your Shop"}`
              : `Manage clients, screenings, and referrals at ${shopName || "your shop"}.`}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2.5 shrink-0 w-full sm:w-auto">
          <Link href="/dashboard/barber/clients" className="w-full sm:w-auto">
            <Button variant="gold" size="md" className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-1.5" /> Check In Client
            </Button>
          </Link>
          <Link href="/dashboard/barber/screenings" className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full sm:w-auto border-white/20 text-white hover:bg-white/10 bg-transparent">
              Log Screening
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s, i) => {
          const icons = [Users, Activity, Share2, Award];
          const colors = ["text-blue-600", "text-amber-600", "text-teal-600", "text-purple-600"];
          const bgs = ["bg-blue-50", "bg-amber-50", "bg-teal-50", "bg-purple-50"];
          const Icon = icons[i] ?? Users;
          return (
            <Card key={s.label} className="hover:shadow-card-hover transition-all duration-300">
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "New Check-In", href: "/dashboard/barber/clients", icon: Users, color: "bg-black text-white" },
          { label: "Log Screening", href: "/dashboard/barber/screenings", icon: Activity, color: "bg-amber-50 text-amber-800" },
          { label: "Make Referral", href: "/dashboard/barber/referrals", icon: Share2, color: "bg-teal-50 text-teal-800" },
          { label: "Continue Training", href: "/dashboard/barber/training", icon: Award, color: "bg-purple-50 text-purple-800" },
        ].map((a) => (
          <Link key={a.label} href={a.href}>
            <div className={cn(
              "rounded-2xl p-4 sm:p-5 flex flex-col items-center justify-center gap-2 sm:gap-3 text-center cursor-pointer hover:scale-[1.02] transition-transform",
              a.color
            )}>
              <a.icon className="h-5 w-5 sm:h-6 sm:w-6" />
              <span className="text-xs font-semibold">{a.label}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Today&apos;s Clients</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {todayClients.length ? `${todayClients.length} on the schedule` : "No clients yet today"}
                </p>
              </div>
              <Link href="/dashboard/barber/clients">
                <button className="text-xs text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
            {todayClients.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-500 mb-3">No clients checked in yet today.</p>
                <Link href="/dashboard/barber/clients">
                  <Button size="sm">Check in your first client</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {todayClients.map((c) => {
                  const s = STATUS_MAP[c.status] ?? STATUS_MAP.upcoming;
                  return (
                    <div key={c.id} className="flex items-center gap-3 px-5 py-3">
                      <Avatar name={c.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900 truncate">{c.name}</span>
                          {c.referred && (
                            <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-medium">Referred</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                          {c.time && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="h-2.5 w-2.5" />{c.time}
                            </span>
                          )}
                          {c.bp !== "–" && <span className="text-xs text-gray-500">· BP {c.bp}</span>}
                        </div>
                      </div>
                      <Badge className={cn("shrink-0", s.color)} size="sm">{s.label}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Today&apos;s Screenings</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {overviewScreenings.length
                    ? `${overviewScreenings.length} completed${flaggedCount ? ` · ${flaggedCount} flagged` : ""}`
                    : "No screenings logged yet"}
                </p>
              </div>
              <Link href="/dashboard/barber/screenings">
                <button className="text-xs text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </Link>
            </div>
            {overviewScreenings.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-500 mb-3">Log a screening after your next client check-in.</p>
                <Link href="/dashboard/barber/screenings">
                  <Button size="sm">Log screening</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {overviewScreenings.map((s) => {
                  const isHigh = s.flag === "high" || s.bpFlag === "high";
                  return (
                    <div key={s.id} className="px-5 py-3 flex items-center gap-3">
                      <Avatar name={s.name} size="sm" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                          {isHigh && (
                            <span className="text-[10px] bg-red-50 text-red-600 px-1.5 py-0.5 rounded-md font-semibold">High BP</span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-500 flex-wrap">
                          <span className={cn("font-medium", isHigh ? "text-red-600" : "text-gray-700")}>BP {s.bp}</span>
                          <span>Glucose {s.glucose}</span>
                          <span>{s.weight}</span>
                          <span className="text-gray-400">{s.time}</span>
                        </div>
                      </div>
                      <Heart className={cn("h-4 w-4 shrink-0", isHigh ? "text-red-400" : "text-green-400")} />
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center shrink-0">
            <Award className="h-5 w-5 text-purple-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-sm font-bold text-gray-900">CHW Certification Progress</span>
              <Badge className="bg-purple-50 text-purple-700" size="sm">
                {completedModules} of {modules.length} modules
              </Badge>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2 mb-1">
              <div className="bg-purple-600 h-2 rounded-full transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-gray-500">
              {isBarberDemo
                ? "Next: Module 4 — Diabetes Awareness · 60% complete"
                : "Complete training modules to earn CHW certification."}
            </p>
          </div>
          <Link href="/dashboard/barber/training">
            <Button size="sm" variant="outline" className="shrink-0 w-full sm:w-auto">
              Continue <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
