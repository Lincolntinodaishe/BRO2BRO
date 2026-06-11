import { DEMO_ECOSYSTEM, MARCUS_MENTEE_ID } from "@/lib/demo-ecosystem";
import { MENTOR_DEMO_EMAIL } from "@/lib/demo-account";
import type { UserProfileData } from "@/lib/demo-data";

export type MenteeStatus = "active" | "new" | "paused";
export type SessionStatus = "upcoming" | "completed" | "cancelled";
export type MessageSender = "mentor" | "mentee";

export interface MentorMentee {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  age: number;
  focus: string[];
  status: MenteeStatus;
  lastCheckIn: string;
  streak: number;
  bp: string;
  referredBy: string;
  notes: string;
  unread: number;
}

export interface MentorSession {
  id: string;
  menteeId: string;
  menteeName: string;
  title: string;
  date: string;
  time: string;
  format: "video" | "phone" | "in-person";
  status: SessionStatus;
  notes: string;
}

export interface MentorMessage {
  id: string;
  menteeId: string;
  menteeName: string;
  sender: MessageSender;
  text: string;
  time: string;
  read: boolean;
}

export interface MentorStat {
  label: string;
  value: string;
  delta: string;
}

export const MENTOR_DEMO_PROFILE: UserProfileData = {
  name: DEMO_ECOSYSTEM.mentor.name,
  email: MENTOR_DEMO_EMAIL,
  phone: "(501) 555-0177",
  city: "Little Rock, AR",
  age: "45–54",
  focus: [...DEMO_ECOSYSTEM.mentor.specialties],
  role: "mentor",
};

export const DEMO_MENTOR_STATS: MentorStat[] = [
  { label: "Active Mentees", value: "4", delta: "+1 this month" },
  { label: "Sessions Held", value: "18", delta: "3 this week" },
  { label: "Avg. Streak", value: "9 days", delta: "Marcus on 12-day streak" },
  { label: "Impact Score", value: "96%", delta: "Top 5% of mentors" },
];

export const EMPTY_MENTOR_STATS: MentorStat[] = [
  { label: "Active Mentees", value: "0", delta: "Accept your first match" },
  { label: "Sessions Held", value: "0", delta: "Schedule a session" },
  { label: "Avg. Streak", value: "—", delta: "Track mentee check-ins" },
  { label: "Impact Score", value: "—", delta: "Complete mentor onboarding" },
];

export const DEMO_MENTEES: MentorMentee[] = [
  {
    id: MARCUS_MENTEE_ID,
    name: DEMO_ECOSYSTEM.member.name,
    email: DEMO_ECOSYSTEM.member.email,
    phone: DEMO_ECOSYSTEM.member.phone,
    city: DEMO_ECOSYSTEM.member.city,
    age: DEMO_ECOSYSTEM.member.age,
    focus: [...DEMO_ECOSYSTEM.member.focus],
    status: "active",
    lastCheckIn: "Today",
    streak: 12,
    bp: "128/82",
    referredBy: `${DEMO_ECOSYSTEM.barber.shop} · ${DEMO_ECOSYSTEM.barber.name}`,
    notes: "Screened at Joe's Classic Cuts. Working on BP + stress. Responds well to accountability check-ins.",
    unread: 2,
  },
  {
    id: "mentee-james",
    name: "James T.",
    email: "james.t@example.com",
    phone: "(501) 555-0102",
    city: "Little Rock, AR",
    age: 35,
    focus: ["Fitness", "Nutrition"],
    status: "active",
    lastCheckIn: "Yesterday",
    streak: 7,
    bp: "118/76",
    referredBy: "Community signup",
    notes: "Training for first 5K. Weekly virtual check-ins.",
    unread: 0,
  },
  {
    id: "mentee-darius",
    name: "Darius K.",
    email: "darius.k@example.com",
    phone: "(501) 555-0103",
    city: "North Little Rock, AR",
    age: 55,
    focus: ["Blood Pressure", "Diabetes"],
    status: "active",
    lastCheckIn: "2 days ago",
    streak: 4,
    bp: "142/91",
    referredBy: `${DEMO_ECOSYSTEM.barber.shop} · urgent referral`,
    notes: "Referred to cardiologist. Needs encouragement to keep appointment.",
    unread: 1,
  },
  {
    id: "mentee-anthony",
    name: "Anthony D.",
    email: "anthony.d@example.com",
    phone: "(501) 555-0107",
    city: "Little Rock, AR",
    age: 33,
    focus: ["Mental Wellness"],
    status: "new",
    lastCheckIn: "3 days ago",
    streak: 1,
    bp: "—",
    referredBy: "BRO2BRO match",
    notes: "New match — first session scheduled.",
    unread: 0,
  },
];

