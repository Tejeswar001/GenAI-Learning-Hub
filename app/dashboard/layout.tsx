import type React from "react";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import DashboardSidebar from "@/components/dashboard/dashboard-sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a server component, so we need to check auth status from cookies
  const authCookie = cookies().get("firebase-auth-token");

  // If no auth cookie is found, redirect to sign in
  if (!authCookie) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="flex min-h-screen">
      <div className="fixed left-0 h-screen">
        <DashboardSidebar />
      </div>
      <div className="flex-1 ml-[var(--sidebar-width)] flex justify-center">
        <div className="w-full max-w-6xl p-6 md:p-8">{children}</div>
      </div>
    </div>
  );
}
