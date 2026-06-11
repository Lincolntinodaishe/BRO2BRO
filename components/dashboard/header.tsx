"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, Menu, Search, Settings, LogOut, User,
  LayoutDashboard, MessageCircle, MapPin, Users,
  UserCheck, Calendar, ChevronRight, Scissors, Activity, Share2, Award,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  userName?: string;
  onSignOut?: () => void;
}

const notifications: typeof DEMO_NOTIFICATIONS = [];

/* ── Search palette ─────────────────────────────────────────── */
const BASE_SEARCH_ITEMS = [
  { label: "Overview",       href: "/dashboard",              icon: LayoutDashboard, type: "Page" },
  { label: "Chat with Bro.AI",        href: "/dashboard/chat",         icon: MessageCircle,   type: "Page" },
  { label: "Find Resources", href: "/dashboard/resources",    icon: MapPin,          type: "Page" },
  { label: "Community",      href: "/dashboard/community",    icon: Users,           type: "Page" },
  { label: "Mentors",        href: "/dashboard/mentors",      icon: UserCheck,       type: "Page" },
  { label: "Appointments",   href: "/dashboard/appointments", icon: Calendar,        type: "Page" },
  { label: "Settings",       href: "/dashboard/settings",     icon: Settings,        type: "Page" },
  { label: "Book Appointment",        href: "/dashboard/appointments", icon: Calendar,    type: "Action" },
  { label: "Chat with Bro.AI",        href: "/dashboard/chat",         icon: MessageCircle, type: "Action" },
  { label: "Find a clinic near me",   href: "/dashboard/resources",    icon: MapPin,        type: "Action" },
];

const DEMO_SEARCH_ITEMS = [
  { label: "Blood Pressure Check — Tomorrow 2pm", href: "/dashboard/appointments", icon: Calendar, type: "Appointment" },
  { label: "Mental Wellness Session — Jun 23",    href: "/dashboard/appointments", icon: Calendar, type: "Appointment" },
];

const BARBER_SEARCH_ITEMS = [
  { label: "Shop Overview",    href: "/dashboard/barber",             icon: LayoutDashboard, type: "Page" },
  { label: "Clients",          href: "/dashboard/barber/clients",     icon: Users,           type: "Page" },
  { label: "Health Screenings",href: "/dashboard/barber/screenings",  icon: Activity,        type: "Page" },
  { label: "Referrals",        href: "/dashboard/barber/referrals",   icon: Share2,          type: "Page" },
  { label: "CHW Training",     href: "/dashboard/barber/training",    icon: Award,           type: "Page" },
  { label: "Barber Settings",  href: "/dashboard/barber/settings",    icon: Settings,        type: "Page" },
  { label: "Check In Client",  href: "/dashboard/barber/clients?checkin=1", icon: Scissors,  type: "Action" },
  { label: "Log Screening",    href: "/dashboard/barber/screenings",  icon: Activity,        type: "Action" },
  { label: "New Referral",     href: "/dashboard/barber/referrals",   icon: Share2,          type: "Action" },
];

