export type ClientStatus = "healthy" | "monitored" | "referred" | "new" | "upcoming";
export type ReferralStatus = "pending" | "scheduled" | "completed" | "no-show";
export type ModuleStatus = "completed" | "in-progress" | "locked";
export type BpFlag = "normal" | "elevated" | "high";
export type GlucoseFlag = "normal" | "prediabetes" | "high";

export interface BarberClient {
  id: string;
  name: string;
  age?: number;
  time?: string;
  lastVisit?: string;
  bp: string;
  status: ClientStatus;
  visits?: number;
  phone?: string;
  notes?: string;
  referred?: boolean;
}

export interface BarberScreening {
  id: string;
  name: string;
  date: string;
  time: string;
  bp: string;
  bpFlag: BpFlag;
  glucose: string;
  glucoseFlag: GlucoseFlag;
  weight: string;
  bmi?: string;
  referred: boolean;
  notes: string;
  flag?: "normal" | "high";
}

export interface BarberReferral {
  id: string;
  clientName: string;
  clientAge: number;
  reason: string;
  provider: string;
  providerSpecialty: string;
  providerPhone: string;
  providerAddress: string;
  date: string;
  appointmentDate?: string;
  status: ReferralStatus;
  urgency: "routine" | "urgent" | "emergency";
  notes: string;
}

export interface BarberTrainingModule {
  id: string;
  title: string;
  description: string;
  duration: string;
  status: ModuleStatus;
  progress: number;
  category: string;
  points: number;
}

export interface BarberStat {
  label: string;
  value: string;
  delta: string;
}

export const DEMO_BARBER_STATS: BarberStat[] = [
  { label: "Clients Today", value: "8", delta: "+2 vs yesterday" },
  { label: "Screenings Done", value: "12", delta: "3 flagged high BP" },
  { label: "Active Referrals", value: "6", delta: "2 appointments set" },
  { label: "CHW Score", value: "94%", delta: "Top 10% this month" },
];

export const EMPTY_BARBER_STATS: BarberStat[] = [
  { label: "Clients Today", value: "0", delta: "Check in your first client" },
  { label: "Screenings Done", value: "0", delta: "Log a screening to start" },
  { label: "Active Referrals", value: "0", delta: "No referrals yet" },
  { label: "CHW Score", value: "—", delta: "Complete training modules" },
];

export const DEMO_TODAY_CLIENTS: BarberClient[] = [
  { id: "1", name: "Marcus W.", time: "9:15 AM", bp: "128/82", status: "monitored", referred: false },
  { id: "2", name: "James T.", time: "10:30 AM", bp: "118/76", status: "healthy", referred: false },
  { id: "3", name: "Darius K.", time: "11:45 AM", bp: "142/91", status: "referred", referred: true },
  { id: "4", name: "DeShawn M.", time: "2:00 PM", bp: "–", status: "upcoming", referred: false },
  { id: "5", name: "Terrence B.", time: "3:30 PM", bp: "–", status: "upcoming", referred: false },
];

export const DEMO_BARBER_CLIENTS: BarberClient[] = [
  { id: "1", name: "Marcus Williams", age: 42, lastVisit: "Today", bp: "128/82", status: "monitored", visits: 14, phone: "(501) 555-0142", notes: "BRO2BRO member Marcus J. · matched with mentor Raymond T. Watching BP. Prefers morning slots." },
  { id: "2", name: "James Thompson", age: 35, lastVisit: "Today", bp: "118/76", status: "healthy", visits: 8, phone: "(501) 555-0102", notes: "Runs every morning. BP always good." },
  { id: "3", name: "Darius Kennedy", age: 55, lastVisit: "Today", bp: "142/91", status: "referred", visits: 22, phone: "(501) 555-0103", notes: "Referred to Dr. Carter. Follow up needed." },
  { id: "4", name: "DeShawn Mitchell", age: 29, lastVisit: "2 days ago", bp: "122/78", status: "healthy", visits: 5, phone: "(501) 555-0104", notes: "" },
  { id: "5", name: "Terrence Brown", age: 48, lastVisit: "1 week ago", bp: "134/86", status: "monitored", visits: 11, phone: "(501) 555-0105", notes: "Check glucose at next visit." },
  { id: "6", name: "Raymond Pierce", age: 61, lastVisit: "2 weeks ago", bp: "148/95", status: "referred", visits: 18, phone: "(501) 555-0106", notes: "High BP + elevated glucose. Under care of Dr. Lewis." },
  { id: "7", name: "Anthony Davis", age: 33, lastVisit: "3 weeks ago", bp: "–", status: "new", visits: 1, phone: "(501) 555-0107", notes: "First visit. Needs full screening." },
  { id: "8", name: "Calvin Okafor", age: 44, lastVisit: "1 month ago", bp: "126/80", status: "healthy", visits: 7, phone: "(501) 555-0108", notes: "" },
];

