"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, MessageCircle, MapPin, Users, UserCheck,
  Calendar, Settings, LogOut, Scissors, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import bro2broLogo from "@/brand_assets/Bro2Bro logo.png";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const navItems = [
  { label: "Overview",       href: "/dashboard",              icon: LayoutDashboard },
  { label: "Bro.AI",        href: "/dashboard/chat",         icon: MessageCircle },
  { label: "Find Resources", href: "/dashboard/resources",    icon: MapPin },
  { label: "Community",      href: "/dashboard/community",    icon: Users },
  { label: "Mentors",        href: "/dashboard/mentors",      icon: UserCheck },
  { label: "Appointments",   href: "/dashboard/appointments", icon: Calendar },
];

interface SidebarProps {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  role?: string;
  userName?: string;
}

function NavTooltip({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (!collapsed) return null;
  return (
    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/navitem:opacity-100 transition-opacity pointer-events-none z-[200] shadow-lg">
      {label}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
    </div>
  );
}

export function Sidebar({
  open,
  onClose,
  collapsed = false,
  onToggleCollapse,
  role = "Men's Health",
  userName = "Marcus J.",
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-white border-r border-gray-100 z-50 flex flex-col",
          "transition-all duration-300 ease-in-out",
          /* desktop width */
          collapsed ? "lg:w-[68px]" : "lg:w-64",
          /* mobile: always 256px wide, slides in/out */
          "w-64",
          open === false ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}
      >
        {/* ── Logo / Header ───────────────────────────────────── */}
        <div className="h-16 border-b border-gray-100 flex items-center shrink-0 px-3 gap-2">
          <Link href="/" className={cn("flex items-center gap-2.5 flex-1 min-w-0", collapsed && "justify-center")}>
            <Image src={bro2broLogo} alt="BRO2BRO" height={28} className="h-7 w-auto shrink-0" />
            <span
              className={cn(
                "text-sm font-black tracking-widest text-gray-900 uppercase truncate transition-all duration-200 overflow-hidden",
                collapsed ? "max-w-0 opacity-0 w-0" : "max-w-[120px] opacity-100"
              )}
            >
              BRO2BRO
            </span>
          </Link>

          {/* Desktop collapse toggle */}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed
                ? <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                : <ChevronLeft  className="h-3.5 w-3.5 text-gray-400" />
              }
            </button>
          )}

          {/* Mobile close */}
          {onClose && (
            <button onClick={onClose} className="lg:hidden shrink-0 p-1.5 rounded-lg hover:bg-gray-100">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* ── Nav items ────────────────────────────────────────── */}
        <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href;
            return (
              <div key={href} className="relative group/navitem">
                <Link
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center rounded-xl text-sm font-medium transition-all duration-150",
                    collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2.5 w-full",
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
                  <span
                    className={cn(
                      "overflow-hidden whitespace-nowrap transition-all duration-200",
                      collapsed ? "max-w-0 opacity-0 w-0" : "max-w-xs opacity-100"
                    )}
                  >
                    {label}
                  </span>
                </Link>
                <NavTooltip label={label} collapsed={collapsed} />
              </div>
            );
          })}
        </nav>

        {/* ── Settings ────────────────────────────────────────── */}
        <div className={cn("px-2 pb-2", collapsed && "flex justify-center")}>
          <div className="relative group/navitem">
            <Link
              href="/dashboard/settings"
              onClick={onClose}
              className={cn(
                "flex items-center rounded-xl text-sm font-medium transition-all duration-150",
                collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2.5 w-full",
                pathname === "/dashboard/settings"
                  ? "bg-black text-white"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Settings
                className={cn(
                  "h-4 w-4 shrink-0",
                  pathname === "/dashboard/settings" ? "text-amber-400" : "text-gray-400"
                )}
              />
              <span
                className={cn(
                  "overflow-hidden whitespace-nowrap transition-all duration-200",
                  collapsed ? "max-w-0 opacity-0 w-0" : "max-w-xs opacity-100"
                )}
              >
                Settings
              </span>
            </Link>
            <NavTooltip label="Settings" collapsed={collapsed} />
          </div>
        </div>

        {/* ── Profile (bottom) ─────────────────────────────────── */}
        <div className="border-t border-gray-100 shrink-0">
          {collapsed ? (
            <div className="flex justify-center py-3">
              <div className="relative group/navitem">
                <Link href="/dashboard/settings">
                  <Avatar name={userName} size="sm" online />
                </Link>
                <NavTooltip label={`${userName} · ${role}`} collapsed={collapsed} />
              </div>
            </div>
          ) : (
            <div className="px-4 py-4 flex items-center gap-3">
              <Avatar name={userName} size="sm" online />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 leading-none truncate">{userName}</div>
                <div className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Scissors className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">{role}</span>
                </div>
              </div>
              <button className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group">
                <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
