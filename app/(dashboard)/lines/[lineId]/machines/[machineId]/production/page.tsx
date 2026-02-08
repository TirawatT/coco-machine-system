"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMachine } from "@/hooks/use-machines";
import { useProduction } from "@/hooks/use-production";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use, useMemo } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function ProductionPage({
  params,
}: {
  params: Promise<{ lineId: string; machineId: string }>;
}) {
  const { lineId, machineId } = use(params);
  const { data: machine } = useMachine(machineId);
  const { data: logs } = useProduction(machineId);

  const chartData = useMemo(() => {
    const byDate = new Map<
      string,
      { input: number; output: number; scrap: number; count: number }
    >();
    for (const log of logs.slice(0, 60)) {
      const existing = byDate.get(log.shiftDate) ?? {
        input: 0,
        output: 0,
        scrap: 0,
        count: 0,
      };
      existing.input += log.input;
      existing.output += log.output;
      existing.scrap += log.scrap;
      existing.count++;
      byDate.set(log.shiftDate, existing);
    }
    return Array.from(byDate.entries())
      .map(([date, d]) => ({
        date,
        output: d.output,
        scrap: d.scrap,
        yield: Math.round((d.output / d.input) * 10000) / 100,
      }))
      .reverse();
  }, [logs]);

  const avgYield = useMemo(() => {
    if (logs.length === 0) return 0;
    const recent = logs.slice(0, 14);
    return (
      Math.round(
        (recent.reduce((s, l) => s + l.yield, 0) / recent.length) * 100,
      ) / 100
    );
  }, [logs]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/lines/${lineId}/machines/${machineId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Production</h1>
          <p className="text-muted-foreground">
            {machine?.name} — Production logs & yield tracking
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Avg Yield (7d)</p>
            <p className="text-2xl font-bold">{avgYield}%</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Output (7d)</p>
            <p className="text-2xl font-bold">
              {logs
                .slice(0, 14)
                .reduce((s, l) => s + l.output, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Scrap (7d)</p>
            <p className="text-2xl font-bold text-red-600">
              {logs
                .slice(0, 14)
                .reduce((s, l) => s + l.scrap, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Records</p>
            <p className="text-2xl font-bold">{logs.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Yield Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => v.slice(5)}
                    className="text-xs"
                  />
                  <YAxis domain={[80, 100]} className="text-xs" />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="yield"
                    stroke="hsl(var(--chart-1))"
                    fill="hsl(var(--chart-1))"
                    fillOpacity={0.2}
                    name="Yield %"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Output vs Scrap</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData.slice(-7)}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
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
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Production Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Shift</TableHead>
                  <TableHead className="text-right">Input</TableHead>
                  <TableHead className="text-right">Output</TableHead>
                  <TableHead className="text-right">Scrap</TableHead>
                  <TableHead className="text-right">Yield</TableHead>
                  <TableHead>Operator</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.slice(0, 20).map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">
                      {log.shiftDate}
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
                          log.yield >= 90
                            ? "text-green-600"
                            : log.yield >= 85
                              ? "text-yellow-600"
                              : "text-red-600"
                        }
                      >
                        {log.yield}%
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {log.operatorName}
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
