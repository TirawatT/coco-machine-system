"use client";

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
import {
  AlertTriangle,
  BarChart3,
  Eye,
  Factory,
  LayoutDashboard,
  Ruler,
  Settings,
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
    icon: Settings,
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

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <Factory className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-sm font-bold leading-none">COCO</h1>
            <p className="text-xs text-muted-foreground">Machine System</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      item.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(item.href)
                    }
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

        {showAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Admin</SidebarGroupLabel>
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

      <SidebarFooter className="border-t p-4">
        <p className="text-xs text-muted-foreground text-center">
          © 2026 COCO Manufacturing
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
