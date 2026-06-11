"use client";
import { useState, useEffect, useRef } from "react";
import {
  Award, CheckCircle, Lock, Play, Clock,
  BookOpen, ChevronRight, Download, Star, Zap,
  ChevronDown, Trophy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useBarberData } from "@/lib/use-barber-data";
import { useAuth } from "@/lib/auth-context";
import { downloadChwCertificate } from "@/lib/barber-cert";
import type { BarberTrainingModule, ModuleStatus } from "@/lib/demo-barber-data";

const STATUS_CONFIG: Record<ModuleStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  completed:     { label: "Complete",    color: "text-green-600 bg-green-50", icon: CheckCircle },
  "in-progress": { label: "In Progress", color: "text-blue-600 bg-blue-50",   icon: Play        },
  locked:        { label: "Locked",      color: "text-gray-400 bg-gray-100",  icon: Lock        },
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

const MODULE_CONTENT: Record<string, string[]> = {
  "1": [
    "Understand the Community Health Worker (CHW) role in barbershop health outreach",
    "Learn the ethical boundaries of client conversations — you support, doctors diagnose",
    "Build trust through active listening and non-judgmental communication",
    "Know when and how to escalate a health concern to a professional",
  ],
  "2": [
    "Correctly position the cuff on the upper arm — 1 inch above the elbow, palm up",
    "Read systolic (top) and diastolic (bottom) numbers accurately",
    "Classify readings: Normal <120/80, Elevated 120-129, Stage 1 130-139, Stage 2 ≥140",
    "Document findings and communicate results with calm, clear language",
  ],
  "3": [
    "Identify the top modifiable risk factors: hypertension, smoking, diabetes, obesity",
    "Recognize warning signs a client may share: chest pain, shortness of breath, fatigue",
    "Use the barbershop as a 'trusted space' to open health conversations without stigma",
    "Refer appropriately — know the difference between 'keep an eye on it' vs. 'go today'",
  ],
  "4": [
    "Explain the difference between Type 1, Type 2, and pre-diabetes in plain language",
    "Interpret fasting glucose readings: <100 Normal, 100-125 Pre-diabetes, ≥126 Diabetes range",
    "Counsel clients on lifestyle factors: carb intake, physical activity, weight management",
    "Connect clients to the CDC-recognized Diabetes Prevention Program (DPP) in Little Rock",
  ],
  "5": [
    "Spot behavioral signs of depression and anxiety — withdrawal, mood changes, sleep issues",
    "Use open-ended, empathetic check-ins: 'How have you been holding up lately?'",
    "De-stigmatize mental health by normalizing the conversation in the chair",
    "Know local mental health crisis resources and warm-handoff protocols",
  ],
  "6": [
    "Identify which clients need a 'warm handoff' vs. a printed referral slip",
    "Navigate partner provider directories for UAMS, CHI St. Vincent, and Baptist Health",
    "Track referral outcomes by following up at the client's next visit",
    "Document referrals to demonstrate CHW program impact to funders",
  ],
  "7": [
    "Understand cultural humility vs. cultural competence — stay curious, not presumptuous",
    "Recognize how systemic mistrust of healthcare affects Black men's help-seeking behavior",
    "Use shared lived experience and community identity as tools for trust-building",
    "Avoid 'othering' language — speak about health challenges as universal, not racial",
  ],
  "8": [
    "Demonstrate mastery across all 7 training modules through a comprehensive assessment",
    "Pass with 80% or above to receive your UAMS Community Health Worker certification",
    "Receive your digital and printable certificate to display in your shop",
    "Unlock access to the advanced CHW continuing education tracks",
  ],
};

