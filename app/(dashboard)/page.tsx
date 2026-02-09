"use client";

import {
  AlertFeed,
  KpiCard,
  LinePerformanceTable,
  MachineStatusGrid,
  MachineUtilizationChart,
  ProductionTrendChart,
} from "@/components/dashboard";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import {
  getAlerts,
  getDashboardStats,
  getLinePerformance,
  getMachineStatusBreakdown,
  getOEE,
  getProductionChartData,
  getScrapRate,
  getTodayProductionSummary,
  getUptimePercentage,
  mockMachines,
} from "@/lib/mock-data";
import {
  Activity,
  AlertTriangle,
  ArrowDownRight,
  BarChart3,
  Boxes,
  Gauge,
  Package,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const { currentUser } = useAuth();
  const stats = getDashboardStats();
  const alerts = getAlerts();
  const chartData = getProductionChartData();
  const oee = getOEE();
  const uptimePercent = getUptimePercentage();
  const scrapRate = getScrapRate();
  const todaySummary = getTodayProductionSummary();
  const linePerformance = getLinePerformance();
  const machineBreakdown = getMachineStatusBreakdown();

  // Avoid hydration mismatch — compute greeting + date on client only
  const [greeting, setGreeting] = useState("Welcome");
  const [dateStr, setDateStr] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    setGreeting(
      hour < 12
        ? "Good morning"
        : hour < 17
          ? "Good afternoon"
          : "Good evening",
    );
    setDateStr(
      new Date().toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    );
  }, []);

  const factoryStatus =
    stats.activeDowntimes === 0
      ? {
          label: "All Systems Normal",
          color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
        }
      : {
          label: `${stats.activeDowntimes} Active Issue${stats.activeDowntimes > 1 ? "s" : ""}`,
          color: "bg-red-500/10 text-red-400 border-red-500/20",
        };

  return (
    <div className="space-y-6">
      {/* ===== Row 1: Welcome Header ===== */}
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {greeting}, {currentUser.name.split(" ")[0]}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manufacturing Intelligence Dashboard
            {dateStr && ` — ${dateStr}`}
          </p>
        </div>
        <Badge
          variant="outline"
          className={`self-start sm:self-auto ${factoryStatus.color} px-3 py-1.5 text-xs font-medium`}
        >
          <span
            className={`mr-1.5 h-1.5 w-1.5 rounded-full inline-block ${
              stats.activeDowntimes === 0
                ? "bg-emerald-400 animate-pulse"
                : "bg-red-400"
            }`}
          />
          {factoryStatus.label}
        </Badge>
      </div>

      {/* ===== Row 2: KPI Hero Cards ===== */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <KpiCard
          title="Today's Output"
          value={todaySummary.totalOutput.toLocaleString()}
          subtitle={`${todaySummary.totalInput.toLocaleString()} input`}
          icon={Package}
          gradient="kpi-gradient-blue"
          trend={{ value: 3.2, label: "vs yesterday", isPositive: true }}
          className="animate-fade-in-up stagger-1"
        />
        <KpiCard
          title="Average Yield"
          value={stats.averageYield}
          suffix="%"
          subtitle="Last 7 days"
          icon={TrendingUp}
          gradient="kpi-gradient-emerald"
          trend={{ value: 1.5, label: "vs prev week", isPositive: true }}
          className="animate-fade-in-up stagger-2"
        />
        <KpiCard
          title="OEE"
          value={oee.oee}
          suffix="%"
          subtitle={`A:${oee.availability}% P:${oee.performance}% Q:${oee.quality}%`}
          icon={Gauge}
          gradient="kpi-gradient-violet"
          trend={{ value: 2.1, label: "vs prev week", isPositive: true }}
          className="animate-fade-in-up stagger-3"
        />
        <KpiCard
          title="Machine Uptime"
          value={uptimePercent}
          suffix="%"
          subtitle={`${stats.runningMachines} of ${stats.totalMachines} running`}
          icon={Activity}
          gradient="kpi-gradient-cyan"
          className="animate-fade-in-up stagger-4"
        />
        <KpiCard
          title="Active Downtime"
          value={stats.activeDowntimes}
          subtitle={`${stats.stoppedMachines} stopped · ${stats.maintenanceMachines} maint.`}
          icon={AlertTriangle}
          gradient="kpi-gradient-rose"
          trend={
            stats.activeDowntimes > 0
              ? {
                  value: stats.activeDowntimes,
                  label: "needs attention",
                  isPositive: false,
                }
              : undefined
          }
          className="animate-fade-in-up stagger-5"
        />
        <KpiCard
          title="Scrap Rate"
          value={scrapRate}
          suffix="%"
          subtitle={`${todaySummary.totalScrap.toLocaleString()} units today`}
          icon={ArrowDownRight}
          gradient="kpi-gradient-amber"
          trend={{ value: 0.3, label: "vs prev week", isPositive: false }}
          className="animate-fade-in-up stagger-6"
        />
      </div>

      {/* ===== Row 3: Production Trend + Machine Utilization ===== */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">
                  Production Trend — Last 7 Days
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px]">
                Output + Yield
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ProductionTrendChart data={chartData} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Boxes className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">
                  Machine Utilization
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {machineBreakdown.total} machines
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <MachineUtilizationChart data={machineBreakdown} />
          </CardContent>
        </Card>
      </div>

      {/* ===== Row 4: Line Performance + Alerts ===== */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">
                  Line Performance
                </CardTitle>
              </div>
              <Badge variant="outline" className="text-[10px]">
                {linePerformance.length} lines
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <LinePerformanceTable data={linePerformance} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-sm font-semibold">
                  Active Alerts
                </CardTitle>
              </div>
              {alerts.length > 0 && (
                <Badge
                  variant="outline"
                  className="text-[10px] border-red-500/30 text-red-400 bg-red-500/10"
                >
                  {alerts.length}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <AlertFeed alerts={alerts} />
          </CardContent>
        </Card>
      </div>

      {/* ===== Row 5: Machine Status Grid ===== */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Boxes className="h-4 w-4 text-muted-foreground" />
              <CardTitle className="text-sm font-semibold">
                Machine Status Overview
              </CardTitle>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-muted-foreground">
                  {machineBreakdown.running} running
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-yellow-400" />
                <span className="text-[10px] text-muted-foreground">
                  {machineBreakdown.idle} idle
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="h-2 w-2 rounded-full bg-red-400" />
                <span className="text-[10px] text-muted-foreground">
                  {machineBreakdown.stopped} stopped
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <MachineStatusGrid machines={mockMachines} />
        </CardContent>
      </Card>
    </div>
  );
}
