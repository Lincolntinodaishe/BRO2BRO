"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Activity, Share2,
  Award, Settings, LogOut, Scissors, X, ChevronLeft, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import bro2broLogo from "@/brand_assets/Bro2Bro logo.png";
import { cn } from "@/lib/utils";
import { Avatar } from "@/components/ui/avatar";

const navItems = [
  { label: "Overview",    href: "/dashboard/barber",             icon: LayoutDashboard },
  { label: "Clients",     href: "/dashboard/barber/clients",     icon: Users           },
  { label: "Screenings",  href: "/dashboard/barber/screenings",  icon: Activity        },
  { label: "Referrals",   href: "/dashboard/barber/referrals",   icon: Share2          },
  { label: "Training",    href: "/dashboard/barber/training",    icon: Award           },
];

interface BarberSidebarProps {
  open?: boolean;
  onClose?: () => void;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  shopName?: string;
  userName?: string;
  onSignOut?: () => void;
}

function Tooltip({ label, collapsed }: { label: string; collapsed: boolean }) {
  if (!collapsed) return null;
  return (
    <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/navitem:opacity-100 transition-opacity pointer-events-none z-[200] shadow-lg">
      {label}
      <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-gray-900" />
    </div>
  );
}

export function BarberSidebar({
  open,
  onClose,
  collapsed = false,
  onToggleCollapse,
  shopName = "Joe's Classic Cuts",
  userName = "Marcus J.",
  onSignOut,
}: BarberSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-200",
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-white border-r border-gray-100 z-50 flex flex-col",
          "transition-all duration-300 ease-in-out",
          collapsed ? "lg:w-[68px]" : "lg:w-64",
          "w-64",
          open === false ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
        )}
      >
        {/* Header */}
        <div className="h-16 border-b border-gray-100 flex items-center shrink-0 px-3 gap-2">
          <Link href="/dashboard/barber" className={cn("flex items-center gap-2.5 flex-1 min-w-0", collapsed && "justify-center")}>
            <div className="relative shrink-0">
              <Image src={bro2broLogo} alt="BRO2BRO" height={28} className="h-7 w-auto shrink-0" />
              {/* Barber indicator dot */}
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white" />
            </div>
            <div className={cn(
              "overflow-hidden transition-all duration-200",
              collapsed ? "max-w-0 opacity-0 w-0" : "max-w-[140px] opacity-100"
            )}>
              <span className="text-xs font-black tracking-widest text-gray-900 uppercase block truncate">BRO2BRO</span>
              <span className="text-[10px] text-amber-600 font-semibold tracking-wide block">Barber Portal</span>
            </div>
          </Link>

          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="hidden lg:flex shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              title={collapsed ? "Expand" : "Collapse"}
            >
              {collapsed
                ? <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                : <ChevronLeft  className="h-3.5 w-3.5 text-gray-400" />}
            </button>
          )}
          {onClose && (
            <button onClick={onClose} className="lg:hidden shrink-0 p-1.5 rounded-lg hover:bg-gray-100">
              <X className="h-4 w-4 text-gray-500" />
            </button>
          )}
        </div>

        {/* Shop info strip */}
        {!collapsed && (
          <div className="mx-3 mt-3 mb-1 px-3 py-2.5 bg-amber-50 border border-amber-100 rounded-xl flex items-center gap-2.5">
            <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center shrink-0">
              <Scissors className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-gray-900 truncate">{shopName}</p>
              <p className="text-[10px] text-amber-700">CHW Partner Shop</p>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ label, href, icon: Icon }) => {
            const active = pathname === href || (href !== "/dashboard/barber" && pathname.startsWith(href));
            return (
              <div key={href} className="relative group/navitem">
                <Link
                  href={href}
                  onClick={onClose}
                  className={cn(
                    "flex items-center rounded-xl text-sm font-medium transition-all duration-150",
                    collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2.5 w-full",
                    active ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", active ? "text-amber-400" : "text-gray-400")} />
                  <span className={cn(
                    "overflow-hidden whitespace-nowrap transition-all duration-200",
                    collapsed ? "max-w-0 opacity-0 w-0" : "max-w-xs opacity-100"
                  )}>
                    {label}
                  </span>
                </Link>
                <Tooltip label={label} collapsed={collapsed} />
              </div>
            );
          })}
        </nav>

        {/* Settings */}
        <div className={cn("px-2 pb-2", collapsed && "flex justify-center")}>
          <div className="relative group/navitem">
            <Link
              href="/dashboard/barber/settings"
              className={cn(
                "flex items-center rounded-xl text-sm font-medium transition-all duration-150",
                collapsed ? "justify-center w-10 h-10 mx-auto" : "gap-3 px-3 py-2.5 w-full",
                pathname === "/dashboard/barber/settings" ? "bg-black text-white" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}
            >
              <Settings className={cn("h-4 w-4 shrink-0", pathname === "/dashboard/barber/settings" ? "text-amber-400" : "text-gray-400")} />
              <span className={cn(
                "overflow-hidden whitespace-nowrap transition-all duration-200",
                collapsed ? "max-w-0 opacity-0 w-0" : "max-w-xs opacity-100"
              )}>
                Settings
              </span>
            </Link>
            <Tooltip label="Settings" collapsed={collapsed} />
          </div>
        </div>

        {/* Profile */}
        <div className="border-t border-gray-100 shrink-0">
          {collapsed ? (
            <div className="flex justify-center py-3">
              <div className="relative group/navitem">
                <Avatar name={userName} size="sm" online />
                <Tooltip label={`${userName} · ${shopName}`} collapsed={collapsed} />
              </div>
            </div>
          ) : (
            <div className="px-4 py-4 flex items-center gap-3">
              <Avatar name={userName} size="sm" online />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 leading-none truncate">{userName}</div>
                <div className="text-xs text-amber-600 mt-0.5 flex items-center gap-1">
                  <Scissors className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">Licensed Barber · CHW</span>
                </div>
              </div>
              <button onClick={onSignOut} className="shrink-0 p-1.5 rounded-lg hover:bg-gray-100 transition-colors group" title="Sign out">
                <LogOut className="h-4 w-4 text-gray-400 group-hover:text-red-500 transition-colors" />
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
