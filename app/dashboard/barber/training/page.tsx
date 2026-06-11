"use client";
import { useState } from "react";
import {
  Award, CheckCircle, Lock, Play, Clock,
  BookOpen, ChevronRight, Download, Star, Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBarberData } from "@/lib/use-barber-data";
import type { ModuleStatus } from "@/lib/demo-barber-data";

const STATUS_CONFIG: Record<ModuleStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  completed:   { label: "Complete",   color: "text-green-600 bg-green-50",  icon: CheckCircle },
  "in-progress": { label: "In Progress", color: "text-blue-600 bg-blue-50", icon: Play        },
  locked:      { label: "Locked",     color: "text-gray-400 bg-gray-100",   icon: Lock        },
};

const CATEGORY_COLORS: Record<string, string> = {
  Foundation:    "bg-gray-100 text-gray-700",
  Screenings:    "bg-amber-50 text-amber-700",
  Education:     "bg-blue-50 text-blue-700",
  "Mental Health": "bg-purple-50 text-purple-700",
  Referrals:     "bg-teal-50 text-teal-700",
  Communication: "bg-indigo-50 text-indigo-700",
  Certification: "bg-black text-white",
};

export default function TrainingPage() {
  const { modules, loading, isBarberDemo } = useBarberData();
  const [active, setActive] = useState<string | null>(null);

  const completed  = modules.filter(m => m.status === "completed");
  const inProgress = modules.filter(m => m.status === "in-progress");
  const totalPoints = completed.reduce((s, m) => s + m.points, 0);
  const overallProgress = modules.length ? (completed.length / modules.length) * 100 : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Training & Certification</h1>
          <p className="text-sm text-gray-400 mt-0.5">UAMS Community Health Worker Program · {completed.length} of {modules.length} modules</p>
        </div>
        <Button size="sm" variant="outline" className="gap-2 shrink-0">
          <Download className="h-4 w-4" /> Download Certificate
        </Button>
      </div>

      {/* Progress hero */}
      <div className="bg-black rounded-2xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 flex items-center justify-center shrink-0">
            <Award className="h-8 w-8 text-black" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-white font-black text-lg">CHW Certification Progress</span>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30" size="sm">
                {Math.round(overallProgress)}% Complete
              </Badge>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-gray-400">{completed.length} modules complete</span>
              <span className="text-amber-400 font-semibold flex items-center gap-1">
                <Star className="h-3.5 w-3.5" /> {totalPoints} pts earned
              </span>
            </div>
          </div>
        </div>
        {inProgress.length > 0 && (
          <div className="mt-5 pt-5 border-t border-white/10">
            <p className="text-xs text-gray-400 mb-2">Continue where you left off</p>
            <div className="flex items-center justify-between gap-3 bg-white/5 rounded-xl p-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <Play className="h-3.5 w-3.5 text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{inProgress[0].title}</p>
                  <p className="text-xs text-gray-400">{inProgress[0].progress}% · {inProgress[0].duration}</p>
                </div>
              </div>
              <Button size="sm" variant="gold" className="shrink-0">
                Resume <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Module list */}
      <div className="grid grid-cols-1 gap-3">
        {modules.map((m, i) => {
          const s = STATUS_CONFIG[m.status];
          const isActive = active === m.id;
          return (
            <Card
              key={m.id}
              className={cn(
                "transition-all duration-200",
                m.status !== "locked" ? "hover:shadow-md cursor-pointer" : "opacity-60",
                isActive && "ring-2 ring-black"
              )}
            >
              <CardContent className="p-0">
                <button
                  onClick={() => m.status !== "locked" && setActive(isActive ? null : m.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                  disabled={m.status === "locked"}
                >
                  {/* Step number */}
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-black",
                    m.status === "completed"   ? "bg-green-500 text-white"   :
                    m.status === "in-progress" ? "bg-black text-white"       :
                    "bg-gray-100 text-gray-400"
                  )}>
                    {m.status === "completed" ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">{m.title}</span>
                      <Badge className={CATEGORY_COLORS[m.category] ?? "bg-gray-100 text-gray-600"} size="sm">
                        {m.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{m.duration}</span>
                      <span className="flex items-center gap-1"><Star className="h-2.5 w-2.5" />{m.points} pts</span>
                    </div>
                    {m.status === "in-progress" && (
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${m.progress}%` }} />
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <Badge className={s.color} size="sm">
                      <s.icon className="h-2.5 w-2.5 mr-1" />{s.label}
                    </Badge>
                  </div>
                </button>

                {isActive && m.status !== "locked" && (
                  <div className="px-5 pb-5 border-t border-gray-50">
                    <p className="text-sm text-gray-600 leading-relaxed mt-4 mb-4">{m.description}</p>
                    <div className="flex gap-2">
                      {m.status === "in-progress" && (
                        <Button size="sm" className="gap-2">
                          <Play className="h-3.5 w-3.5" /> Resume Module
                        </Button>
                      )}
                      {m.status === "completed" && (
                        <>
                          <Button size="sm" variant="outline" className="gap-2">
                            <BookOpen className="h-3.5 w-3.5" /> Review
                          </Button>
                          <Button size="sm" variant="outline" className="gap-2">
                            <Download className="h-3.5 w-3.5" /> Resources
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Achievements */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" /> Achievements
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "First Screening",   icon: "🩺", earned: true,  desc: "Logged your first health screening" },
              { label: "10 Clients",        icon: "👥", earned: true,  desc: "Reached 10 clients seen" },
              { label: "Referral Maker",    icon: "🏥", earned: true,  desc: "Made your first referral" },
              { label: "CHW Graduate",      icon: "🎓", earned: false, desc: "Complete all 8 modules" },
            ].map((a) => (
              <div
                key={a.label}
                className={cn(
                  "rounded-xl p-3 flex flex-col items-center gap-2 text-center border",
                  a.earned ? "border-amber-100 bg-amber-50" : "border-gray-100 bg-gray-50 opacity-50"
                )}
              >
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">{a.label}</p>
                  <p className="text-[10px] text-gray-500 mt-0.5 leading-snug">{a.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

    </div>
  );
}
