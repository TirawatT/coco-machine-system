"use client";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface LineData {
  lineId: string;
  lineName: string;
  location: string;
  totalMachines: number;
  runningMachines: number;
  totalOutput: number;
  averageYield: number;
  uptimePercent: number;
}

interface LinePerformanceTableProps {
  data: LineData[];
}

export function LinePerformanceTable({ data }: LinePerformanceTableProps) {
  return (
    <div className="space-y-4">
      {data.map((line) => {
        const yieldColor =
          line.averageYield >= 95
            ? "text-emerald-400"
            : line.averageYield >= 88
              ? "text-yellow-400"
              : "text-red-400";

        const progressColor =
          line.averageYield >= 95
            ? "[&>div]:bg-emerald-500"
            : line.averageYield >= 88
              ? "[&>div]:bg-yellow-500"
              : "[&>div]:bg-red-500";

        return (
          <Link
            key={line.lineId}
            href={`/lines/${line.lineId}`}
            className="group block"
          >
            <div className="rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-primary/30 hover:bg-card">
              {/* Header row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h4 className="text-sm font-semibold">{line.lineName}</h4>
                  <Badge
                    variant="outline"
                    className="text-[10px] text-muted-foreground"
                  >
                    {line.location}
                  </Badge>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-4 gap-4 mb-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Machines
                  </p>
                  <p className="text-sm font-bold">
                    <span className="text-emerald-400">
                      {line.runningMachines}
                    </span>
                    <span className="text-muted-foreground font-normal">
                      /{line.totalMachines}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Output
                  </p>
                  <p className="text-sm font-bold">
                    {line.totalOutput.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Yield
                  </p>
                  <p className={`text-sm font-bold ${yieldColor}`}>
                    {line.averageYield}%
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Uptime
                  </p>
                  <p className="text-sm font-bold">{line.uptimePercent}%</p>
                </div>
              </div>

              {/* Yield progress bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-muted-foreground w-8">
                  Yield
                </span>
                <Progress
                  value={line.averageYield}
                  className={`h-1.5 flex-1 bg-muted/30 ${progressColor}`}
                />
                <span className={`text-[10px] font-medium ${yieldColor}`}>
                  {line.averageYield}%
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
