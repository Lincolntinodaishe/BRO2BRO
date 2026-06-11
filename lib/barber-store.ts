import { ref, get, set } from "firebase/database";
import { requireDb } from "@/lib/firebase";
import type {
  BarberClient,
  BarberScreening,
  BarberReferral,
} from "@/lib/demo-barber-data";
import {
  DEMO_BARBER_CLIENTS,
  DEMO_BARBER_SCREENINGS,
  DEMO_BARBER_REFERRALS,
} from "@/lib/demo-barber-data";

function barberRef(uid: string, key: string) {
  return ref(requireDb(), `users/${uid}/barber/${key}`);
}

export async function loadBarberClients(uid: string): Promise<BarberClient[]> {
  const snap = await get(barberRef(uid, "clients"));
  if (!snap.exists()) return [];
  return Object.values(snap.val() as Record<string, BarberClient>);
}

export async function saveBarberClients(uid: string, clients: BarberClient[]): Promise<void> {
  const obj = clients.reduce<Record<string, BarberClient>>(
    (acc, c) => ({ ...acc, [c.id]: c }),
    {}
  );
  await set(barberRef(uid, "clients"), obj);
}

export async function loadBarberScreenings(uid: string): Promise<BarberScreening[]> {
  const snap = await get(barberRef(uid, "screenings"));
  if (!snap.exists()) return [];
  return Object.values(snap.val() as Record<string, BarberScreening>);
}

export async function saveBarberScreenings(uid: string, screenings: BarberScreening[]): Promise<void> {
  const obj = screenings.reduce<Record<string, BarberScreening>>(
    (acc, s) => ({ ...acc, [s.id]: s }),
    {}
  );
  await set(barberRef(uid, "screenings"), obj);
}

export async function loadBarberReferrals(uid: string): Promise<BarberReferral[]> {
  const snap = await get(barberRef(uid, "referrals"));
  if (!snap.exists()) return [];
  return Object.values(snap.val() as Record<string, BarberReferral>);
}

export async function saveBarberReferrals(uid: string, referrals: BarberReferral[]): Promise<void> {
  const obj = referrals.reduce<Record<string, BarberReferral>>(
    (acc, r) => ({ ...acc, [r.id]: r }),
    {}
  );
  await set(barberRef(uid, "referrals"), obj);
}

export async function seedBarberDemoData(uid: string): Promise<void> {
  await Promise.all([
    saveBarberClients(uid, DEMO_BARBER_CLIENTS),
    saveBarberScreenings(uid, DEMO_BARBER_SCREENINGS),
    saveBarberReferrals(uid, DEMO_BARBER_REFERRALS),
  ]);
}