export const DEMO_BARBER_SCREENINGS: BarberScreening[] = [
  { id: "1", name: "Darius Kennedy", date: "Today", time: "11:45 AM", bp: "142/91", bpFlag: "high", glucose: "118", glucoseFlag: "prediabetes", weight: "201 lbs", bmi: "28.4", referred: true, notes: "Referred to Dr. Carter. Follow-up scheduled.", flag: "high" },
  { id: "2", name: "Marcus Williams", date: "Today", time: "9:15 AM", bp: "128/82", bpFlag: "elevated", glucose: "94", glucoseFlag: "normal", weight: "185 lbs", bmi: "25.1", referred: false, notes: "Watch blood pressure trend.", flag: "normal" },
  { id: "3", name: "James Thompson", date: "Today", time: "10:30 AM", bp: "118/76", bpFlag: "normal", glucose: "88", glucoseFlag: "normal", weight: "172 lbs", bmi: "23.8", referred: false, notes: "", flag: "normal" },
  { id: "4", name: "Terrence Brown", date: "Yesterday", time: "2:00 PM", bp: "134/86", bpFlag: "elevated", glucose: "108", glucoseFlag: "prediabetes", weight: "194 lbs", bmi: "27.2", referred: false, notes: "Monitor glucose. Advised diet changes.", flag: "normal" },
  { id: "5", name: "Raymond Pierce", date: "2 days ago", time: "3:30 PM", bp: "148/95", bpFlag: "high", glucose: "131", glucoseFlag: "high", weight: "218 lbs", bmi: "31.1", referred: true, notes: "Urgent referral. Dr. Lewis notified.", flag: "high" },
  { id: "6", name: "Calvin Okafor", date: "1 week ago", time: "11:00 AM", bp: "122/78", bpFlag: "normal", glucose: "91", glucoseFlag: "normal", weight: "178 lbs", bmi: "24.5", referred: false, notes: "", flag: "normal" },
];

export const DEMO_OVERVIEW_SCREENINGS = DEMO_BARBER_SCREENINGS.slice(0, 3);

export const DEMO_BARBER_REFERRALS: BarberReferral[] = [
  {
    id: "1", clientName: "Darius Kennedy", clientAge: 55,
    reason: "Hypertension Stage 2 (142/91)",
    provider: "Dr. Michael Carter", providerSpecialty: "Cardiologist",
    providerPhone: "(501) 555-2001", providerAddress: "1200 Main St, Little Rock, AR",
    date: "Today", appointmentDate: "Jun 18, 2026",
    status: "scheduled", urgency: "urgent",
    notes: "Patient agreed to appointment. Gave printed referral slip.",
  },
  {
    id: "2", clientName: "Raymond Pierce", clientAge: 61,
    reason: "Hypertension Stage 2 + Elevated Glucose (148/95, 131 mg/dL)",
    provider: "Dr. Angela Lewis", providerSpecialty: "Internal Medicine",
    providerPhone: "(501) 555-2002", providerAddress: "800 Health Way, North Little Rock, AR",
    date: "2 days ago",
    status: "pending", urgency: "emergency",
    notes: "Urgent case. Client needs to call today.",
  },
  {
    id: "3", clientName: "Terrence Brown", clientAge: 48,
    reason: "Elevated BP trend (134/86)",
    provider: "UAMS Community Clinic", providerSpecialty: "Primary Care",
    providerPhone: "(501) 555-2003", providerAddress: "4301 W Markham St, Little Rock, AR",
    date: "1 week ago", appointmentDate: "Jun 20, 2026",
    status: "scheduled", urgency: "routine",
    notes: "Client prefers afternoon slots.",
  },
];

export const DEMO_BARBER_MODULES: BarberTrainingModule[] = [
  { id: "1", title: "Introduction to CHW", description: "Your role as a Community Health Worker in the barbershop.", duration: "45 min", status: "completed", progress: 100, category: "Foundation", points: 100 },
  { id: "2", title: "Blood Pressure Screening", description: "Proper cuff technique, reading results, and when to refer.", duration: "60 min", status: "completed", progress: 100, category: "Screenings", points: 150 },
  { id: "3", title: "Understanding Heart Disease", description: "Risk factors, warning signs, and honest conversations.", duration: "50 min", status: "completed", progress: 100, category: "Education", points: 100 },
  { id: "4", title: "Diabetes Awareness", description: "Glucose screening, pre-diabetes, and lifestyle strategies.", duration: "55 min", status: "in-progress", progress: 60, category: "Screenings", points: 150 },
  { id: "5", title: "Mental Health First Aid", description: "Recognizing depression and anxiety signs.", duration: "70 min", status: "locked", progress: 0, category: "Mental Health", points: 200 },
  { id: "6", title: "Referral Pathways", description: "Warm handoffs and partner providers in Arkansas.", duration: "40 min", status: "locked", progress: 0, category: "Referrals", points: 100 },
  { id: "7", title: "Cultural Competency", description: "Building trust in Black men's health conversations.", duration: "50 min", status: "locked", progress: 0, category: "Foundation", points: 100 },
  { id: "8", title: "CHW Certification Exam", description: "Final assessment for Arkansas CHW certification.", duration: "90 min", status: "locked", progress: 0, category: "Certification", points: 500 },
];

export const EMPTY_BARBER_MODULES: BarberTrainingModule[] = DEMO_BARBER_MODULES.map((m, i) => ({
  ...m,
  status: i === 0 ? "in-progress" as const : "locked" as const,
  progress: i === 0 ? 0 : 0,
}));
