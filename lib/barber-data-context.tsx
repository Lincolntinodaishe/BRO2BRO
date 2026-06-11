"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/lib/auth-context";
import {
  loadBarberClients,
  loadBarberScreenings,
  loadBarberReferrals,
  loadBarberModules,
  saveBarberClients,
  saveBarberScreenings,
  saveBarberReferrals,
  saveBarberModules,
} from "@/lib/barber-store";
import {
  DEMO_BARBER_CLIENTS,
  DEMO_BARBER_SCREENINGS,
  DEMO_BARBER_REFERRALS,
  DEMO_BARBER_MODULES,
  EMPTY_BARBER_MODULES,
  type BarberClient,
  type BarberScreening,
  type BarberReferral,
  type BarberTrainingModule,
  type BarberStat,
} from "@/lib/demo-barber-data";

interface BarberDataContextValue {
  loading: boolean;
  clients: BarberClient[];
  screenings: BarberScreening[];
  referrals: BarberReferral[];
  modules: BarberTrainingModule[];
  stats: BarberStat[];
  todayClients: BarberClient[];
  overviewScreenings: BarberScreening[];
  setClients: (next: BarberClient[]) => Promise<void>;
  setScreenings: (next: BarberScreening[]) => Promise<void>;
  setReferrals: (next: BarberReferral[]) => Promise<void>;
  setModules: (next: BarberTrainingModule[]) => Promise<void>;
  addClient: (client: BarberClient) => Promise<void>;
  addScreening: (screening: BarberScreening) => Promise<void>;
  addReferral: (referral: BarberReferral) => Promise<void>;
  updateClient: (id: string, patch: Partial<BarberClient>) => Promise<void>;
  updateScreening: (id: string, patch: Partial<BarberScreening>) => Promise<void>;
  updateReferral: (id: string, patch: Partial<BarberReferral>) => Promise<void>;
}

const BarberDataContext = createContext<BarberDataContextValue | null>(null);

