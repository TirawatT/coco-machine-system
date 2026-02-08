"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMachine } from "@/hooks/use-machines";
import { useSensors } from "@/hooks/use-sensors";
import { MachineStatus } from "@/types";
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  BarChart3,
  Droplets,
  Eye,
  Gauge,
  Ruler,
  Thermometer,
} from "lucide-react";
import Link from "next/link";
import { use } from "react";

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

const subPages = [
  {
    title: "Production",
    href: "production",
    icon: BarChart3,
    description: "Input/Output/Scrap/yieldRate logs",
  },
  {
    title: "Sensors",
    href: "sensors",
    icon: Activity,
    description: "Real-time sensor data",
  },
  {
    title: "Downtime",
    href: "downtime",
    icon: AlertTriangle,
    description: "Maintenance & downtime records",
  },
  {
    title: "Measurement",
    href: "measurement",
    icon: Ruler,
    description: "Quality inspection data",
  },
  {
    title: "3DVista",
    href: "vista",
    icon: Eye,
    description: "360° virtual tour",
  },
];

export default function MachineOverviewPage({
  params,
}: {
  params: Promise<{ lineId: string; machineId: string }>;
}) {
  const { lineId, machineId } = use(params);
  const { data: machine } = useMachine(machineId);
  const { latest: sensor } = useSensors(machineId);

  if (!machine) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Machine not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/lines/${lineId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">
              {machine.name}
            </h1>
            <Badge
              variant="outline"
              className={statusBadgeVariants[machine.status]}
            >
              {machine.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {machine.model} · {machine.serialNumber} · {machine.lineName}
          </p>
        </div>
      </div>

      {/* Sensor Quick View */}
      {sensor && (
        <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
          <Card>
            <CardContent className="pt-4 flex items-center gap-3">
              <Thermometer className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-xs text-muted-foreground">Temperature</p>
                <p className="text-lg font-bold">{sensor.temperature}°C</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 flex items-center gap-3">
              <Droplets className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-xs text-muted-foreground">Humidity</p>
                <p className="text-lg font-bold">{sensor.humidity}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 flex items-center gap-3">
              <Gauge className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-xs text-muted-foreground">Pressure</p>
                <p className="text-lg font-bold">{sensor.pressure} hPa</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4 flex items-center gap-3">
              <Activity className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Vibration</p>
                <p className="text-lg font-bold">{sensor.vibration} mm/s</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sub Pages */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Machine Details</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {subPages.map((page) => (
            <Link
              key={page.href}
              href={`/lines/${lineId}/machines/${machineId}/${page.href}`}
            >
              <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer h-full">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <page.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{page.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {page.description}
                      </p>
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
