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
import { useMeasurements } from "@/hooks/use-measurements";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { use, useMemo } from "react";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function MeasurementPage({
  params,
}: {
  params: Promise<{ lineId: string; machineId: string }>;
}) {
  const { lineId, machineId } = use(params);
  const { data: machine } = useMachine(machineId);
  const { data: measurements } = useMeasurements(machineId);

  const passRate = useMemo(() => {
    if (measurements.length === 0) return 0;
    const pass = measurements.filter((m) => m.isPass).length;
    return Math.round((pass / measurements.length) * 10000) / 100;
  }, [measurements]);

  const gramData = useMemo(() => {
    return measurements.map((m, idx) => ({
      index: idx + 1,
      gram: m.gram,
      isPass: m.isPass,
    }));
  }, [measurements]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/lines/${lineId}/machines/${machineId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Measurement</h1>
          <p className="text-muted-foreground">
            {machine?.name} — Quality inspection data
          </p>
        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Measurements</p>
            <p className="text-2xl font-bold">{measurements.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Pass Rate</p>
            <p
              className={`text-2xl font-bold ${passRate >= 95 ? "text-green-600" : passRate >= 90 ? "text-yellow-600" : "text-red-600"}`}
            >
              {passRate}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Pass</p>
            <p className="text-2xl font-bold text-green-600">
              {measurements.filter((m) => m.isPass).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Fail</p>
            <p className="text-2xl font-bold text-red-600">
              {measurements.filter((m) => !m.isPass).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SPC Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">
            Gram — Control Chart (Target: 25g ±1.5g)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="index" name="Sample" className="text-xs" />
                <YAxis domain={[22, 28]} name="Gram" className="text-xs" />
                <Tooltip />
                <ReferenceLine
                  y={25}
                  stroke="hsl(var(--chart-2))"
                  strokeDasharray="5 5"
                  label="Target"
                />
                <ReferenceLine
                  y={26.5}
                  stroke="hsl(var(--chart-5))"
                  strokeDasharray="3 3"
                  label="UCL"
                />
                <ReferenceLine
                  y={23.5}
                  stroke="hsl(var(--chart-5))"
                  strokeDasharray="3 3"
                  label="LCL"
                />
                <Scatter
                  data={gramData}
                  fill="hsl(var(--chart-1))"
                  name="Gram"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Measurement Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Gram</TableHead>
                  <TableHead className="text-right">Pitch</TableHead>
                  <TableHead className="text-right">Roll</TableHead>
                  <TableHead className="text-right">Yaw</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Inspector</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurements.slice(0, 20).map((m) => (
                  <TableRow key={m.id}>
                    <TableCell className="font-medium">
                      {m.measuredAt.split("T")[0]}
                    </TableCell>
                    <TableCell>{m.measurementType}</TableCell>
                    <TableCell className="text-right">
                      {m.gram?.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      {m.pitch?.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right">
                      {m.roll?.toFixed(3)}
                    </TableCell>
                    <TableCell className="text-right">
                      {m.yaw?.toFixed(3)}
                    </TableCell>
                    <TableCell>
                      {m.isPass ? (
                        <Badge
                          variant="outline"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Pass
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Fail
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {m.inspectorName}
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
