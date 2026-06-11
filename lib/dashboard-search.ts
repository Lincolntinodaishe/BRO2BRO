import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard, MessageCircle, MapPin, Users, UserCheck, Calendar,
  Settings, Scissors, Activity, Share2, Award, HeartHandshake,
} from "lucide-react";

export interface DashboardSearchItem {
  id: string;
  label: string;
  href: string;
  icon: LucideIcon;
  type: "Page" | "Action" | "Appointment" | "Mentor";
  keywords?: string[];
}

function item(
  id: string,
  label: string,
  href: string,
  icon: LucideIcon,
  type: DashboardSearchItem["type"],
  keywords?: string[]
): DashboardSearchItem {
  return { id, label, href, icon, type, keywords };
}

const MEMBER_PAGES: DashboardSearchItem[] = [
  item("member-overview",      "Overview",           "/dashboard",              LayoutDashboard, "Page", ["home", "dashboard"]),
  item("member-chat",          "Chat with Bro.AI",   "/dashboard/chat",         MessageCircle,   "Page", ["ai", "bro", "wellness", "chat"]),
  item("member-resources",     "Find Resources",     "/dashboard/resources",    MapPin,          "Page", ["clinic", "map", "near me", "health"]),
  item("member-community",     "Community Forum",    "/dashboard/community",    Users,           "Page", ["forum", "crew", "posts"]),
  item("member-mentors",       "Mentors",            "/dashboard/mentors",      UserCheck,       "Page", ["mentor", "coach", "peer"]),
  item("member-appointments",  "Appointments",       "/dashboard/appointments", Calendar,        "Page", ["book", "schedule", "visit"]),
  item("member-settings",      "Settings",           "/dashboard/settings",     Settings,        "Page", ["profile", "account"]),
];

const MEMBER_ACTIONS: DashboardSearchItem[] = [
  item("member-book-appt",     "Book an appointment",     "/dashboard/appointments", Calendar,      "Action", ["schedule", "book"]),
  item("member-find-clinic",   "Find a clinic near me",   "/dashboard/resources",    MapPin,        "Action", ["clinic", "hospital", "map"]),
];

const DEMO_EXTRAS: DashboardSearchItem[] = [
  item("demo-bp-appt",    "Blood Pressure Check — Tomorrow 2pm", "/dashboard/appointments", Calendar,        "Appointment", ["uams", "clinic", "bp"]),
  item("demo-mentor-appt","Mentor session with Raymond T. — 6pm", "/dashboard/appointments", Calendar,        "Appointment", ["raymond", "video", "wellness"]),
  item("demo-raymond",    "Your mentor Raymond T.",              "/dashboard/mentors",      HeartHandshake,  "Mentor",      ["mentor", "raymond", "peer"]),
];

const MENTOR_PAGES: DashboardSearchItem[] = [
  item("mentor-overview",  "Mentor Overview", "/dashboard/mentor",           LayoutDashboard, "Page"),
  item("mentor-mentees",   "Mentees",         "/dashboard/mentor/mentees",   Users,           "Page", ["clients", "marcus"]),
  item("mentor-sessions",  "Sessions",        "/dashboard/mentor/sessions",  Calendar,        "Page", ["schedule", "video"]),
  item("mentor-messages",  "Messages",        "/dashboard/mentor/messages",  MessageCircle,   "Page", ["chat", "inbox"]),
  item("mentor-settings",  "Mentor Settings",   "/dashboard/mentor/settings", Settings,        "Page", ["profile"]),
];

const MENTOR_ACTIONS: DashboardSearchItem[] = [
  item("mentor-schedule",  "Schedule a session", "/dashboard/mentor/sessions?schedule=1", Calendar,      "Action"),
  item("mentor-msg-marcus","Message Marcus J.",  "/dashboard/mentor/messages?mentee=mentee-marcus", MessageCircle, "Action", ["marcus", "demo"]),
];

const BARBER_PAGES: DashboardSearchItem[] = [
  item("barber-overview",   "Shop Overview",     "/dashboard/barber",            LayoutDashboard, "Page"),
  item("barber-clients",    "Clients",           "/dashboard/barber/clients",    Users,           "Page", ["marcus", "check in"]),
  item("barber-screenings", "Health Screenings", "/dashboard/barber/screenings", Activity,        "Page", ["bp", "blood pressure"]),
  item("barber-referrals",  "Referrals",         "/dashboard/barber/referrals",  Share2,          "Page", ["doctor", "uams"]),
  item("barber-training",   "CHW Training",      "/dashboard/barber/training",   Award,           "Page", ["certification", "module"]),
  item("barber-events",     "Events",            "/dashboard/barber/events",     Calendar,        "Page"),
  item("barber-settings",   "Barber Settings",   "/dashboard/barber/settings",   Settings,        "Page"),
];

const BARBER_ACTIONS: DashboardSearchItem[] = [
  item("barber-checkin",    "Check in a client", "/dashboard/barber/clients?checkin=1", Scissors, "Action"),
  item("barber-screening",  "Log a screening",   "/dashboard/barber/screenings",        Activity, "Action", ["bp"]),
  item("barber-referral",   "Create a referral", "/dashboard/barber/referrals",         Share2,   "Action"),
];

/** Merge lists without duplicate ids; first occurrence wins. */
function mergeItems(...lists: DashboardSearchItem[][]): DashboardSearchItem[] {
  const map = new Map<string, DashboardSearchItem>();
  for (const list of lists) {
    for (const entry of list) {
      if (!map.has(entry.id)) map.set(entry.id, entry);
    }
  }
  return Array.from(map.values());
}

export function getDashboardSearchItems(opts: {
  isTestAccount: boolean;
  isBarberDemo: boolean;
  isMentorDemo: boolean;
}): DashboardSearchItem[] {
  if (opts.isMentorDemo) return mergeItems(MENTOR_PAGES, MENTOR_ACTIONS);
  if (opts.isBarberDemo) return mergeItems(BARBER_PAGES, BARBER_ACTIONS);
  if (opts.isTestAccount) return mergeItems(MEMBER_PAGES, MEMBER_ACTIONS, DEMO_EXTRAS);
  return mergeItems(MEMBER_PAGES, MEMBER_ACTIONS);
}

export function filterSearchItems(items: DashboardSearchItem[], query: string): DashboardSearchItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;

  return items.filter((entry) => {
    const haystack = [entry.label, entry.type, ...(entry.keywords ?? [])].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}

export function getSettingsPath(opts: {
  isBarberDemo: boolean;
  isMentorDemo: boolean;
  userRole?: string;
}): string {
  if (opts.isBarberDemo || opts.userRole === "barber") return "/dashboard/barber/settings";
  if (opts.isMentorDemo || opts.userRole === "mentor") return "/dashboard/mentor/settings";
  return "/dashboard/settings";
}
