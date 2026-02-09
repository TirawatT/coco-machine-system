"use client";

import { Badge } from "@/components/ui/badge";
import type { Machine } from "@/types";
import { MachineStatus } from "@/types";
import Link from "next/link";

interface MachineStatusGridProps {
  machines: Machine[];
}

const statusConfig: Record<
  MachineStatus,
  { dot: string; glow: string; bg: string; label: string; badge: string }
> = {
  [MachineStatus.RUNNING]: {
    dot: "bg-emerald-400",
    glow: "glow-green",
    bg: "border-emerald-500/20 bg-emerald-500/5",
    label: "Running",
    badge: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10",
  },
  [MachineStatus.IDLE]: {
    dot: "bg-yellow-400",
    glow: "glow-yellow",
    bg: "border-yellow-500/20 bg-yellow-500/5",
    label: "Idle",
    badge: "border-yellow-500/30 text-yellow-400 bg-yellow-500/10",
  },
  [MachineStatus.STOPPED]: {
    dot: "bg-red-400",
    glow: "glow-red",
    bg: "border-red-500/20 bg-red-500/5",
    label: "Stopped",
    badge: "border-red-500/30 text-red-400 bg-red-500/10",
  },
  [MachineStatus.MAINTENANCE]: {
    dot: "bg-orange-400",
    glow: "glow-orange",
    bg: "border-orange-500/20 bg-orange-500/5",
    label: "Maintenance",
    badge: "border-orange-500/30 text-orange-400 bg-orange-500/10",
  },
};

export function MachineStatusGrid({ machines }: MachineStatusGridProps) {
  // Group by line
  const grouped = machines.reduce(
    (acc, machine) => {
      const line = machine.lineName || "Unknown";
      if (!acc[line]) acc[line] = [];
      acc[line].push(machine);
      return acc;
    },
    {} as Record<string, Machine[]>,
  );

  return (
    <div className="space-y-5">
      {Object.entries(grouped).map(([lineName, lineMachines]) => (
        <div key={lineName}>
          <div className="flex items-center gap-2 mb-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {lineName}
            </h4>
            <div className="flex-1 h-px bg-border/50" />
            <span className="text-[10px] text-muted-foreground">
              {
                lineMachines.filter((m) => m.status === MachineStatus.RUNNING)
                  .length
              }
              /{lineMachines.length} running
            </span>
          </div>
          <div className="grid gap-2.5 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {lineMachines.map((machine) => {
              const config = statusConfig[machine.status];
              return (
                <Link
                  key={machine.id}
                  href={`/lines/${machine.lineId}/machines/${machine.id}`}
                  className={`group relative rounded-lg border p-3 transition-all hover:scale-[1.03] hover:shadow-lg ${config.bg}`}
                >
                  {/* Status indicator */}
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`h-2 w-2 rounded-full ${config.dot} ${
                        machine.status === MachineStatus.RUNNING
                          ? "animate-pulse"
                          : ""
                      }`}
                    />
                    <span className="text-xs font-semibold truncate group-hover:text-primary transition-colors">
                      {machine.name}
                    </span>
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2 truncate">
                    {machine.model}
                  </p>
                  <Badge
                    variant="outline"
                    className={`text-[9px] px-1.5 py-0 ${config.badge}`}
                  >
                    {config.label}
                  </Badge>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
