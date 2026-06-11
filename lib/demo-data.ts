import { DEMO_EMAIL } from "@/lib/demo-account";

export interface DemoStat {
  label: string;
  value: string;
  delta: string;
}

export interface DemoOverviewAppt {
  title: string;
  provider: string;
  time: string;
  type: string;
  confirmed: boolean;
}

export interface DemoCrewActivity {
  name: string;
  action: string;
  time: string;
  badge: "streak" | "milestone" | "new" | null;
}

export interface DemoMilestone {
  label: string;
  done: boolean;
}

export interface DemoNotification {
  id: number;
  text: string;
  time: string;
  unread: boolean;
}

export interface UserProfileData {
  name: string;
  email: string;
  phone: string;
  city: string;
  age: string;
  focus: string[];
}

export const DEMO_PROFILE: UserProfileData = {
  name: "Marcus J.",
  email: DEMO_EMAIL,
  phone: "(501) 555-0142",
  city: "Little Rock, AR",
  age: "35–44",
  focus: ["Blood Pressure", "Mental Wellness"],
};

export const DEMO_QUICK_STATS: DemoStat[] = [
  { label: "Check-in Streak", value: "12 days", delta: "+3 this week" },
  { label: "AI Conversations", value: "8", delta: "4 this month" },
  { label: "Resources Found", value: "5", delta: "2 new nearby" },
  { label: "Crew Members", value: "4", delta: "1 joined today" },
];

export const DEMO_OVERVIEW_APPOINTMENTS: DemoOverviewAppt[] = [
  {
    title: "Blood Pressure Check",
    provider: "UAMS Community Clinic",
    time: "Tomorrow · 2:00 PM",
    type: "In-person",
    confirmed: true,
  },
  {
    title: "Mental Wellness Check-in",
    provider: "Bro AI",
    time: "Every Monday · 8:00 AM",
    type: "Automated",
    confirmed: true,
  },
  {
    title: "Barbershop Talk Follow-up",
    provider: "Joe's Classic Cuts — Little Rock",
    time: "Friday · 10:00 AM",
    type: "In-person",
    confirmed: false,
  },
];

export const DEMO_CREW_ACTIVITY: DemoCrewActivity[] = [
  { name: "Dre M.", action: "Completed BP check-in", time: "2h ago", badge: "streak" },
  { name: "Trev J.", action: "Booked clinic appointment", time: "5h ago", badge: "new" },
  { name: "Carlos W.", action: "Hit 30-day streak!", time: "1d ago", badge: "milestone" },
  { name: "Reggie T.", action: "Joined the community forum", time: "2d ago", badge: null },
];

export const DEMO_MILESTONES: DemoMilestone[] = [
  { label: "First Check-in", done: true },
  { label: "7-day Streak", done: true },
  { label: "Found a Clinic", done: true },
  { label: "30-day Streak", done: false },
  { label: "Book Appointment", done: false },
  { label: "Connect w/ Mentor", done: false },
];

export const DEMO_NOTIFICATIONS: DemoNotification[] = [
  { id: 1, text: "Your appointment tomorrow at 2pm is confirmed", time: "5m ago", unread: true },
  { id: 2, text: "Marcus from your crew completed his check-in 🎉", time: "1h ago", unread: true },
  { id: 3, text: "New resource added near 72201 — Community Health Clinic", time: "3h ago", unread: false },
];

export const EMPTY_QUICK_STATS: DemoStat[] = [
  { label: "Check-in Streak", value: "0 days", delta: "Start your first check-in" },
  { label: "AI Conversations", value: "0", delta: "Chat with Bro AI" },
  { label: "Resources Found", value: "0", delta: "Search near your zip" },
  { label: "Crew Members", value: "0", delta: "Join the community" },
];

export const EMPTY_MILESTONES: DemoMilestone[] = [
  { label: "First Check-in", done: false },
  { label: "7-day Streak", done: false },
  { label: "Found a Clinic", done: false },
  { label: "30-day Streak", done: false },
  { label: "Book Appointment", done: false },
  { label: "Connect w/ Mentor", done: false },
];

export function emptyProfile(email: string, displayName: string): UserProfileData {
  return {
    name: displayName || "",
    email,
    phone: "",
    city: "",
    age: "",
    focus: [],
  };
}
