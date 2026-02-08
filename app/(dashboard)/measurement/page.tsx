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
import { useMeasurements } from "@/hooks/use-measurements";
import { getMachineById } from "@/lib/mock-data";
import { CheckCircle, XCircle } from "lucide-react";
import { useMemo } from "react";

export default function MeasurementOverviewPage() {
  const { data: allMeasurements } = useMeasurements();

  const measurements = useMemo(() => {
    return allMeasurements.slice(0, 50).map((m) => {
      const machine = getMachineById(m.machineId);
      return { ...m, machineName: machine?.name ?? m.machineId };
    });
  }, [allMeasurements]);

  const stats = useMemo(() => {
    const total = allMeasurements.length;
    const pass = allMeasurements.filter((m) => m.isPass).length;
    const fail = total - pass;
    const rate = total > 0 ? Math.round((pass / total) * 10000) / 100 : 0;
    return { total, pass, fail, rate };
  }, [allMeasurements]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Measurement Overview
        </h1>
        <p className="text-muted-foreground">
          All machines — quality inspection summary
        </p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Total Measurements</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Pass Rate</p>
            <p
              className={`text-2xl font-bold ${stats.rate >= 95 ? "text-green-600" : "text-yellow-600"}`}
            >
              {stats.rate}%
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Pass</p>
            <p className="text-2xl font-bold text-green-600">{stats.pass}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <p className="text-sm text-muted-foreground">Fail</p>
            <p className="text-2xl font-bold text-red-600">{stats.fail}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Measurements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Machine</TableHead>
                  <TableHead className="text-right">Gram</TableHead>
                  <TableHead className="text-right">Pitch</TableHead>
                  <TableHead className="text-right">Roll</TableHead>
                  <TableHead className="text-right">Yaw</TableHead>
                  <TableHead>Result</TableHead>
                  <TableHead>Inspector</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {measurements.map((m) => (
                  <TableRow key={m.id}>
                    <TableCell>{m.measuredAt.split("T")[0]}</TableCell>
                    <TableCell className="font-medium">
                      {m.machineName}
                    </TableCell>
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
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="h-3 w-3 mr-1" /> Pass
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-red-100 text-red-800"
                        >
                          <XCircle className="h-3 w-3 mr-1" /> Fail
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
