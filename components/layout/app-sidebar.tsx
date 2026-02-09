"use client";

import { Badge } from "@/components/ui/badge";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { getDashboardStats } from "@/lib/mock-data";
import {
  AlertTriangle,
  BarChart3,
  Eye,
  Factory,
  LayoutDashboard,
  Ruler,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNavItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Lines",
    href: "/lines",
    icon: Factory,
  },
  {
    title: "Production",
    href: "/production",
    icon: BarChart3,
  },
  {
    title: "Downtime",
    href: "/downtime",
    icon: AlertTriangle,
    showBadge: true,
  },
  {
    title: "Measurement",
    href: "/measurement",
    icon: Ruler,
  },
  {
    title: "3DVista",
    href: "/vista",
    icon: Eye,
  },
];

const adminNavItems = [
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
  },
  {
    title: "Line Management",
    href: "/admin/lines",
    icon: Factory,
  },
  {
    title: "Machine Management",
    href: "/admin/machines",
    icon: Settings,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { hasPermission } = useAuth();
  const showAdmin = hasPermission("manage:users");
  const stats = getDashboardStats();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-5 py-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm transition-transform group-hover:scale-105">
            <Factory className="h-4.5 w-4.5" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-none tracking-tight">
              COCO
            </h1>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Machine System
            </p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-3">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href);

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span className="flex-1">{item.title}</span>
                        {item.showBadge && stats.activeDowntimes > 0 && (
                          <Badge
                            variant="destructive"
                            className="h-5 min-w-5 px-1.5 text-[10px] font-bold justify-center"
                          >
                            {stats.activeDowntimes}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {showAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-[10px] uppercase tracking-widest text-muted-foreground/60 px-3">
              <Shield className="h-3 w-3 mr-1 inline" />
              Administration
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminNavItems.map((item) => (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href)}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border px-5 py-3">
        <div className="flex items-center justify-between">
          <p className="text-[10px] text-muted-foreground/50">
            © 2026 COCO Manufacturing
          </p>
          <p className="text-[10px] text-muted-foreground/30">v1.0</p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
