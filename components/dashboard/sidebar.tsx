"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MessageCircle,
  MapPin,
  Users,
  UserCheck,
  Calendar,
  Settings,
  LogOut,
  Scissors,
  X,
} from "lucide-react";
import Image from "next/image";
import bro2broLogo from "@/brand_assets/Bro2Bro logo.png";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const navItems = [
  { label: "Overview",      href: "/dashboard",              icon: LayoutDashboard },
  { label: "AI Chat",       href: "/dashboard/chat",         icon: MessageCircle },
  { label: "Find Resources",href: "/dashboard/resources",    icon: MapPin },
  { label: "Community",     href: "/dashboard/community",    icon: Users },
  { label: "Mentors",       href: "/dashboard/mentors",      icon: UserCheck },
  { label: "Appointments",  href: "/dashboard/appointments", icon: Calendar },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  role?: string;
  userName?: string;
}

export function Sidebar({ open, onClose, role = "Men's Health", userName = "Marcus J." }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {open !== undefined && (
        <div
          className={cn(
            "fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-200",
            open ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-100 z-50 flex flex-col",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          open === false ? "-translate-x-full" : "translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2.5">
            <Image src={bro2broLogo} alt="BRO2BRO" height={32} className="h-8 w-auto" />
            <span className="text-base font-black tracking-widest text-gray-900 uppercase">BRO2BRO</span>
          </Link>
          {onClose && (
            <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-gray-100">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Role badge */}
        <div className="px-6 py-3 border-b border-gray-50">
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700 bg-amber-50 rounded-full px-3 py-1">
            <Scissors className="h-3 w-3" />
            {role}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                  active
                    ? "bg-black text-white"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
              >
                <Icon
                  className={cn(
                    "h-4 w-4 shrink-0",
                    active ? "text-amber-400" : "text-gray-400"
                  )}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Settings */}
        <div className="px-3 pb-2">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-all duration-150"
          >
            <Settings className="h-4 w-4 text-gray-400" />
            Settings
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar name={userName} size="sm" online />
            <div>
              <div className="text-sm font-semibold text-gray-900 leading-none">{userName}</div>
              <div className="text-xs text-gray-400 mt-0.5">{role}</div>
            </div>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors group">
            <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </aside>
    </>
  );
}
