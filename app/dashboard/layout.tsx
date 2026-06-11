"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const pageTitles: Record<string, string> = {
  "/dashboard":              "Overview",
  "/dashboard/chat":         "AI Wellness Chat",
  "/dashboard/resources":    "Find Resources",
  "/dashboard/community":    "Community Forum",
  "/dashboard/mentors":      "Mentors",
  "/dashboard/appointments": "Appointments",
  "/dashboard/settings":     "Settings",
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen]           = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const router   = useRouter();
  const { user, loading, displayName, signOut, isBarberDemo, isMentorDemo, userRole } = useAuth();

  const isBarberRoute = pathname.startsWith("/dashboard/barber");
  const isMentorRoute = pathname.startsWith("/dashboard/mentor");
  const isPortalRoute = isBarberRoute || isMentorRoute;

  // Redirect to login if not authenticated (fallback after middleware)
  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  // Keep role-specific users in their portal
  useEffect(() => {
    if (!loading && user && !isPortalRoute) {
      if (isBarberDemo || userRole === "barber") {
        router.replace("/dashboard/barber");
      } else if (isMentorDemo || userRole === "mentor") {
        router.replace("/dashboard/mentor");
      }
    }
  }, [user, loading, isBarberDemo, isMentorDemo, userRole, isPortalRoute, router]);

  // Barber & mentor routes use their own layout shell
  if (isPortalRoute) {
    return <>{children}</>;
  }

  const title = pageTitles[pathname] ?? "Dashboard";

  // Loading screen while Firebase resolves auth state
  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 border-2 border-gray-200 border-t-black rounded-full animate-spin" />
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        userName={displayName}
        onSignOut={signOut}
      />

      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-64"
        )}
      >
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          userName={displayName}
          onSignOut={signOut}
        />
        <main className="flex-1 min-h-0 p-3 sm:p-6 lg:p-8 flex flex-col overflow-x-hidden">
          <div
            className={cn(
              "max-w-7xl mx-auto w-full",
              pathname === "/dashboard/chat" ? "flex flex-col flex-1 min-h-0" : ""
            )}
          >
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
