"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getAlerts,
  getDashboardStats,
  getProductionChartData,
  mockMachines,
} from "@/lib/mock-data";
import { MachineStatus } from "@/types";
import { AlertTriangle, Cpu, Factory, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const statusColors: Record<MachineStatus, string> = {
  [MachineStatus.RUNNING]: "bg-green-500",
  [MachineStatus.IDLE]: "bg-yellow-500",
  [MachineStatus.STOPPED]: "bg-red-500",
  [MachineStatus.MAINTENANCE]: "bg-orange-500",
};

const statusBgColors: Record<MachineStatus, string> = {
  [MachineStatus.RUNNING]:
    "bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800",
  [MachineStatus.IDLE]:
    "bg-yellow-50 border-yellow-200 dark:bg-yellow-950 dark:border-yellow-800",
  [MachineStatus.STOPPED]:
    "bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800",
  [MachineStatus.MAINTENANCE]:
    "bg-orange-50 border-orange-200 dark:bg-orange-950 dark:border-orange-800",
};

export default function DashboardPage() {
  const stats = getDashboardStats();
  const alerts = getAlerts();
  const chartData = getProductionChartData();

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Manufacturing overview — real-time machine status and production
          metrics
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Lines</CardTitle>
            <Factory className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalLines}</div>
            <p className="text-xs text-muted-foreground">
              Active production lines
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Machines
            </CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMachines}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">
                {stats.runningMachines} running
              </span>
              {" · "}
              <span className="text-yellow-600">{stats.idleMachines} idle</span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average yieldRate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageYield}%</div>
            <p className="text-xs text-muted-foreground">
              Last 7 days production yieldRate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Downtime
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.activeDowntimes}
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.stoppedMachines} stopped · {stats.maintenanceMachines}{" "}
              maintenance
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Production Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Production yieldRate — Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => v.slice(5)} // MM-DD
                    className="text-xs"
                  />
                  <YAxis domain={[80, 100]} className="text-xs" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="yieldRate"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.2}
                    name="yieldRate %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {alerts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No active alerts
                </p>
              ) : (
                alerts.slice(0, 8).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start gap-2 text-sm border-b pb-2 last:border-0"
                  >
                    <span
                      className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${
                        alert.type === "error"
                          ? "bg-red-500"
                          : alert.type === "warning"
                            ? "bg-yellow-500"
                            : "bg-blue-500"
                      }`}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-xs">{alert.title}</p>
                      <p className="text-xs text-muted-foreground truncate">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Machine Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Machine Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {mockMachines.map((machine) => (
              <div
                key={machine.id}
                className={`rounded-lg border p-3 ${statusBgColors[machine.status]}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${statusColors[machine.status]} ${
                      machine.status === MachineStatus.RUNNING
                        ? "animate-pulse"
                        : ""
                    }`}
                  />
                  <span className="text-xs font-medium truncate">
                    {machine.name}
                  </span>
                </div>
                <p className="text-[10px] text-muted-foreground">
                  {machine.lineName}
                </p>
                <Badge
                  variant="outline"
                  className="mt-1 text-[10px] px-1.5 py-0"
                >
                  {machine.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
