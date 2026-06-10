"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { cn } from "@/lib/utils";

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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((p) => !p)}
      />

      {/* Main content — offset by sidebar width */}
      <div
        className={cn(
          "flex flex-col min-h-screen transition-all duration-300",
          sidebarCollapsed ? "lg:ml-[68px]" : "lg:ml-64"
        )}
      >
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 min-h-0 p-4 sm:p-6 lg:p-8 flex flex-col">
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
