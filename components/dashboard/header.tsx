"use client";
import { useState } from "react";
import { Bell, Menu, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface HeaderProps {
  title?: string;
  onMenuClick?: () => void;
  userName?: string;
}

const notifications = [
  { id: 1, text: "Your appointment tomorrow at 2pm is confirmed", time: "5m ago", unread: true },
  { id: 2, text: "Marcus from your crew completed his check-in 🎉", time: "1h ago", unread: true },
  { id: 3, text: "New resource added near 72201 — Community Health Clinic", time: "3h ago", unread: false },
];

export function Header({ title = "Dashboard", onMenuClick, userName = "Marcus J." }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 sm:px-6 py-3.5 flex items-center gap-4">
      {/* Mobile menu button */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Menu className="h-5 w-5 text-gray-600" />
      </button>

      {/* Title */}
      <h1 className="text-base font-semibold text-gray-900 flex-1 hidden sm:block">{title}</h1>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Search (desktop) */}
        <button className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-200 text-sm text-gray-400 hover:border-gray-300 transition-colors">
          <Search className="h-4 w-4" />
          <span className="hidden md:block">Search…</span>
          <kbd className="hidden md:inline-flex items-center text-xs text-gray-300 font-mono ml-6">⌘K</kbd>
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <Bell className="h-5 w-5 text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-amber-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-float border border-gray-100 z-50 animate-fade-in">
              <div className="px-4 py-3 border-b border-gray-50 flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-900">Notifications</span>
                {unreadCount > 0 && (
                  <Badge variant="gold" size="sm">{unreadCount} new</Badge>
                )}
              </div>
              <div className="divide-y divide-gray-50 max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={cn(
                      "px-4 py-3 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer",
                      n.unread && "bg-amber-50/40"
                    )}
                  >
                    <div className={cn("mt-1 h-2 w-2 rounded-full shrink-0", n.unread ? "bg-amber-500" : "bg-gray-200")} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-800 leading-relaxed">{n.text}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="px-4 py-3 border-t border-gray-50">
                <button className="text-xs text-gray-500 hover:text-black transition-colors">
                  Mark all as read
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="pl-1">
          <Avatar name={userName} size="sm" online className="cursor-pointer" />
        </div>
      </div>
    </header>
  );
}
