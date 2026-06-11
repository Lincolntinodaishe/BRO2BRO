"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { BarberSidebar } from "@/components/dashboard/barber-sidebar";
import { Header } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { canAccessBarberPortal } from "@/lib/auth-routes";
import { BarberDataProvider } from "@/lib/barber-data-context";

const pageTitles: Record<string, string> = {
  "/dashboard/barber":            "Shop Overview",
  "/dashboard/barber/clients":    "Clients",
  "/dashboard/barber/screenings": "Health Screenings",
  "/dashboard/barber/referrals":  "Referrals",
  "/dashboard/barber/training":   "Training & Certification",
  "/dashboard/barber/events":     "Events",
  "/dashboard/barber/settings":   "Settings",
};

export default function BarberLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen]           = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, loading, displayName, shopName, signOut, userRole } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (!loading && user && !canAccessBarberPortal(user.email, userRole)) {
      router.replace("/dashboard");
    }
  }, [user, loading, userRole, router]);

  const title = pageTitles[pathname] ?? "Barber Portal";

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

  if (!canAccessBarberPortal(user.email, userRole)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BarberSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
        shopName={shopName || "Your Shop"}
        userName={displayName}
        onSignOut={signOut}
      />
      <div className={cn(
        "flex flex-col min-h-screen transition-all duration-300",
        sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-64"
      )}>
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
          userName={displayName}
          onSignOut={signOut}
        />
        <main className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 flex flex-col">
          <div className="max-w-7xl mx-auto w-full">
            <BarberDataProvider>
              {children}
            </BarberDataProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
