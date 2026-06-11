"use client";
import { useState } from "react";
import {
  Activity, Plus, AlertCircle, CheckCircle,
  X, ChevronDown, TrendingUp, TrendingDown, Minus,
  Heart, Droplets, Scale,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useBarberData } from "@/lib/use-barber-data";
import type { BarberScreening } from "@/lib/demo-barber-data";

const BP_CONFIG = {
  normal:   { label: "Normal",   color: "text-green-700 bg-green-50",  icon: CheckCircle },
  elevated: { label: "Elevated", color: "text-amber-700 bg-amber-50",  icon: AlertCircle },
  high:     { label: "High",     color: "text-red-700 bg-red-50",      icon: AlertCircle },
};

const GLUCOSE_CONFIG = {
  normal:      { label: "Normal",      color: "text-green-700 bg-green-50" },
  prediabetes: { label: "Pre-diabetes", color: "text-amber-700 bg-amber-50" },
  high:        { label: "High",        color: "text-red-700 bg-red-50"    },
};

function LogModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({
    name: "", bp_sys: "", bp_dia: "", glucose: "", weight: "",
  });

  const bpNum = parseInt(form.bp_sys);
  const bpFlag = bpNum >= 140 ? "high" : bpNum >= 130 ? "elevated" : "normal";

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="text-base font-bold text-gray-900">Log Screening</h2>
            <p className="text-xs text-gray-400 mt-0.5">Record client health vitals</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Client Name</label>
            <input
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="Marcus Williams"
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Blood Pressure (mmHg)
              {form.bp_sys && (
                <Badge className={cn("ml-2", BP_CONFIG[bpFlag].color)} size="sm">
                  {BP_CONFIG[bpFlag].label}
                </Badge>
              )}
            </label>
            <div className="flex gap-2 items-center">
              <input
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Systolic"
                type="number"
                value={form.bp_sys}
                onChange={(e) => setForm((p) => ({ ...p, bp_sys: e.target.value }))}
              />
              <span className="text-gray-400 font-bold">/</span>
              <input
                className="flex-1 px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder="Diastolic"
                type="number"
                value={form.bp_dia}
                onChange={(e) => setForm((p) => ({ ...p, bp_dia: e.target.value }))}
              />
            </div>
            <p className="text-[11px] text-gray-400 mt-1.5">Normal &lt;120/80 · Elevated 120-129 · High ≥130/80</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Fasting Blood Glucose (mg/dL)</label>
            <input
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g. 95"
              type="number"
              value={form.glucose}
              onChange={(e) => setForm((p) => ({ ...p, glucose: e.target.value }))}
            />
            <p className="text-[11px] text-gray-400 mt-1.5">Normal &lt;100 · Pre-diabetes 100-125 · High ≥126</p>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Weight (lbs)</label>
            <input
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
              placeholder="e.g. 185"
              type="number"
              value={form.weight}
              onChange={(e) => setForm((p) => ({ ...p, weight: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Any observations or next steps…"
              rows={2}
            />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            size="sm"
            className="flex-1"
            disabled={!form.name.trim() || !form.bp_sys || !form.bp_dia}
            onClick={onClose}
          >
            Save Screening
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ScreeningsPage() {
  const { screenings, loading } = useBarberData();
  const [showLog, setShowLog]     = useState(false);
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [filter, setFilter]       = useState<"all" | "flagged" | "referred">("all");

  const filtered = screenings.filter((s) => {
    if (filter === "flagged")  return s.bpFlag !== "normal" || s.glucoseFlag !== "normal";
    if (filter === "referred") return s.referred;
    return true;
  });

  const flagged  = screenings.filter(s => s.bpFlag !== "normal" || s.glucoseFlag !== "normal").length;
  const referred = screenings.filter(s => s.referred).length;

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
          <h1 className="text-xl font-black text-gray-900">Health Screenings</h1>
          <p className="text-sm text-gray-400 mt-0.5">{screenings.length} recorded · {flagged} flagged · {referred} referred</p>
        </div>
        <Button size="sm" onClick={() => setShowLog(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Log Screening
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total Screenings", value: screenings.length, icon: Activity, color: "bg-blue-50 text-blue-600"   },
          { label: "Flagged",          value: flagged,                 icon: AlertCircle, color: "bg-red-50 text-red-600" },
          { label: "Referred",         value: referred,                icon: TrendingUp, color: "bg-teal-50 text-teal-600" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-4 flex items-center gap-3">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", s.color)}>
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xl font-black text-gray-900">{s.value}</div>
                <div className="text-xs text-gray-500">{s.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(["all", "flagged", "referred"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize",
              filter === f ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
          >
            {f === "flagged" ? `Flagged (${flagged})` : f === "referred" ? `Referred (${referred})` : "All"}
          </button>
        ))}
      </div>

      {/* Screening list */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {filtered.map((s) => {
              const bp  = BP_CONFIG[s.bpFlag];
              const gl  = GLUCOSE_CONFIG[s.glucoseFlag];
              const isOpen = expanded === s.id;
              return (
                <div key={s.id} className="transition-colors">
                  <button
                    onClick={() => setExpanded(isOpen ? null : s.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left group transition-colors"
                  >
                    <Avatar name={s.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{s.name}</span>
                        {s.referred && (
                          <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-md font-semibold">Referred</span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 text-xs flex-wrap">
                        <span className="text-gray-400">{s.date} · {s.time}</span>
                        <span className={cn("font-medium flex items-center gap-1", s.bpFlag === "high" ? "text-red-600" : s.bpFlag === "elevated" ? "text-amber-600" : "text-gray-600")}>
                          <Heart className="h-2.5 w-2.5" /> BP {s.bp}
                        </span>
                        <span className={cn("font-medium", s.glucoseFlag !== "normal" ? "text-amber-600" : "text-gray-600")}>
                          Glucose {s.glucose}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={cn("hidden sm:flex", bp.color)} size="sm">{bp.label}</Badge>
                      <ChevronDown className={cn("h-4 w-4 text-gray-300 transition-transform", isOpen && "rotate-180")} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 bg-gray-50">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                        {[
                          { label: "Blood Pressure", value: s.bp, flag: bp.label, flagColor: bp.color, icon: Heart },
                          { label: "Glucose",         value: `${s.glucose} mg/dL`, flag: gl.label, flagColor: gl.color, icon: Droplets },
                          { label: "Weight",          value: s.weight, flag: "", flagColor: "", icon: Scale },
                          { label: "BMI", value: s.bmi ?? "—", flag: s.bmi ? (parseFloat(s.bmi) >= 30 ? "Obese" : parseFloat(s.bmi) >= 25 ? "Overweight" : "Normal") : "", flagColor: s.bmi && parseFloat(s.bmi) >= 25 ? "text-amber-700 bg-amber-50" : "text-green-700 bg-green-50", icon: Activity },
                        ].map((m) => (
                          <div key={m.label} className="bg-white rounded-xl p-3 border border-gray-100">
                            <div className="flex items-center gap-1.5 mb-1.5">
                              <m.icon className="h-3 w-3 text-gray-400" />
                              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{m.label}</span>
                            </div>
                            <div className="text-sm font-bold text-gray-900">{m.value}</div>
                            {m.flag && <Badge className={cn("mt-1", m.flagColor)} size="sm">{m.flag}</Badge>}
                          </div>
                        ))}
                      </div>
                      {s.notes && (
                        <p className="text-xs text-gray-600 bg-white rounded-xl px-3 py-2.5 border border-gray-100">
                          {s.notes}
                        </p>
                      )}
                      {!s.referred && (s.bpFlag !== "normal" || s.glucoseFlag !== "normal") && (
                        <div className="mt-2.5 flex gap-2">
                          <Button size="sm" variant="outline" className="gap-2 text-xs">
                            <AlertCircle className="h-3.5 w-3.5 text-amber-500" /> Flag for follow-up
                          </Button>
                          <Button size="sm" className="gap-2 text-xs">
                            Make Referral
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* BP reference card */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Blood Pressure Reference</h3>
          <div className="space-y-2">
            {[
              { range: "Normal",       sys: "< 120",   dia: "< 80",  color: "bg-green-500" },
              { range: "Elevated",     sys: "120–129", dia: "< 80",  color: "bg-yellow-400" },
              { range: "High Stage 1", sys: "130–139", dia: "80–89", color: "bg-orange-400" },
              { range: "High Stage 2", sys: "≥ 140",   dia: "≥ 90", color: "bg-red-500"    },
            ].map((r) => (
              <div key={r.range} className="flex items-center gap-3">
                <div className={cn("w-2.5 h-2.5 rounded-full shrink-0", r.color)} />
                <span className="text-xs font-semibold text-gray-700 w-28">{r.range}</span>
                <span className="text-xs text-gray-500">Systolic {r.sys} / Diastolic {r.dia}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showLog && <LogModal onClose={() => setShowLog(false)} />}
    </div>
  );
}