export const DEMO_MENTOR_SESSIONS: MentorSession[] = [
  {
    id: "s1",
    menteeId: MARCUS_MENTEE_ID,
    menteeName: DEMO_ECOSYSTEM.member.name,
    title: "Weekly BP & Wellness Check-in",
    date: "Tomorrow",
    time: "6:00 PM",
    format: "video",
    status: "upcoming",
    notes: "Review home BP log. Discuss barbershop follow-up at Joe's.",
  },
  {
    id: "s2",
    menteeId: MARCUS_MENTEE_ID,
    menteeName: DEMO_ECOSYSTEM.member.name,
    title: "Stress & Sleep Review",
    date: "Last Friday",
    time: "5:30 PM",
    format: "video",
    status: "completed",
    notes: "Marcus reported better sleep. Encouraged continued Bro AI check-ins.",
  },
  {
    id: "s3",
    menteeId: "mentee-james",
    menteeName: "James T.",
    title: "Fitness Goal Check-in",
    date: "Thursday",
    time: "7:00 PM",
    format: "phone",
    status: "upcoming",
    notes: "",
  },
  {
    id: "s4",
    menteeId: "mentee-darius",
    menteeName: "Darius K.",
    title: "Clinic Appointment Prep",
    date: "Monday",
    time: "4:00 PM",
    format: "video",
    status: "upcoming",
    notes: "Prepare questions for Dr. Carter visit.",
  },
];

export const DEMO_MENTOR_MESSAGES: MentorMessage[] = [
  {
    id: "m1",
    menteeId: MARCUS_MENTEE_ID,
    menteeName: DEMO_ECOSYSTEM.member.name,
    sender: "mentee",
    text: "Hey Raymond — BP was 128/82 at Joe's shop today. Feeling good about the streak.",
    time: "2h ago",
    read: false,
  },
  {
    id: "m2",
    menteeId: MARCUS_MENTEE_ID,
    menteeName: DEMO_ECOSYSTEM.member.name,
    sender: "mentor",
    text: "That's solid, Marcus. Keep logging mornings. We'll review tomorrow at 6.",
    time: "1h ago",
    read: true,
  },
  {
    id: "m3",
    menteeId: MARCUS_MENTEE_ID,
    menteeName: DEMO_ECOSYSTEM.member.name,
    sender: "mentee",
    text: "Can we talk about the UAMS appointment Joe mentioned? A little nervous.",
    time: "45m ago",
    read: false,
  },
  {
    id: "m4",
    menteeId: "mentee-darius",
    menteeName: "Darius K.",
    sender: "mentee",
    text: "Confirmed my cardiology referral for next week. Thanks for the push.",
    time: "Yesterday",
    read: false,
  },
];

/** Member-facing mentor card for test@gmail.com */
export const DEMO_MEMBER_MENTOR = {
  id: "mentor-raymond",
  name: DEMO_ECOSYSTEM.mentor.name,
  title: DEMO_ECOSYSTEM.mentor.title,
  location: "Little Rock, AR",
  specialties: [...DEMO_ECOSYSTEM.mentor.specialties],
  bio: `Matched after your screening at ${DEMO_ECOSYSTEM.barber.shop}. Raymond helps you stay accountable on blood pressure and mental wellness — the same journey Joe flagged during your last cut.`,
  rating: 5.0,
  reviews: 34,
  sessions: 12,
  available: true,
  verified: true,
  format: "both" as const,
  isYourMentor: true,
  nextSession: "Tomorrow · 6:00 PM · Video",
};
