"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-provider";
import {
  BookOpen,
  Home,
  LogOut,
  MessageSquare,
  User,
  Video,
} from "lucide-react";

export default function DashboardSidebar({
  collapsed = false,
}: {
  collapsed?: boolean;
}) {
  const pathname = usePathname();
  const { signOut } = useAuth();

  const routes = [
    {
      name: "Overview",
      href: "/dashboard",
      icon: <Home className="h-5 w-5" />,
    },
    {
      name: "Profile",
      href: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
    {
      name: "Chat History",
      href: "/dashboard/chat-history",
      icon: <MessageSquare className="h-5 w-5" />,
    },
    {
      name: "Saved Videos",
      href: "/dashboard/saved-videos",
      icon: <Video className="h-5 w-5" />,
    },
    {
      name: "My Courses",
      href: "/dashboard/courses",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];

  return (
    <SidebarProvider>
      <Sidebar className="transition-all duration-300">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-4 py-4">
            {!collapsed && (
              <span className="font-semibold text-lg">Dashboard</span>
            )}
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {routes.map((route) => (
              <SidebarMenuItem key={route.href}>
                <SidebarMenuButton asChild isActive={pathname === route.href}>
                  <Link href={route.href} className="flex items-center gap-3">
                    {route.icon}
                    {!collapsed && <span>{route.name}</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <Button
            variant="ghost"
            className="w-full justify-start px-4 py-2"
            onClick={() => signOut()}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {!collapsed && "Log out"}
          </Button>
        </SidebarFooter>
      </Sidebar>
    </SidebarProvider>
  );
}
