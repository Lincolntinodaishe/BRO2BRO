"use client";
import { useState } from "react";
import {
  Search, Plus, Clock, Heart, Activity,
  ChevronRight, X, CheckCircle, AlertCircle, Share2, User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useBarberData } from "@/lib/use-barber-data";
import { useAuth } from "@/lib/auth-context";
import { saveBarberClients } from "@/lib/barber-store";
import type { BarberClient, ClientStatus } from "@/lib/demo-barber-data";

const STATUS_CONFIG: Record<ClientStatus, { label: string; color: string }> = {
  healthy:   { label: "Healthy",   color: "bg-green-50 text-green-700 border-green-100" },
  monitored: { label: "Monitored", color: "bg-amber-50 text-amber-700 border-amber-100" },
  referred:  { label: "Referred",  color: "bg-blue-50 text-blue-700 border-blue-100"   },
  new:       { label: "New",       color: "bg-gray-100 text-gray-600 border-gray-200"  },
  upcoming:  { label: "Upcoming",  color: "bg-gray-100 text-gray-500 border-gray-200"  },
};

function CheckInModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (client: BarberClient) => void;
}) {
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl animate-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Check In Client</h2>
            <p className="text-xs text-gray-400 mt-0.5">Step {step} of 2</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {step === 1 ? (
            <>
              <Input label="Client name" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              <Input label="Phone number" type="tel" placeholder="(501) 555-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              <p className="text-xs text-gray-400">
                If the client has visited before, their profile will auto-populate.
              </p>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-gray-600">Would you like to run a health screening for <span className="font-semibold text-gray-900">{name}</span>?</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="border rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:border-black hover:bg-gray-50 transition-all">
                  <Activity className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium text-gray-700">Yes, screen now</span>
                </div>
                <div className="border rounded-xl p-3 flex flex-col items-center gap-1.5 cursor-pointer hover:border-black hover:bg-gray-50 transition-all">
                  <CheckCircle className="h-4 w-4 text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">Just check in</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="px-6 pb-6 flex gap-3">
          {step === 2 && (
            <Button variant="outline" size="sm" onClick={() => setStep(1)} className="flex-1">Back</Button>
          )}
          <Button
            size="sm"
            className="flex-1"
            onClick={() => {
              if (step === 1) { setStep(2); return; }
              onSave({
                id: Date.now().toString(),
                name: name.trim(),
                phone,
                lastVisit: "Today",
                bp: "–",
                status: "new",
                visits: 1,
                notes: "",
              });
              onClose();
            }}
            disabled={step === 1 && !name.trim()}
          >
            {step === 1 ? "Next" : "Done"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function ClientDrawer({ client, onClose }: { client: BarberClient; onClose: () => void }) {
  const s = STATUS_CONFIG[client.status];
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl w-full sm:max-w-md shadow-xl max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white">
          <div className="flex items-center gap-3">
            <Avatar name={client.name} size="md" />
            <div>
              <h2 className="text-base font-bold text-gray-900">{client.name}</h2>
              <p className="text-xs text-gray-400">
                {client.age ? `Age ${client.age} · ` : ""}{client.visits ?? 0} visits
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-gray-100">
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>
        <div className="p-6 space-y-5">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Last Visit",  value: client.lastVisit },
              { label: "BP",          value: client.bp !== "–" ? client.bp : "Not measured" },
              { label: "Status",      value: <Badge className={s.color} size="sm">{s.label}</Badge> },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">{item.label}</span>
                <span className="text-sm font-semibold text-gray-800">{item.value}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 mb-1.5">Phone</p>
            <p className="text-sm text-gray-800">{client.phone}</p>
          </div>
          {client.notes && (
            <div>
              <p className="text-xs font-medium text-gray-500 mb-1.5">Notes</p>
              <p className="text-sm text-gray-700 leading-relaxed">{client.notes}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-2.5 pt-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Activity className="h-3.5 w-3.5" /> Log Screening
            </Button>
            <Button size="sm" className="gap-2">
              <Share2 className="h-3.5 w-3.5" /> Make Referral
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientsPage() {
  const { user } = useAuth();
  const { clients, loading, isBarberDemo, setClients } = useBarberData();
  const [search, setSearch]         = useState("");
  const [filter, setFilter]         = useState<"all" | ClientStatus>("all");
  const [showCheckin, setShowCheckin] = useState(false);
  const [selected, setSelected]     = useState<BarberClient | null>(null);

  async function handleCheckIn(client: BarberClient) {
    if (isBarberDemo || !user) return;
    const next = [client, ...clients];
    setClients(next);
    await saveBarberClients(user.uid, next);
  }

  const filtered = clients.filter((c) => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || c.status === filter;
    return matchSearch && matchFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-5">

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-black text-gray-900">Clients</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {clients.length} total · {clients.filter(c => c.status === "referred").length} with open referrals
          </p>
        </div>
        <Button size="sm" onClick={() => setShowCheckin(true)} className="gap-2 shrink-0">
          <Plus className="h-4 w-4" /> Check In Client
        </Button>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clients…"
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black bg-white"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {(["all", "healthy", "monitored", "referred", "new"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "px-3 py-2 rounded-xl text-xs font-semibold border transition-all",
                filter === f
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
              )}
            >
              {f === "all" ? "All" : STATUS_CONFIG[f].label}
            </button>
          ))}
        </div>
      </div>

      {/* Client list */}
      <Card>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center py-12 text-center gap-3 px-4">
              <User className="h-8 w-8 text-gray-300" />
              <p className="text-sm text-gray-500">
                {clients.length === 0 ? "No clients yet. Check in your first client to get started." : "No clients match your search."}
              </p>
              {clients.length === 0 && (
                <Button size="sm" onClick={() => setShowCheckin(true)}>Check In Client</Button>
              )}
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {filtered.map((c) => {
                const s = STATUS_CONFIG[c.status];
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelected(c)}
                    className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors text-left group"
                  >
                    <Avatar name={c.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-900 truncate">{c.name}</span>
                        {c.age != null && <span className="text-xs text-gray-400">· Age {c.age}</span>}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Clock className="h-2.5 w-2.5" />{c.lastVisit}
                        </span>
                        {c.bp !== "–" && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Heart className="h-2.5 w-2.5" />BP {c.bp}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">{c.visits ?? 0} visits</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={cn("hidden sm:flex", s.color)} size="sm">{s.label}</Badge>
                      <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Healthy",   count: clients.filter(c => c.status === "healthy").length,   icon: CheckCircle, color: "text-green-600 bg-green-50" },
          { label: "Monitored", count: clients.filter(c => c.status === "monitored").length, icon: AlertCircle, color: "text-amber-600 bg-amber-50" },
          { label: "Referred",  count: clients.filter(c => c.status === "referred").length,  icon: Share2,      color: "text-blue-600 bg-blue-50"   },
          { label: "New",       count: clients.filter(c => c.status === "new").length,       icon: Plus,        color: "text-gray-500 bg-gray-100"  },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", s.color)}>
              <s.icon className="h-4 w-4" />
            </div>
            <div>
              <div className="text-xl font-black text-gray-900">{s.count}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {showCheckin && <CheckInModal onClose={() => setShowCheckin(false)} onSave={handleCheckIn} />}
      {selected && <ClientDrawer client={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
