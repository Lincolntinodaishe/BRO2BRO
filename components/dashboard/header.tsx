"use client";
import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell, Menu, Search, Settings, LogOut, User, ChevronRight, X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-context";
import { DEMO_NOTIFICATIONS } from "@/lib/demo-data";
import {
  filterSearchItems,
  getDashboardSearchItems,
  getSettingsPath,
  type DashboardSearchItem,
} from "@/lib/dashboard-search";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  userName?: string;
  onSignOut?: () => void;
}

const notifications: typeof DEMO_NOTIFICATIONS = [];

const TYPE_COLORS: Record<string, string> = {
  Page:        "text-gray-400",
  Action:      "text-amber-600",
  Appointment: "text-blue-600",
  Mentor:      "text-teal-600",
};

function SearchPalette({
  onClose,
  items,
}: {
  onClose: () => void;
  items: DashboardSearchItem[];
}) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => filterSearchItems(items, query), [items, query]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    setFocused(0);
  }, [query]);

  function go(href: string) {
    router.push(href);
    onClose();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") { onClose(); return; }
    if (filtered.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setFocused((p) => Math.min(p + 1, filtered.length - 1)); }
    if (e.key === "ArrowUp")   { e.preventDefault(); setFocused((p) => Math.max(p - 1, 0)); }
    if (e.key === "Enter" && filtered[focused]) go(filtered[focused].href);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center bg-black/50 sm:px-4 sm:pt-[10vh]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className={cn(
          "bg-white flex flex-col w-full shadow-2xl overflow-hidden",
          "h-full sm:h-auto sm:max-h-[min(70vh,520px)] sm:max-w-lg sm:rounded-2xl"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-3 sm:py-3.5 border-b border-gray-100 shrink-0">
          <Search className="h-4 w-4 text-gray-400 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Search pages, actions…"
            className="flex-1 text-sm outline-none text-gray-900 placeholder:text-gray-400 min-w-0"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 sm:hidden"
            aria-label="Close search"
          >
            <X className="h-4 w-4" />
          </button>
          <kbd className="hidden sm:inline text-[10px] text-gray-300 font-mono border border-gray-200 rounded px-1.5 py-0.5 shrink-0">ESC</kbd>
        </div>

        <div className="flex-1 overflow-y-auto py-1.5 min-h-0 overscroll-contain">
          {filtered.length === 0 ? (
            <p className="px-4 py-8 text-sm text-gray-400 text-center">
              {query.trim() ? `No results for "${query}"` : "No items to show"}
            </p>
          ) : (
            filtered.map((entry, i) => {
              const Icon = entry.icon;
              return (
                <button
                  key={entry.id}
                  type="button"
                  onClick={() => go(entry.href)}
                  onMouseEnter={() => setFocused(i)}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-3 sm:py-2.5 transition-colors text-left",
                    focused === i ? "bg-gray-50" : "hover:bg-gray-50"
                  )}
                >
                  <div className="w-8 h-8 sm:w-7 sm:h-7 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
                    <Icon className="h-4 w-4 sm:h-3.5 sm:w-3.5 text-gray-500" />
                  </div>
                  <span className="flex-1 text-sm text-gray-800 min-w-0 truncate">{entry.label}</span>
                  <span className={cn("text-xs font-medium shrink-0 hidden sm:inline", TYPE_COLORS[entry.type] ?? "text-gray-400")}>
                    {entry.type}
                  </span>
                  <ChevronRight className="h-3.5 w-3.5 text-gray-300 shrink-0" />
                </button>
              );
            })
          )}
        </div>

        <div className="hidden sm:flex px-4 py-2.5 border-t border-gray-50 gap-4 text-[11px] text-gray-400 shrink-0">
          <span><kbd className="font-mono border border-gray-200 rounded px-1">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono border border-gray-200 rounded px-1">↵</kbd> open</span>
          <span><kbd className="font-mono border border-gray-200 rounded px-1">ESC</kbd> close</span>
        </div>
      </div>
    </div>
  );
}