export function BarberDataProvider({ children }: { children: ReactNode }) {
  const { user, isBarberDemo } = useAuth();
  const [clients, setClientsState] = useState<BarberClient[]>([]);
  const [screenings, setScreeningsState] = useState<BarberScreening[]>([]);
  const [referrals, setReferralsState] = useState<BarberReferral[]>([]);
  const [modules, setModulesState] = useState<BarberTrainingModule[]>(EMPTY_BARBER_MODULES);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all([
      loadBarberClients(user.uid),
      loadBarberScreenings(user.uid),
      loadBarberReferrals(user.uid),
      loadBarberModules(user.uid),
    ])
      .then(([c, s, r, m]) => {
        const hasData = c.length + s.length + r.length > 0;
        if (isBarberDemo && !hasData) {
          setClientsState(DEMO_BARBER_CLIENTS);
          setScreeningsState(DEMO_BARBER_SCREENINGS);
          setReferralsState(DEMO_BARBER_REFERRALS);
          setModulesState(DEMO_BARBER_MODULES);
        } else {
          setClientsState(c);
          setScreeningsState(s);
          setReferralsState(r);
          setModulesState(m.length ? m : EMPTY_BARBER_MODULES);
        }
      })
      .catch(() => {
        if (isBarberDemo) {
          setClientsState(DEMO_BARBER_CLIENTS);
          setScreeningsState(DEMO_BARBER_SCREENINGS);
          setReferralsState(DEMO_BARBER_REFERRALS);
          setModulesState(DEMO_BARBER_MODULES);
        }
      })
      .finally(() => setLoading(false));
  }, [user, isBarberDemo]);

  const persist = useCallback(
    async (key: "clients" | "screenings" | "referrals" | "modules", data: unknown) => {
      if (!user) return;
      const uid = user.uid;
      if (key === "clients") await saveBarberClients(uid, data as BarberClient[]);
      if (key === "screenings") await saveBarberScreenings(uid, data as BarberScreening[]);
      if (key === "referrals") await saveBarberReferrals(uid, data as BarberReferral[]);
      if (key === "modules") await saveBarberModules(uid, data as BarberTrainingModule[]);
    },
    [user]
  );

  const setClients = useCallback(async (next: BarberClient[]) => {
    setClientsState(next);
    await persist("clients", next);
  }, [persist]);

  const setScreenings = useCallback(async (next: BarberScreening[]) => {
    setScreeningsState(next);
    await persist("screenings", next);
  }, [persist]);

  const setReferrals = useCallback(async (next: BarberReferral[]) => {
    setReferralsState(next);
    await persist("referrals", next);
  }, [persist]);

  const setModules = useCallback(async (next: BarberTrainingModule[]) => {
    setModulesState(next);
    await persist("modules", next);
  }, [persist]);

  const addClient = useCallback(async (client: BarberClient) => {
    await setClients([client, ...clients]);
  }, [clients, setClients]);

  const addScreening = useCallback(async (screening: BarberScreening) => {
    const nextScreenings = [screening, ...screenings];
    await setScreenings(nextScreenings);
    const match = clients.find(
      (c) => c.name.toLowerCase() === screening.name.toLowerCase()
    );
    if (match) {
      await setClients(
        clients.map((c) =>
          c.id === match.id
            ? {
                ...c,
                bp: screening.bp,
                lastVisit: "Today",
                status:
                  screening.bpFlag === "high"
                    ? "monitored"
                    : c.status === "new"
                      ? "healthy"
                      : c.status,
              }
            : c
        )
      );
    }
  }, [clients, screenings, setClients, setScreenings]);

  const addReferral = useCallback(async (referral: BarberReferral) => {
    await setReferrals([referral, ...referrals]);
    await setClients(
      clients.map((c) =>
        c.name.toLowerCase() === referral.clientName.toLowerCase()
          ? { ...c, status: "referred" as const, referred: true }
          : c
      )
    );
  }, [clients, referrals, setClients, setReferrals]);

  const updateClient = useCallback(async (id: string, patch: Partial<BarberClient>) => {
    await setClients(clients.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, [clients, setClients]);

  const updateScreening = useCallback(async (id: string, patch: Partial<BarberScreening>) => {
    await setScreenings(screenings.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }, [screenings, setScreenings]);

  const updateReferral = useCallback(async (id: string, patch: Partial<BarberReferral>) => {
    await setReferrals(referrals.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }, [referrals, setReferrals]);

  const completedModules = modules.filter((m) => m.status === "completed");
  const totalPoints = completedModules.reduce((s, m) => s + m.points, 0);
  const todayCount = clients.filter((c) => c.lastVisit === "Today").length;
  const flaggedCount = screenings.filter(
    (s) => s.bpFlag !== "normal" || s.glucoseFlag !== "normal"
  ).length;

  const stats: BarberStat[] = useMemo(() => [
    {
      label: "Clients Today",
      value: String(todayCount || (isBarberDemo ? 8 : 0)),
      delta: todayCount ? `+${todayCount} checked in` : "Check in your first client",
    },
    {
      label: "Screenings Done",
      value: String(screenings.length),
      delta: flaggedCount ? `${flaggedCount} flagged high BP` : "Log a screening to start",
    },
    {
      label: "Active Referrals",
      value: String(referrals.filter((r) => r.status !== "completed").length),
      delta: `${referrals.filter((r) => r.status === "scheduled").length} appointments set`,
    },
    {
      label: "CHW Score",
      value: modules.length
        ? `${Math.round((completedModules.length / modules.length) * 100)}%`
        : "—",
      delta: `${totalPoints} pts · ${completedModules.length}/${modules.length} modules`,
    },
  ], [todayCount, screenings.length, flaggedCount, referrals, modules, completedModules, totalPoints, isBarberDemo]);

  const todayClients = useMemo(
    () =>
      clients
        .filter((c) => c.lastVisit === "Today" || c.status === "upcoming")
        .slice(0, 6),
    [clients]
  );

  const overviewScreenings = useMemo(() => screenings.slice(0, 3), [screenings]);

  const value: BarberDataContextValue = {
    loading,
    clients,
    screenings,
    referrals,
    modules,
    stats,
    todayClients,
    overviewScreenings,
    setClients,
    setScreenings,
    setReferrals,
    setModules,
    addClient,
    addScreening,
    addReferral,
    updateClient,
    updateScreening,
    updateReferral,
  };

  return (
    <BarberDataContext.Provider value={value}>
      {children}
    </BarberDataContext.Provider>
  );
}

export function useBarberData() {
  const ctx = useContext(BarberDataContext);
  if (!ctx) throw new Error("useBarberData must be used within BarberDataProvider");
  return ctx;
}
