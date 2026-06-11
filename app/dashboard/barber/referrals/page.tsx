"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Share2, Plus, CheckCircle, Clock, AlertCircle,
  Phone, MapPin, X, ChevronDown, Calendar, Building2,
  Copy, QrCode, Link as LinkIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useBarberData } from "@/lib/use-barber-data";
import { useAuth } from "@/lib/auth-context";
import type { BarberReferral, ReferralStatus } from "@/lib/demo-barber-data";

/* ── Deterministic referral code from UID ────────────────────── */
function getBarberCode(uid: string, isDemo: boolean): string {
  if (isDemo) return "B2B-JOE2024";
  return `B2B-${uid.replace(/-/g, "").slice(0, 6).toUpperCase()}`;
}

const STATUS_CONFIG: Record<ReferralStatus, { label: string; color: string; icon: typeof CheckCircle }> = {
  pending:   { label: "Pending",   color: "bg-amber-50 text-amber-700 border-amber-100", icon: Clock       },
  scheduled: { label: "Scheduled", color: "bg-blue-50 text-blue-700 border-blue-100",    icon: Calendar    },
  completed: { label: "Completed", color: "bg-green-50 text-green-700 border-green-100", icon: CheckCircle },
  "no-show": { label: "No-show",   color: "bg-gray-100 text-gray-500 border-gray-200",   icon: AlertCircle },
};

const URGENCY_CONFIG = {
  routine:   { label: "Routine",   color: "bg-gray-100 text-gray-600"  },
  urgent:    { label: "Urgent",    color: "bg-amber-50 text-amber-700" },
  emergency: { label: "Emergency", color: "bg-red-50 text-red-700"     },
};

const PARTNER_PROVIDERS = [
  { name: "UAMS Community Health",       specialty: "Primary Care",         phone: "(501) 686-7000", addr: "4301 W Markham St, LR" },
  { name: "Arkansas Heart Hospital",     specialty: "Cardiology",           phone: "(501) 219-7000", addr: "1701 S Shackleford Rd, LR" },
  { name: "CHI St. Vincent",             specialty: "Internal Medicine",    phone: "(501) 552-3000", addr: "2 St. Vincent Cir, LR" },
  { name: "Diabetes Prevention Program", specialty: "CDC-Recognized DPP",   phone: "(501) 661-2595", addr: "4815 W Markham St, LR" },
];

