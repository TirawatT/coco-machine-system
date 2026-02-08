"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLine } from "@/hooks/use-lines";
import { useMachines } from "@/hooks/use-machines";
import { MachineStatus } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";
import { use } from "react";

const statusColors: Record<MachineStatus, string> = {
  [MachineStatus.RUNNING]: "bg-green-500",
  [MachineStatus.IDLE]: "bg-yellow-500",
  [MachineStatus.STOPPED]: "bg-red-500",
  [MachineStatus.MAINTENANCE]: "bg-orange-500",
};

const statusBadgeVariants: Record<MachineStatus, string> = {
  [MachineStatus.RUNNING]:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  [MachineStatus.IDLE]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  [MachineStatus.STOPPED]:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  [MachineStatus.MAINTENANCE]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
};

export default function LineDetailPage({
  params,
}: {
  params: Promise<{ lineId: string }>;
}) {
  const { lineId } = use(params);
  const { data: line } = useLine(lineId);
  const { data: machines } = useMachines(lineId);

  if (!line) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Line not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/lines">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{line.name}</h1>
          <p className="text-muted-foreground">{line.description}</p>
        </div>
      </div>

      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Machines</p>
            <p className="text-2xl font-bold">{machines.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Running</p>
            <p className="text-2xl font-bold text-green-600">
              {
                machines.filter((m) => m.status === MachineStatus.RUNNING)
                  .length
              }
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Idle</p>
            <p className="text-2xl font-bold text-yellow-600">
              {machines.filter((m) => m.status === MachineStatus.IDLE).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Down</p>
            <p className="text-2xl font-bold text-red-600">
              {
                machines.filter(
                  (m) =>
                    m.status === MachineStatus.STOPPED ||
                    m.status === MachineStatus.MAINTENANCE,
                ).length
              }
            </p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-lg font-semibold mb-4">Machines</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {machines.map((machine) => (
            <Link
              key={machine.id}
              href={`/lines/${lineId}/machines/${machine.id}`}
            >
              <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-3 w-3 rounded-full ${statusColors[machine.status]} ${
                          machine.status === MachineStatus.RUNNING
                            ? "animate-pulse"
                            : ""
                        }`}
                      />
                      <div>
                        <p className="font-medium">{machine.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {machine.model} · {machine.serialNumber}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className={statusBadgeVariants[machine.status]}
                      >
                        {machine.status}
                      </Badge>
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
