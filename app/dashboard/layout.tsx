import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "@/components/dashboard/dashboard-layout-client";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const authCookie = cookies().get("firebase-auth-token");
  if (!authCookie) redirect("/auth/sign-in");

  return <DashboardLayoutClient>{children}</DashboardLayoutClient>;
}
