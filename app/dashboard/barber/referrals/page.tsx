"use client";
import { useState } from "react";
import {
  Share2, Plus, CheckCircle, Clock, AlertCircle,
  Phone, MapPin, X, ChevronDown, Calendar, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useBarberData } from "@/lib/use-barber-data";
import type { BarberReferral, ReferralStatus } from "@/lib/demo-barber-data";

const STATUS_CONFIG: Record<ReferralStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending:   { label: "Pending",    color: "bg-amber-50 text-amber-700 border-amber-100",  icon: Clock        },
  scheduled: { label: "Scheduled",  color: "bg-blue-50 text-blue-700 border-blue-100",     icon: Calendar     },
  completed: { label: "Completed",  color: "bg-green-50 text-green-700 border-green-100",  icon: CheckCircle  },
  "no-show": { label: "No-show",    color: "bg-gray-100 text-gray-500 border-gray-200",    icon: AlertCircle  },
};

const URGENCY_CONFIG = {
  routine:   { label: "Routine",   color: "bg-gray-100 text-gray-600"  },
  urgent:    { label: "Urgent",    color: "bg-amber-50 text-amber-700" },
  emergency: { label: "Emergency", color: "bg-red-50 text-red-700"     },
};

function NewReferralModal({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ client: "", reason: "", provider: "", urgency: "routine" });
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white">
          <div>
            <h2 className="text-base font-bold text-gray-900">New Referral</h2>
            <p className="text-xs text-gray-400 mt-0.5">Connect a client with a provider</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100"><X className="h-4 w-4 text-gray-500" /></button>
        </div>
        <div className="p-6 space-y-4">
          {[
            { label: "Client Name",       key: "client",   placeholder: "Marcus Williams"                },
            { label: "Reason for Referral", key: "reason", placeholder: "Hypertension Stage 2 (142/91)" },
            { label: "Provider / Clinic",  key: "provider", placeholder: "Dr. Carter · Cardiologist"     },
          ].map((f) => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}</label>
              <input
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder={f.placeholder}
                value={(form as Record<string, string>)[f.key]}
                onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Urgency</label>
            <div className="flex gap-2">
              {(["routine", "urgent", "emergency"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setForm((p) => ({ ...p, urgency: u }))}
                  className={cn(
                    "flex-1 py-2 rounded-xl text-xs font-semibold border transition-all capitalize",
                    form.urgency === u ? "bg-black text-white border-black" : "border-gray-200 text-gray-600 hover:border-gray-300"
                  )}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Notes (optional)</label>
            <textarea
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black resize-none"
              placeholder="Any additional context…"
              rows={2}
            />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button size="sm" className="flex-1" disabled={!form.client || !form.reason || !form.provider} onClick={onClose}>
            Submit Referral
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function ReferralsPage() {
  const { referrals, loading } = useBarberData();
  const [showNew, setShowNew]     = useState(false);
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [filter, setFilter]       = useState<"all" | ReferralStatus>("all");

  const filtered = referrals.filter((r) => filter === "all" || r.status === filter);

  const pending   = referrals.filter(r => r.status === "pending").length;
  const scheduled = referrals.filter(r => r.status === "scheduled").length;
  const completed = referrals.filter(r => r.status === "completed").length;

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
          <h1 className="text-xl font-black text-gray-900">Referrals</h1>
          <p className="text-sm text-gray-400 mt-0.5">{referrals.length} total · {pending} pending action</p>
        </div>
        <Button size="sm" onClick={() => setShowNew(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> New Referral
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Pending",   value: pending,   icon: Clock,        color: "bg-amber-50 text-amber-600"  },
          { label: "Scheduled", value: scheduled, icon: Calendar,     color: "bg-blue-50 text-blue-600"    },
          { label: "Completed", value: completed, icon: CheckCircle,  color: "bg-green-50 text-green-600"  },
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

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {(["all", "pending", "scheduled", "completed", "no-show"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold border transition-all capitalize",
              filter === f ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
          >
            {f === "no-show" ? "No-show" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Referrals */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-50">
            {filtered.map((r) => {
              const s = STATUS_CONFIG[r.status];
              const u = URGENCY_CONFIG[r.urgency];
              const isOpen = expanded === r.id;
              return (
                <div key={r.id}>
                  <button
                    onClick={() => setExpanded(isOpen ? null : r.id)}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 text-left group transition-colors"
                  >
                    <Avatar name={r.clientName} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900">{r.clientName}</span>
                        <Badge className={u.color} size="sm">{u.label}</Badge>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-500 flex-wrap">
                        <span className="flex items-center gap-1">
                          <Building2 className="h-2.5 w-2.5" />{r.provider}
                        </span>
                        <span className="text-gray-400">· {r.date}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={cn("hidden sm:flex", s.color)} size="sm">{s.label}</Badge>
                      <ChevronDown className={cn("h-4 w-4 text-gray-300 transition-transform", isOpen && "rotate-180")} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 bg-gray-50 space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 mb-1">Reason</p>
                        <p className="text-sm text-gray-800">{r.reason}</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-1.5">
                          <p className="text-xs font-semibold text-gray-800">{r.provider}</p>
                          <p className="text-xs text-gray-500">{r.providerSpecialty}</p>
                          <a href={`tel:${r.providerPhone}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                            <Phone className="h-3 w-3" />{r.providerPhone}
                          </a>
                          <p className="text-xs text-gray-400 flex items-start gap-1">
                            <MapPin className="h-3 w-3 shrink-0 mt-0.5" />{r.providerAddress}
                          </p>
                        </div>
                        <div className="bg-white rounded-xl p-3 border border-gray-100 space-y-1.5">
                          <p className="text-xs font-medium text-gray-500">Status</p>
                          <Badge className={s.color} size="sm">{s.label}</Badge>
                          {r.appointmentDate && (
                            <p className="text-xs text-gray-700 flex items-center gap-1 mt-1.5">
                              <Calendar className="h-3 w-3" /> Appt: {r.appointmentDate}
                            </p>
                          )}
                          {r.notes && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{r.notes}</p>}
                        </div>
                      </div>
                      {r.status === "pending" && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="gap-1.5 text-xs flex-1">
                            <Phone className="h-3.5 w-3.5" /> Follow Up
                          </Button>
                          <Button size="sm" className="gap-1.5 text-xs flex-1">
                            <Calendar className="h-3.5 w-3.5" /> Mark Scheduled
                          </Button>
                        </div>
                      )}
                      {r.status === "scheduled" && (
                        <Button size="sm" className="gap-1.5 text-xs w-full">
                          <CheckCircle className="h-3.5 w-3.5" /> Mark Completed
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Partner providers */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Partner Providers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { name: "UAMS Community Health",        specialty: "Primary Care",             phone: "(501) 686-7000" },
              { name: "Arkansas Heart Hospital",      specialty: "Cardiology",               phone: "(501) 219-7000" },
              { name: "CHI St. Vincent",              specialty: "Internal Medicine",        phone: "(501) 552-3000" },
              { name: "Diabetes Prevention Program",  specialty: "CDC-Recognized DPP",       phone: "(501) 661-2595" },
            ].map((p) => (
              <div key={p.name} className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 leading-snug">{p.name}</p>
                  <p className="text-[11px] text-gray-500">{p.specialty}</p>
                  <a href={`tel:${p.phone}`} className="text-[11px] text-blue-600 hover:underline flex items-center gap-1 mt-0.5">
                    <Phone className="h-2.5 w-2.5" />{p.phone}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {showNew && <NewReferralModal onClose={() => setShowNew(false)} />}
    </div>
  );
}
