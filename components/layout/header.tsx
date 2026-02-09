"use client";

import { RoleBadge, RoleSwitcher } from "@/components/layout/role-switcher";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Bell } from "lucide-react";
import { useEffect, useState } from "react";

export function Header() {
  const { currentUser } = useAuth();
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
    };
    update();
    const interval = setInterval(update, 60_000);
    return () => clearInterval(interval);
  }, []);

  const initials = currentUser.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="flex h-14 items-center gap-4 border-b border-border/50 bg-background/80 backdrop-blur-sm px-4 lg:px-6">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-5" />

      {/* Live time */}
      {time && (
        <span className="hidden sm:inline text-xs font-mono text-muted-foreground tabular-nums">
          {time}
        </span>
      )}

      <div className="flex-1" />

      {/* Dev role switcher — pushed to subtle position */}
      <RoleSwitcher />

      <Separator orientation="vertical" className="h-5" />

      {/* Notification bell (visual only) */}
      <button className="relative flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent transition-colors">
        <Bell className="h-4 w-4 text-muted-foreground" />
        <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
      </button>

      {/* User profile */}
      <div className="flex items-center gap-2.5">
        <div className="text-right hidden sm:block">
          <p className="text-xs font-medium leading-none">{currentUser.name}</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {currentUser.email}
          </p>
        </div>
        <Avatar className="h-8 w-8 border border-border/50">
          <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
            {initials}
          </AvatarFallback>
        </Avatar>
        <RoleBadge />
      </div>
    </header>
  );
}
