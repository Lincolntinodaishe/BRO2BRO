"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import {
  loadBarberClients,
  loadBarberScreenings,
  loadBarberReferrals,
} from "@/lib/barber-store";
import {
  DEMO_BARBER_CLIENTS,
  DEMO_BARBER_SCREENINGS,
  DEMO_BARBER_REFERRALS,
  DEMO_BARBER_MODULES,
  DEMO_TODAY_CLIENTS,
  DEMO_OVERVIEW_SCREENINGS,
  DEMO_BARBER_STATS,
  EMPTY_BARBER_STATS,
  EMPTY_BARBER_MODULES,
  type BarberClient,
  type BarberScreening,
  type BarberReferral,
  type BarberTrainingModule,
  type BarberStat,
} from "@/lib/demo-barber-data";

export function useBarberData() {
  const { user, isBarberDemo } = useAuth();
  const [clients, setClients] = useState<BarberClient[]>([]);
  const [screenings, setScreenings] = useState<BarberScreening[]>([]);
  const [referrals, setReferrals] = useState<BarberReferral[]>([]);
  const [loading, setLoading] = useState(!isBarberDemo);

  useEffect(() => {
    if (isBarberDemo || !user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all([
      loadBarberClients(user.uid),
      loadBarberScreenings(user.uid),
      loadBarberReferrals(user.uid),
    ])
      .then(([c, s, r]) => {
        setClients(c);
        setScreenings(s);
        setReferrals(r);
      })
      .finally(() => setLoading(false));
  }, [user, isBarberDemo]);

  const stats: BarberStat[] = isBarberDemo ? DEMO_BARBER_STATS : EMPTY_BARBER_STATS;
  const todayClients: BarberClient[] = isBarberDemo
    ? DEMO_TODAY_CLIENTS
    : clients.filter((c) => c.lastVisit === "Today" || c.status === "upcoming").slice(0, 5);
  const overviewScreenings: BarberScreening[] = isBarberDemo
    ? DEMO_OVERVIEW_SCREENINGS
    : screenings.slice(0, 3);
  const modules: BarberTrainingModule[] = isBarberDemo ? DEMO_BARBER_MODULES : EMPTY_BARBER_MODULES;

  const allClients = isBarberDemo ? DEMO_BARBER_CLIENTS : clients;
  const allScreenings = isBarberDemo ? DEMO_BARBER_SCREENINGS : screenings;
  const allReferrals = isBarberDemo ? DEMO_BARBER_REFERRALS : referrals;

  return {
    loading,
    isBarberDemo,
    stats,
    todayClients,
    overviewScreenings,
    modules,
    clients: allClients,
    screenings: allScreenings,
    referrals: allReferrals,
    setClients,
    setScreenings,
    setReferrals,
  };
}
