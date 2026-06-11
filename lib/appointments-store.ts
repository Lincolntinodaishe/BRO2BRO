import { ref, get, set } from "firebase/database";
import { requireDb } from "@/lib/firebase";

export type ApptStatus = "confirmed" | "pending" | "completed" | "cancelled";
export type ApptType   = "clinic" | "barbershop" | "virtual" | "ai";

export interface Appointment {
  id:           string;
  title:        string;
  provider:     string;
  providerType: ApptType;
  date:         string;
  time:         string;
  location:     string;
  phone?:       string;
  status:       ApptStatus;
  notes?:       string;
  reminder:     boolean;
}

/* ── Mock data for the test account ──────────────────────────── */
export const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    title: "Blood Pressure Check",
    provider: "UAMS Community Clinic",
    providerType: "clinic",
    date: "Tomorrow",
    time: "2:00 PM",
    location: "4301 W Markham St, Little Rock",
    phone: "(501) 686-7000",
    status: "confirmed",
    reminder: true,
  },
  {
    id: "2",
    title: "Weekly Wellness Check-in",
    provider: "Bro AI",
    providerType: "ai",
    date: "Monday, Jun 16",
    time: "8:00 AM",
    location: "In-app",
    status: "confirmed",
    notes: "Automated weekly check-in — covers BP, stress, sleep, and activity.",
    reminder: true,
  },
  {
    id: "3",
    title: "Barbershop Talk Follow-up",
    provider: "Joe's Classic Cuts",
    providerType: "barbershop",
    date: "Friday, Jun 20",
    time: "10:00 AM",
    location: "1523 Main St, Little Rock",
    phone: "(501) 555-0142",
    status: "pending",
    reminder: false,
  },
  {
    id: "4",
    title: "Mental Wellness Session",
    provider: "Dr. Angela Moore, LCSW",
    providerType: "virtual",
    date: "Mon, Jun 23",
    time: "6:00 PM",
    location: "Telehealth — Zoom link sent to email",
    phone: "(501) 555-0199",
    status: "confirmed",
    notes: "First session. Free through BRO2BRO Community Partnership.",
    reminder: true,
  },
  {
    id: "5",
    title: "Diabetes Screening",
    provider: "Baptist Health Clinic",
    providerType: "clinic",
    date: "Tue, Jun 10",
    time: "9:30 AM",
    location: "11 Stagecoach Dr, Little Rock",
    phone: "(501) 202-3000",
    status: "completed",
    reminder: false,
  },
  {
    id: "6",
    title: "Primary Care Visit",
    provider: "Central AR Family Health",
    providerType: "clinic",
    date: "May 28",
    time: "11:00 AM",
    location: "700 S University Ave, Little Rock",
    status: "cancelled",
    notes: "Cancelled by provider — need to reschedule.",
    reminder: false,
  },
];

/* ── Firebase path ───────────────────────────────────────────── */
function apptRef(uid: string) {
  return ref(requireDb(), `users/${uid}/appointments`);
}

/* ── Load appointments for a user from Firebase ─────────────── */
export async function loadUserAppointments(uid: string): Promise<Appointment[]> {
  const snap = await get(apptRef(uid));
  if (!snap.exists()) return [];
  const val = snap.val() as Record<string, Appointment>;
  return Object.values(val);
}

/* ── Save appointments for a user to Firebase ───────────────── */
export async function saveUserAppointments(uid: string, appointments: Appointment[]): Promise<void> {
  const obj = appointments.reduce<Record<string, Appointment>>(
    (acc, a) => ({ ...acc, [a.id]: a }),
    {}
  );
  await set(apptRef(uid), obj);
}

/* ── Seed test account with mock data ────────────────────────── */
export async function seedTestAccount(uid: string): Promise<void> {
  const { seedDemoAccount } = await import("@/lib/demo-seed");
  await seedDemoAccount(uid);
}
