"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

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
  const pathname = usePathname();
  const title = pageTitles[pathname] ?? "Dashboard";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        <Header
          title={title}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
