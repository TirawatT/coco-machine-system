"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useProduction } from "@/hooks/use-production";
import { getMachineById } from "@/lib/mock-data";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ProductionOverviewPage() {
  const { data: allLogs } = useProduction();

  const logs = useMemo(() => {
    return allLogs.slice(0, 50).map((log) => {
      const machine = getMachineById(log.machineId);
      return { ...log, machineName: machine?.name ?? log.machineId };
    });
  }, [allLogs]);

  const chartData = useMemo(() => {
    const byDate = new Map<
      string,
      { output: number; scrap: number; input: number }
    >();
    for (const log of allLogs.slice(0, 200)) {
      const existing = byDate.get(log.shiftDate) ?? {
        output: 0,
        scrap: 0,
        input: 0,
      };
      existing.output += log.output;
      existing.scrap += log.scrap;
      existing.input += log.input;
      byDate.set(log.shiftDate, existing);
    }
    return Array.from(byDate.entries())
      .map(([date, d]) => ({
        date,
        output: d.output,
        scrap: d.scrap,
        yieldRate: Math.round((d.output / d.input) * 10000) / 100,
      }))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-7);
  }, [allLogs]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Production Overview
        </h1>
        <p className="text-muted-foreground">
          All machines — production output & yieldRate summary
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Daily Output — Last 7 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => v.slice(5)}
                  className="text-xs"
                />
                <YAxis className="text-xs" />
                <Tooltip />
                <Bar
                  dataKey="output"
                  fill="hsl(var(--chart-2))"
                  name="Output"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="scrap"
                  fill="hsl(var(--chart-5))"
                  name="Scrap"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Production Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead className="text-right">Input</TableHead>
                  <TableHead className="text-right">Output</TableHead>
                  <TableHead className="text-right">Scrap</TableHead>
                  <TableHead className="text-right">yieldRate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.shiftDate}</TableCell>
                    <TableCell className="font-medium">
                      {log.machineName}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={log.shift === "DAY" ? "default" : "secondary"}
                      >
                        {log.shift}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {log.input.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {log.output.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right text-red-600">
                      {log.scrap.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <span
                        className={
                          log.yieldRate >= 90
                            ? "text-green-600"
                            : log.yieldRate >= 85
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      >
                        {log.yieldRate}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