function SearchPalette({ onClose, isTestAccount, isBarberDemo }: { onClose: () => void; isTestAccount: boolean; isBarberDemo: boolean }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const SEARCH_ITEMS = isBarberDemo
    ? BARBER_SEARCH_ITEMS
    : isTestAccount
      ? [...BASE_SEARCH_ITEMS, ...DEMO_SEARCH_ITEMS]
      : BASE_SEARCH_ITEMS;

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const filtered = query.trim()
    ? SEARCH_ITEMS.filter((i) =>
        i.label.toLowerCase().includes(query.toLowerCase()) ||
        i.type.toLowerCase().includes(query.toLowerCase())
      )
    : SEARCH_ITEMS;

  function go(href: string) {
    router.push(href);
    onClose();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") { onClose(); return; }
    if (e.key === "ArrowDown") { e.preventDefault(); setFocused((p) => Math.min(p + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setFocused((p) => Math.max(p - 1, 0)); }
    if (e.key === "Enter" && filtered[focused]) go(filtered[focused].href);
  }

  const typeColors: Record<string, string> = {
    Page:        "text-gray-400",
    Action:      "text-amber-600",
    Appointment: "text-blue-600",
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 z-[200] flex items-start justify-center pt-[12vh] px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-gray-100">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => { setQuery(e.target.value); setFocused(0); }}
            onKeyDown={handleKey}
            placeholder="Search pages, appointments, actions…"
            className="flex-1 text-sm outline-none text-gray-900 placeholder:text-gray-400"
          />
          <kbd className="text-[10px] text-gray-300 font-mono border border-gray-200 rounded px-1.5 py-0.5">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-72 overflow-y-auto py-1.5">
          {filtered.length === 0 ? (
            <p className="px-4 py-5 text-sm text-gray-400 text-center">No results for &ldquo;{query}&rdquo;</p>
          ) : (
            filtered.map((item, i) => {
              const Icon = item.icon;
              return (
                <button
                  key={i}
                  onClick={() => go(item.href)}
                  onMouseEnter={() => setFocused(i)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 transition-colors text-left",
                    focused === i ? "bg-gray-50" : "hover:bg-gray-50"
                  )}
                >
                  <div className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="h-3.5 w-3.5 text-gray-500" />
                  </div>
                  <span className="flex-1 text-sm text-gray-800">{item.label}</span>
                  <span className={cn("text-xs font-medium shrink-0", typeColors[item.type] ?? "text-gray-400")}>
                    {item.type}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                </button>
              );
            })
          )}
        </div>

        <div className="px-4 py-2.5 border-t border-gray-50 flex gap-4 text-[11px] text-gray-400">
          <span><kbd className="font-mono border border-gray-200 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono border border-gray-200 rounded px-1">↵</kbd> open</span>
          <span><kbd className="font-mono border border-gray-200 rounded px-1">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

/* ── Header ─────────────────────────────────────────────────── */
export function Header({ title = "Dashboard", onMenuClick, userName = "Marcus J.", onSignOut }: HeaderProps) {
  const { isTestAccount, isBarberDemo } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications_, setNotifications] = useState(isTestAccount ? DEMO_NOTIFICATIONS : notifications);
  const unreadCount = notifications_.filter((n) => n.unread).length;

  useEffect(() => {
    setNotifications(isTestAccount ? DEMO_NOTIFICATIONS : []);
  }, [isTestAccount]);

  // Cmd+K opens search
  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setNotifOpen(false);
        setProfileOpen(false);
      }
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-notif]")) setNotifOpen(false);
      if (!t.closest("[data-profile]")) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 sm:px-5 py-0 flex items-center h-16 gap-3">
        {/* Mobile menu */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        {/* Page title */}
        <h1 className="text-sm font-semibold text-gray-900 flex-1 hidden sm:block">{title}</h1>

        {/* Right actions */}
        <div className="flex items-center gap-1.5 ml-auto">
          {/* Search button */}
          <button
            onClick={() => { setSearchOpen(true); setNotifOpen(false); setProfileOpen(false); }}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-400 hover:border-gray-300 transition-colors"
          >
            <Search className="h-4 w-4" />
            <span className="hidden md:block text-xs">Search…</span>
            <kbd className="hidden md:inline-flex items-center text-[11px] text-gray-300 font-mono ml-4">⌘K</kbd>
          </button>

          {/* Notifications */}
          <div className="relative" data-notif>
            <button
              onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-amber-500 rounded-full" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-fade-in">
                <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-900">Notifications</span>
                  {unreadCount > 0 && <Badge variant="gold" size="sm">{unreadCount} new</Badge>}
                </div>
                <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                  {notifications_.length === 0 ? (
                    <p className="px-4 py-8 text-xs text-gray-400 text-center">No notifications yet.</p>
                  ) : (
                    notifications_.map((n) => (
                    <div
                      key={n.id}
                      className={cn("px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer", n.unread && "bg-amber-50/40")}
                    >
                      <div className={cn("mt-1 h-2 w-2 rounded-full shrink-0", n.unread ? "bg-amber-500" : "bg-gray-200")} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-800 leading-relaxed">{n.text}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                      </div>
                    </div>
                  ))
                  )}
                </div>
                {notifications_.length > 0 && (
                <div className="px-4 py-3 border-t border-gray-50">
                  <button
                    onClick={() => setNotifications((p) => p.map((n) => ({ ...n, unread: false })))}
                    className="text-xs text-gray-500 hover:text-black transition-colors"
                  >
                    Mark all as read
                  </button>
                </div>
                )}
              </div>
            )}
          </div>

          {/* Avatar / Profile dropdown */}
          <div className="relative pl-0.5" data-profile>
            <button
              onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
              className="rounded-full ring-2 ring-transparent hover:ring-gray-200 transition-all"
            >
              <Avatar name={userName} size="sm" online />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-fade-in overflow-hidden">
                {/* User info header */}
                <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-3">
                  <Avatar name={userName} size="sm" online />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{userName}</div>
                    <div className="text-xs text-gray-400">Men's Health</div>
                  </div>
                </div>

                {/* Menu items */}
                <div className="py-1.5">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-gray-400" />
                    View Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-gray-400" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-gray-50 py-1.5">
                  <button onClick={onSignOut} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Search palette */}
      {searchOpen && <SearchPalette onClose={() => setSearchOpen(false)} isTestAccount={isTestAccount} isBarberDemo={isBarberDemo} />}
    </>
  );
}