function NewReferralModal({
  onClose,
  onSave,
  defaults = {},
}: {
  onClose: () => void;
  onSave: (r: BarberReferral) => Promise<void>;
  defaults?: {
    client?: string;
    reason?: string;
    provider?: string;
    providerSpecialty?: string;
    providerPhone?: string;
  };
}) {
  const [form, setForm] = useState({
    client: defaults.client ?? "",
    reason: defaults.reason ?? "",
    provider: defaults.provider ?? "",
    providerSpecialty: defaults.providerSpecialty ?? "",
    providerPhone: defaults.providerPhone ?? "",
    urgency: "routine" as "routine" | "urgent" | "emergency",
    notes: "",
  });

  useEffect(() => {
    setForm({
      client: defaults.client ?? "",
      reason: defaults.reason ?? "",
      provider: defaults.provider ?? "",
      providerSpecialty: defaults.providerSpecialty ?? "",
      providerPhone: defaults.providerPhone ?? "",
      urgency: "routine",
      notes: "",
    });
  }, [defaults]);
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    setSaving(true);
    const referral: BarberReferral = {
      id: Date.now().toString(),
      clientName: form.client.trim(),
      clientAge: 0,
      reason: form.reason.trim(),
      provider: form.provider.trim(),
      providerSpecialty: form.providerSpecialty.trim() || "Healthcare Provider",
      providerPhone: form.providerPhone.trim() || "—",
      providerAddress: "Little Rock, AR",
      date: "Today",
      status: "pending",
      urgency: form.urgency,
      notes: form.notes.trim(),
    };
    await onSave(referral);
    setSaving(false);
    onClose();
  }

  const canSubmit = form.client.trim() && form.reason.trim() && form.provider.trim();

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
            { label: "Client Name",          key: "client",             placeholder: "Marcus Williams"                },
            { label: "Reason for Referral",  key: "reason",             placeholder: "Hypertension Stage 2 (142/91)" },
            { label: "Provider / Clinic",    key: "provider",           placeholder: "Dr. Carter · Cardiologist"      },
            { label: "Specialty (optional)", key: "providerSpecialty",  placeholder: "Cardiologist"                   },
            { label: "Provider Phone",       key: "providerPhone",      placeholder: "(501) 555-0000"                 },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">{f.label}</label>
              <input
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black"
                placeholder={f.placeholder}
                value={(form as Record<string, string>)[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
              />
            </div>
          ))}

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Urgency</label>
            <div className="flex gap-2">
              {(["routine", "urgent", "emergency"] as const).map(u => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, urgency: u }))}
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
              value={form.notes}
              onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
            />
          </div>
        </div>
        <div className="px-6 pb-6 flex gap-3">
          <Button variant="outline" size="sm" className="flex-1" onClick={onClose}>Cancel</Button>
          <Button
            size="sm" className="flex-1"
            disabled={!canSubmit || saving}
            onClick={handleSubmit}
          >
            {saving
              ? <span className="flex items-center gap-2"><span className="h-3.5 w-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</span>
              : "Submit Referral"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ReferralCodeCard({ uid, isBarberDemo }: { uid: string; isBarberDemo: boolean }) {
  const code = getBarberCode(uid, isBarberDemo);
  const link = `https://bro2bro.app/join?ref=${code}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&margin=8&data=${encodeURIComponent(link)}`;
  const [copied, setCopied] = useState<"code" | "link" | null>(null);

  function copy(type: "code" | "link") {
    navigator.clipboard.writeText(type === "code" ? code : link);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <Card>
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-4">
          <QrCode className="h-4 w-4 text-amber-600" />
          <h3 className="text-sm font-bold text-gray-900">Your Referral Code</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-5 items-start">
          {/* QR code */}
          <div className="shrink-0 bg-white rounded-xl border border-gray-100 p-2 shadow-sm">
            <img
              src={qrUrl}
              alt={`QR code for ${code}`}
              width={160}
              height={160}
              className="rounded-lg"
            />
          </div>
          {/* Details */}
          <div className="flex-1 min-w-0 space-y-3">
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Your unique barber code</p>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black text-gray-900 tracking-wider">{code}</span>
                <button
                  onClick={() => copy("code")}
                  className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                  title="Copy code"
                >
                  {copied === "code"
                    ? <CheckCircle className="h-4 w-4 text-green-500" />
                    : <Copy className="h-4 w-4 text-gray-400" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1.5">Shareable join link</p>
              <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2 border border-gray-100">
                <LinkIcon className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                <span className="text-xs text-gray-600 truncate flex-1">{link}</span>
                <button
                  onClick={() => copy("link")}
                  className="shrink-0 p-1 rounded hover:bg-gray-200 transition-colors"
                  title="Copy link"
                >
                  {copied === "link"
                    ? <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    : <Copy className="h-3.5 w-3.5 text-gray-400" />}
                </button>
              </div>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Share this QR code or link with your clients. When they sign up through your link, they&apos;re automatically connected to <span className="font-semibold text-gray-600">your shop</span> on BRO2BRO.
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="gold"
                className="gap-2"
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: "Join BRO2BRO", text: `Use my referral code ${code}`, url: link });
                  } else {
                    copy("link");
                  }
                }}
              >
                <Share2 className="h-3.5 w-3.5" /> Share Code
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ReferralsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { referrals, loading, addReferral, updateReferral } = useBarberData();
  const { user, isBarberDemo } = useAuth();
  const [showNew, setShowNew]   = useState(false);
  const [defaults, setDefaults] = useState<{
    client?: string;
    reason?: string;
    provider?: string;
    providerSpecialty?: string;
    providerPhone?: string;
  }>({});
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter]     = useState<"all" | ReferralStatus>("all");

  useEffect(() => {
    const client = searchParams.get("client");
    if (client) {
      setDefaults({
        client: decodeURIComponent(client),
        reason: searchParams.get("reason") ? decodeURIComponent(searchParams.get("reason")!) : "",
      });
      setShowNew(true);
    }
  }, [searchParams]);

  async function handleSaveReferral(r: BarberReferral) {
    await addReferral(r);
    router.replace("/dashboard/barber/referrals", { scroll: false });
  }

  async function handleStatusChange(id: string, status: ReferralStatus) {
    const patch: Partial<BarberReferral> = { status };
    if (status === "scheduled") {
      patch.appointmentDate = new Date(Date.now() + 7 * 86400000).toLocaleDateString("en-US", {
        month: "short", day: "numeric", year: "numeric",
      });
    }
    await updateReferral(id, patch);
  }

  const filtered = referrals.filter(r => filter === "all" || r.status === filter);
  const pending   = referrals.filter(r => r.status === "pending").length;
  const scheduled = referrals.filter(r => r.status === "scheduled").length;
  const completed = referrals.filter(r => r.status === "completed").length;

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
          { label: "Pending",   value: pending,   icon: Clock,       color: "bg-amber-50 text-amber-600" },
          { label: "Scheduled", value: scheduled, icon: Calendar,    color: "bg-blue-50 text-blue-600"   },
          { label: "Completed", value: completed, icon: CheckCircle, color: "bg-green-50 text-green-600" },
        ].map(s => (
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
        {(["all", "pending", "scheduled", "completed", "no-show"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              "px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
              filter === f ? "bg-black text-white border-black" : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
            )}
          >
            {f === "no-show" ? "No-show" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Referral list */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <Share2 className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">
                {referrals.length === 0 ? "No referrals yet. Connect your first client with a provider." : "No referrals match this filter."}
              </p>
              {referrals.length === 0 && <Button size="sm" onClick={() => setShowNew(true)}>New Referral</Button>}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map(r => {
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
                            {r.providerPhone !== "—" && (
                              <a href={`tel:${r.providerPhone}`} className="text-xs text-blue-600 flex items-center gap-1 hover:underline">
                                <Phone className="h-3 w-3" />{r.providerPhone}
                              </a>
                            )}
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
                        <div className="flex gap-2 flex-wrap">
                          {r.status === "pending" && (
                            <Button size="sm" className="gap-1.5 text-xs" onClick={() => handleStatusChange(r.id, "scheduled")}>
                              <Calendar className="h-3.5 w-3.5" /> Mark Scheduled
                            </Button>
                          )}
                          {r.status === "scheduled" && (
                            <Button size="sm" className="gap-1.5 text-xs" onClick={() => handleStatusChange(r.id, "completed")}>
                              <CheckCircle className="h-3.5 w-3.5" /> Mark Completed
                            </Button>
                          )}
                          {(r.status === "pending" || r.status === "scheduled") && (
                            <Button size="sm" variant="outline" className="gap-1.5 text-xs" onClick={() => handleStatusChange(r.id, "no-show")}>
                              No-show
                            </Button>
                          )}
                          {r.providerPhone !== "—" && (
                            <a
                              href={`tel:${r.providerPhone}`}
                              className="inline-flex items-center gap-1.5 text-xs h-9 px-4 rounded-full border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                            >
                              <Phone className="h-3.5 w-3.5" /> Call Provider
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* QR / referral code */}
      <ReferralCodeCard uid={user?.uid ?? "demo"} isBarberDemo={isBarberDemo} />

      {/* Partner providers */}
      <Card>
        <CardContent className="p-5">
          <h3 className="text-sm font-bold text-gray-900 mb-3">Partner Providers</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PARTNER_PROVIDERS.map(p => (
              <button
                key={p.name}
                type="button"
                onClick={() => {
                  setDefaults({
                    provider: p.name,
                    providerSpecialty: p.specialty,
                    providerPhone: p.phone,
                  });
                  setShowNew(true);
                }}
                className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100 hover:border-black hover:bg-white transition-all text-left w-full"
              >
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shrink-0">
                  <Building2 className="h-3.5 w-3.5 text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-gray-900 leading-snug">{p.name}</p>
                  <p className="text-[11px] text-gray-500">{p.specialty}</p>
                  <p className="text-[11px] text-gray-400">{p.addr}</p>
                  <span className="text-[11px] text-blue-600 flex items-center gap-1 mt-0.5">
                    <Phone className="h-2.5 w-2.5" />{p.phone}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {showNew && (
        <NewReferralModal
          defaults={defaults}
          onClose={() => {
            setShowNew(false);
            setDefaults({});
            router.replace("/dashboard/barber/referrals", { scroll: false });
          }}
          onSave={handleSaveReferral}
        />
      )}
    </div>
  );
}

export default function ReferralsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><div className="h-8 w-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" /></div>}>
      <ReferralsContent />
    </Suspense>
  );
}
