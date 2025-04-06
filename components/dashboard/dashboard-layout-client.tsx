"use client";

import { useState } from "react";
import DashboardSidebar from "./dashboard-sidebar";

export default function DashboardLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false); // optional now

  return (
    <div className="flex min-h-screen relative">
      {/* Sidebar for desktop */}
      <div className="hidden md:block fixed h-full w-64 bg-white shadow-md z-40">
        <DashboardSidebar />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full md:ml-64">
        <div className="w-full max-w-6xl px-4 pt-4 pb-8 md:px-8 md:pt-8 md:pb-10 md:mx-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
