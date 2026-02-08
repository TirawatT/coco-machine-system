"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDowntime } from "@/hooks/use-downtime";
import { DowntimeReason, DowntimeStatus } from "@/types";
import { format } from "date-fns";
import { Clock } from "lucide-react";
import { useMemo } from "react";

const statusBadge: Record<
  DowntimeStatus,
  { className: string; label: string }
> = {
  [DowntimeStatus.OPEN]: {
    className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    label: "Open",
  },
  [DowntimeStatus.IN_PROGRESS]: {
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    label: "In Progress",
  },
  [DowntimeStatus.RESOLVED]: {
    className:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    label: "Resolved",
  },
};

const reasonLabels: Record<DowntimeReason, string> = {
  [DowntimeReason.PLANNED_MAINTENANCE]: "Planned Maintenance",
  [DowntimeReason.BREAKDOWN]: "Breakdown",
  [DowntimeReason.CHANGEOVER]: "Changeover",
  [DowntimeReason.OTHER]: "Other",
};

export default function DowntimeOverviewPage() {
  const { data: logs } = useDowntime();

  const stats = useMemo(() => {
    const open = logs.filter((l) => l.status === DowntimeStatus.OPEN).length;
    const inProgress = logs.filter(
      (l) => l.status === DowntimeStatus.IN_PROGRESS,
    ).length;
    const resolved = logs.filter(
      (l) => l.status === DowntimeStatus.RESOLVED,
    ).length;
    const totalHours =
      logs
        .filter((l) => l.duration)
        .reduce((s, l) => s + (l.duration ?? 0), 0) / 60;
    return { open, inProgress, resolved, totalHours };
  }, [logs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Downtime Overview</h1>
        <p className="text-muted-foreground">
          All machines — downtime & maintenance tracking
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Open</p>
            <p className="text-2xl font-bold text-red-600">{stats.open}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">In Progress</p>
            <p className="text-2xl font-bold text-yellow-600">
              {stats.inProgress}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Resolved</p>
            <p className="text-2xl font-bold text-green-600">
              {stats.resolved}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Downtime</p>
            <p className="text-2xl font-bold">{stats.totalHours.toFixed(1)}h</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All Downtime Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 p-4 rounded-lg border">
                <div className="flex flex-col items-center">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="w-px flex-1 bg-border mt-2" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">
                      {log.machineName}
                    </span>
                    <Badge
                      variant="outline"
                      className={statusBadge[log.status].className}
                    >
                      {statusBadge[log.status].label}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {reasonLabels[log.reason]}
                    </Badge>
                    {log.duration && (
                      <span className="text-xs text-muted-foreground">
                        {log.duration} min
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {log.description}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(log.startTime), "yyyy-MM-dd HH:mm")}
                    {log.endTime &&
                      ` → ${format(new Date(log.endTime), "yyyy-MM-dd HH:mm")}`}
                    {" · "}Reported by: {log.reportedByName}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
