"use client";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MentorSidebar } from "@/components/dashboard/mentor-sidebar";
import { Header } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";
import { canAccessMentorPortal } from "@/lib/auth-routes";
import { MentorDataProvider } from "@/lib/mentor-data-context";

const pageTitles: Record<string, string> = {
  "/dashboard/mentor":           "Mentor Overview",
  "/dashboard/mentor/mentees":   "Mentees",
  "/dashboard/mentor/sessions":  "Sessions",
  "/dashboard/mentor/messages":    "Messages",
  "/dashboard/mentor/settings":    "Settings",
};

export default function MentorLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen]           = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname  = usePathname();
  const router    = useRouter();
  const { user, loading, displayName, signOut, userRole } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
      return;
    }
    if (!loading && user && !canAccessMentorPortal(user.email, userRole)) {
      router.replace("/dashboard");
    }
  }, [user, loading, userRole, router]);

  const title = pageTitles[pathname] ?? "Mentor Portal";

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

  if (!canAccessMentorPortal(user.email, userRole)) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MentorSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
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
        <main className="flex-1 min-h-0 p-3 sm:p-6 lg:p-8 flex flex-col overflow-x-hidden">
          <div className="max-w-7xl mx-auto w-full">
            <MentorDataProvider>
              {children}
            </MentorDataProvider>
          </div>
        </main>
      </div>
    </div>
  );
}
