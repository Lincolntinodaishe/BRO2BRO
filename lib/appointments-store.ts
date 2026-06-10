export type ApptStatus = "confirmed" | "pending" | "completed" | "cancelled";
export type ApptType = "clinic" | "barbershop" | "virtual" | "ai";

export interface Appointment {
  id: string;
  title: string;
  provider: string;
  providerType: ApptType;
  date: string;
  time: string;
  location: string;
  phone?: string;
  status: ApptStatus;
  notes?: string;
  reminder: boolean;
}

const STORAGE_KEY = "bro2bro_appointments";

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
    provider: "Bro.AI",
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

export function loadAppointments(): Appointment[] {
  if (typeof window === "undefined") return DEFAULT_APPOINTMENTS;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_APPOINTMENTS;
    return JSON.parse(stored);
  } catch {
    return DEFAULT_APPOINTMENTS;
  }
}

export function saveAppointments(appointments: Appointment[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
}
