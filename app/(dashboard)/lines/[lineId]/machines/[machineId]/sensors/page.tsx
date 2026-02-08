"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMachine } from "@/hooks/use-machines";
import { useSensors } from "@/hooks/use-sensors";
import {
  Activity,
  ArrowLeft,
  Droplets,
  Gauge,
  Thermometer,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { use, useMemo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

function SensorGauge({
  icon: Icon,
  label,
  value,
  unit,
  color,
  min,
  max,
  warningThreshold,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  unit: string;
  color: string;
  min: number;
  max: number;
  warningThreshold?: number;
}) {
  const percentage = Math.min(((value - min) / (max - min)) * 100, 100);
  const isWarning = warningThreshold ? value > warningThreshold : false;

  return (
    <Card className={isWarning ? "border-red-300 dark:border-red-700" : ""}>
      <CardContent className="pt-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${color}`} />
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
          {isWarning && (
            <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
              HIGH
            </Badge>
          )}
        </div>
        <p className={`text-2xl font-bold ${isWarning ? "text-red-600" : ""}`}>
          {value}
          <span className="text-sm font-normal text-muted-foreground ml-1">
            {unit}
          </span>
        </p>
        <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isWarning ? "bg-red-500" : "bg-primary"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SensorsPage({
  params,
}: {
  params: Promise<{ lineId: string; machineId: string }>;
}) {
  const { lineId, machineId } = use(params);
  const { data: machine } = useMachine(machineId);
  const { latest, history } = useSensors(machineId, 5000);

  const chartData = useMemo(() => {
    return history.slice(-50).map((d) => ({
      time: new Date(d.recordedAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      temperature: d.temperature,
      humidity: d.humidity,
      vibration: d.vibration,
      pressure: d.pressure,
    }));
  }, [history]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/lines/${lineId}/machines/${machineId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Sensors</h1>
            <Badge
              variant="outline"
              className="bg-green-50 text-green-700 border-green-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse mr-1.5" />
              Live
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {machine?.name} — Real-time sensor monitoring (updates every 5s)
          </p>
        </div>
      </div>

      {/* Live Gauges */}
      {latest && (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-5">
          <SensorGauge
            icon={Thermometer}
            label="Temperature"
            value={latest.temperature}
            unit="°C"
            color="text-red-500"
            min={0}
            max={100}
            warningThreshold={70}
          />
          <SensorGauge
            icon={Droplets}
            label="Humidity"
            value={latest.humidity}
            unit="%"
            color="text-blue-500"
            min={0}
            max={100}
          />
          <SensorGauge
            icon={Gauge}
            label="Pressure"
            value={latest.pressure}
            unit="hPa"
            color="text-purple-500"
            min={980}
            max={1040}
          />
          <SensorGauge
            icon={Activity}
            label="Vibration"
            value={latest.vibration}
            unit="mm/s"
            color="text-orange-500"
            min={0}
            max={5}
            warningThreshold={3}
          />
          <SensorGauge
            icon={Zap}
            label="Power"
            value={latest.powerConsumption}
            unit="kW"
            color="text-yellow-500"
            min={0}
            max={50}
          />
        </div>
      )}

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Temperature History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="temperature"
                    stroke="hsl(var(--chart-5))"
                    strokeWidth={2}
                    dot={false}
                    name="Temp °C"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vibration History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    className="stroke-muted"
                  />
                  <XAxis dataKey="time" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="vibration"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    dot={false}
                    name="Vibration mm/s"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