function SimulatedLesson({
  module: mod,
  onComplete,
  onClose,
}: {
  module: BarberTrainingModule;
  onComplete: () => void;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<"reading" | "done">(
    mod.progress >= 100 ? "done" : "reading"
  );
  const [readProgress, setReadProgress] = useState(mod.progress);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (phase === "reading" && readProgress < 100) {
      intervalRef.current = setInterval(() => {
        setReadProgress(p => {
          if (p >= 100) {
            clearInterval(intervalRef.current!);
            setPhase("done");
            return 100;
          }
          return Math.min(p + 2, 100);
        });
      }, 60);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [phase]);

  const lessons = MODULE_CONTENT[mod.id] ?? [];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto animate-fade-in">
        {/* Header */}
        <div className="bg-black rounded-t-2xl px-6 py-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <Badge className="bg-amber-500/20 text-amber-300 border-amber-500/30 mb-2" size="sm">{mod.category}</Badge>
              <h2 className="text-lg font-black text-white">{mod.title}</h2>
              <p className="text-gray-400 text-xs mt-1 flex items-center gap-2">
                <Clock className="h-3 w-3" />{mod.duration}
                <Star className="h-3 w-3 text-amber-400" />{mod.points} pts
              </p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors shrink-0">
              ✕
            </button>
          </div>
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-[11px] text-gray-400 mb-1.5">
              <span>Module progress</span>
              <span>{Math.round(readProgress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${readProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-gray-900 mb-3">Key Lessons</h3>
            <div className="space-y-3">
              {lessons.map((lesson, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-start gap-3 p-3 rounded-xl border transition-all duration-500",
                    readProgress >= ((i + 1) / lessons.length) * 100
                      ? "bg-green-50 border-green-100"
                      : "bg-gray-50 border-gray-100 opacity-50"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5",
                    readProgress >= ((i + 1) / lessons.length) * 100
                      ? "bg-green-500"
                      : "bg-gray-200"
                  )}>
                    {readProgress >= ((i + 1) / lessons.length) * 100
                      ? <CheckCircle className="h-3 w-3 text-white" />
                      : <span className="text-[10px] font-bold text-gray-400">{i + 1}</span>}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{lesson}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>
            Save & Exit
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-2"
            disabled={phase !== "done"}
            onClick={onComplete}
          >
            {phase === "done"
              ? <><Trophy className="h-3.5 w-3.5" /> Complete Module</>
              : <><span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Reading…</>}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function TrainingPage() {
  const { displayName, shopName } = useAuth();
  const { modules, setModules, loading } = useBarberData();
  const [activeLesson, setActiveLesson] = useState<BarberTrainingModule | null>(null);
  const [expanded, setExpanded]         = useState<string | null>(null);
  const [justEarned, setJustEarned]     = useState<number | null>(null);

  const completed    = modules.filter(m => m.status === "completed");
  const inProgress   = modules.filter(m => m.status === "in-progress");
  const totalPoints  = completed.reduce((s, m) => s + m.points, 0);
  const overallPct   = modules.length ? (completed.length / modules.length) * 100 : 0;

  async function handleCompleteModule(mod: BarberTrainingModule) {
    setActiveLesson(null);
    const idx = modules.findIndex(m => m.id === mod.id);
    const next = modules.map((m, i) => {
      if (m.id === mod.id) return { ...m, status: "completed" as const, progress: 100 };
      // Unlock the next locked module
      if (i === idx + 1 && m.status === "locked") return { ...m, status: "in-progress" as const, progress: 0 };
      return m;
    });
    setJustEarned(mod.points);
    setTimeout(() => setJustEarned(null), 3000);
    await setModules(next);
  }

  const achievements = [
    { label: "First Screening",   icon: "🩺", earned: completed.length >= 1,               desc: "Logged your first health screening"   },
    { label: "10 Clients",        icon: "👥", earned: completed.length >= 2,               desc: "Reached 10 clients seen"              },
    { label: "Referral Maker",    icon: "🏥", earned: completed.length >= 3,               desc: "Made your first referral"             },
    { label: "CHW Graduate",      icon: "🎓", earned: completed.length >= modules.length,  desc: "Complete all training modules"        },
  ];

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="h-8 w-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Training & Certification</h1>
          <p className="text-sm text-gray-400 mt-0.5">UAMS Community Health Worker Program · {completed.length} of {modules.length} modules</p>
        </div>
        {completed.length >= 3 && (
          <Button
            size="sm"
            variant="outline"
            className="gap-2 shrink-0"
            onClick={() => downloadChwCertificate(displayName, shopName || "Partner Shop", completed.length, modules.length)}
          >
            <Download className="h-4 w-4" /> Download Certificate
          </Button>
        )}
      </div>

      {/* Points earned toast */}
      {justEarned !== null && (
        <div className="fixed top-6 right-6 z-50 bg-amber-500 text-black px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-bold animate-fade-in">
          <Star className="h-4 w-4" /> +{justEarned} points earned!
        </div>
      )}

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
                {Math.round(overallPct)}% Complete
              </Badge>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5 mb-2">
              <div
                className="bg-amber-500 h-2.5 rounded-full transition-all duration-700"
                style={{ width: `${overallPct}%` }}
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
                  <p className="text-xs text-gray-400">{inProgress[0].progress}% · {inProgress[0].duration} · {inProgress[0].points} pts</p>
                </div>
              </div>
              <Button
                size="sm" variant="gold" className="shrink-0"
                onClick={() => setActiveLesson(inProgress[0])}
              >
                Resume <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Module list */}
      <div className="grid grid-cols-1 gap-3">
        {modules.map((m, i) => {
          const s      = STATUS_CONFIG[m.status];
          const isExp  = expanded === m.id;
          const lessons = MODULE_CONTENT[m.id] ?? [];
          return (
            <Card
              key={m.id}
              className={cn(
                "transition-all duration-200",
                m.status !== "locked" ? "cursor-pointer hover:shadow-md" : "opacity-60",
                isExp && "ring-2 ring-black"
              )}
            >
              <CardContent className="p-0">
                <button
                  className="w-full flex items-center gap-4 px-5 py-4 text-left"
                  disabled={m.status === "locked"}
                  onClick={() => m.status !== "locked" && setExpanded(isExp ? null : m.id)}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-black",
                    m.status === "completed"   ? "bg-green-500 text-white" :
                    m.status === "in-progress" ? "bg-black text-white"     :
                    "bg-gray-100 text-gray-400"
                  )}>
                    {m.status === "completed" ? <CheckCircle className="h-4 w-4" /> : i + 1}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">{m.title}</span>
                      <Badge className={CATEGORY_COLORS[m.category] ?? "bg-gray-100 text-gray-600"} size="sm">{m.category}</Badge>
                    </div>
                    <div className="flex items-center gap-3 mt-0.5 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock className="h-2.5 w-2.5" />{m.duration}</span>
                      <span className="flex items-center gap-1"><Star className="h-2.5 w-2.5" />{m.points} pts</span>
                    </div>
                    {m.status === "in-progress" && m.progress > 0 && (
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                        <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${m.progress}%` }} />
                      </div>
                    )}
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <Badge className={s.color} size="sm">
                      <s.icon className="h-2.5 w-2.5 mr-1" />{s.label}
                    </Badge>
                    {m.status !== "locked" && (
                      <ChevronDown className={cn("h-4 w-4 text-gray-300 transition-transform", isExp && "rotate-180")} />
                    )}
                  </div>
                </button>

                {isExp && m.status !== "locked" && (
                  <div className="px-5 pb-5 border-t border-gray-50 pt-4 space-y-3">
                    <p className="text-sm text-gray-600 leading-relaxed">{m.description}</p>
                    <div className="space-y-2">
                      {lessons.slice(0, 2).map((l, li) => (
                        <div key={li} className="flex items-start gap-2 text-xs text-gray-500">
                          <span className="text-amber-500 mt-0.5">•</span>
                          <span>{l}</span>
                        </div>
                      ))}
                      {lessons.length > 2 && (
                        <p className="text-xs text-gray-400">+ {lessons.length - 2} more key lessons inside</p>
                      )}
                    </div>
                    <div className="flex gap-2 pt-1">
                      {m.status === "in-progress" && (
                        <Button size="sm" className="gap-2" onClick={() => setActiveLesson(m)}>
                          <Play className="h-3.5 w-3.5" /> {m.progress > 0 ? "Resume Module" : "Start Module"}
                        </Button>
                      )}
                      {m.status === "completed" && (
                        <>
                          <Button size="sm" variant="outline" className="gap-2" onClick={() => setActiveLesson(m)}>
                            <BookOpen className="h-3.5 w-3.5" /> Review
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
            {achievements.map(a => (
              <div
                key={a.label}
                className={cn(
                  "rounded-xl p-3 flex flex-col items-center gap-2 text-center border transition-all",
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

      {activeLesson && (
        <SimulatedLesson
          module={activeLesson}
          onComplete={() => handleCompleteModule(activeLesson)}
          onClose={() => {
            // Save partial progress when exiting mid-lesson
            if (activeLesson.status === "in-progress") {
              setModules(modules.map(m =>
                m.id === activeLesson.id
                  ? { ...m, progress: Math.min(m.progress + 30, 90) }
                  : m
              ));
            }
            setActiveLesson(null);
          }}
        />
      )}
    </div>
  );
}