export function Header({ title = "Dashboard", onMenuClick, userName = "Marcus J.", onSignOut }: HeaderProps) {
  const { isTestAccount, isBarberDemo, isMentorDemo, userRole } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications_, setNotifications] = useState(isTestAccount ? DEMO_NOTIFICATIONS : notifications);
  const unreadCount = notifications_.filter((n) => n.unread).length;

  const searchItems = useMemo(
    () => getDashboardSearchItems({ isTestAccount, isBarberDemo, isMentorDemo }),
    [isTestAccount, isBarberDemo, isMentorDemo]
  );

  const settingsPath = getSettingsPath({ isBarberDemo, isMentorDemo, userRole });

  useEffect(() => {
    setNotifications(isTestAccount ? DEMO_NOTIFICATIONS : []);
  }, [isTestAccount]);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
        setNotifOpen(false);
        setProfileOpen(false);
      }
      if (e.key === "Escape") setSearchOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) {
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = ""; };
    }
  }, [searchOpen]);

  useEffect(() => {
    function handler(e: MouseEvent) {
      const t = e.target as HTMLElement;
      if (!t.closest("[data-notif]")) setNotifOpen(false);
      if (!t.closest("[data-profile]")) setProfileOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  function openSearch() {
    setSearchOpen(true);
    setNotifOpen(false);
    setProfileOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-100 px-3 sm:px-5 flex items-center h-14 sm:h-16 gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-1 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5 text-gray-600" />
        </button>

        <h1 className="text-sm font-semibold text-gray-900 flex-1 min-w-0 truncate sm:max-w-none">
          {title}
        </h1>

        <div className="flex items-center gap-0.5 sm:gap-1.5 shrink-0">
          {/* Mobile: icon only */}
          <button
            type="button"
            onClick={openSearch}
            className="sm:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5 text-gray-600" />
          </button>

          {/* Desktop: search trigger */}
          <button
            type="button"
            onClick={openSearch}
            className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-400 hover:border-gray-300 hover:text-gray-500 transition-colors max-w-[200px] lg:max-w-xs"
          >
            <Search className="h-4 w-4 shrink-0" />
            <span className="text-xs truncate">Search…</span>
            <kbd className="hidden lg:inline-flex items-center text-[11px] text-gray-300 font-mono ml-auto shrink-0">⌘K</kbd>
          </button>

          <div className="relative" data-notif>
            <button
              type="button"
              onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}
              className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-amber-500 rounded-full" />
              )}
            </button>

            {notifOpen && (
              <div className="absolute right-0 mt-2 w-[min(calc(100vw-1.5rem),20rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-fade-in">
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
                      type="button"
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

          <div className="relative pl-0.5" data-profile>
            <button
              type="button"
              onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}
              className="rounded-full ring-2 ring-transparent hover:ring-gray-200 transition-all"
              aria-label="Profile menu"
            >
              <Avatar name={userName} size="sm" online />
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-2 w-[min(calc(100vw-1.5rem),14rem)] bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 animate-fade-in overflow-hidden">
                <div className="px-4 py-3.5 border-b border-gray-50 flex items-center gap-3">
                  <Avatar name={userName} size="sm" online />
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-gray-900 truncate">{userName}</div>
                    <div className="text-xs text-gray-400 truncate">BRO2BRO</div>
                  </div>
                </div>

                <div className="py-1.5">
                  <Link
                    href={settingsPath}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <User className="h-4 w-4 text-gray-400 shrink-0" />
                    View Profile
                  </Link>
                  <Link
                    href={settingsPath}
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Settings className="h-4 w-4 text-gray-400 shrink-0" />
                    Settings
                  </Link>
                </div>

                <div className="border-t border-gray-50 py-1.5">
                  <button
                    type="button"
                    onClick={onSignOut}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="h-4 w-4 shrink-0" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {searchOpen && (
        <SearchPalette onClose={() => setSearchOpen(false)} items={searchItems} />
      )}
    </>
  );
}
