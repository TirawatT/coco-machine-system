"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDowntime } from "@/hooks/use-downtime";
import { useMachine } from "@/hooks/use-machines";
import { DowntimeReason, DowntimeStatus } from "@/types";
import { format } from "date-fns";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { use } from "react";

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

export default function DowntimePage({
  params,
}: {
  params: Promise<{ lineId: string; machineId: string }>;
}) {
  const { lineId, machineId } = use(params);
  const { data: machine } = useMachine(machineId);
  const { data: logs } = useDowntime(machineId);

  const totalDowntimeHours =
    logs.filter((l) => l.duration).reduce((s, l) => s + (l.duration ?? 0), 0) /
    60;

  const resolvedLogs = logs.filter(
    (l) => l.status === DowntimeStatus.RESOLVED && l.duration,
  );
  const mttr =
    resolvedLogs.length > 0
      ? resolvedLogs.reduce((s, l) => s + (l.duration ?? 0), 0) /
        resolvedLogs.length
      : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/lines/${lineId}/machines/${machineId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Downtime</h1>
          <p className="text-muted-foreground">
            {machine?.name} — Downtime & maintenance records
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold">{logs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Open / In Progress</p>
            <p className="text-2xl font-bold text-red-600">
              {logs.filter((l) => l.status !== DowntimeStatus.RESOLVED).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Downtime</p>
            <p className="text-2xl font-bold">
              {totalDowntimeHours.toFixed(1)}h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Avg MTTR</p>
            <p className="text-2xl font-bold">{mttr.toFixed(0)} min</p>
          </CardContent>
        </Card>
      </div>

      {/* Timeline / Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Downtime Events</CardTitle>
        </CardHeader>
        <CardContent>
          {logs.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No downtime events recorded for this machine
            </p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="flex gap-4 p-4 rounded-lg border">
                  <div className="flex flex-col items-center">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <div className="w-px flex-1 bg-border mt-2" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
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
                          Duration: {log.duration} min
                        </span>
                      )}
                    </div>
                    <p className="text-sm">{log.description}</p>
                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>
                        Start:{" "}
                        {format(new Date(log.startTime), "yyyy-MM-dd HH:mm")}
                      </span>
                      {log.endTime && (
                        <span>
                          End:{" "}
                          {format(new Date(log.endTime), "yyyy-MM-dd HH:mm")}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Reported by: {log.reportedByName}
                      {log.resolvedByName &&
                        ` · Resolved by: ${log.resolvedByName}`}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
