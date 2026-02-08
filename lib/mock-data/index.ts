import { Alert, DashboardStats, DowntimeStatus, MachineStatus } from "@/types";
import { mockDowntimeLogs } from "./downtime";
import { mockLines } from "./lines";
import { mockMachines } from "./machines";
import { mockMeasurements } from "./measurements";
import { mockProductionLogs } from "./production";
import {
  generateRealtimeSensorData,
  mockLatestSensors,
  mockSensorHistory,
} from "./sensors";
import { defaultCurrentUser, mockUsers } from "./users";
import { mockVistaTours } from "./vista";

// ===== Re-exports =====
export {
  defaultCurrentUser,
  generateRealtimeSensorData,
  mockDowntimeLogs,
  mockLatestSensors,
  mockLines,
  mockMachines,
  mockMeasurements,
  mockProductionLogs,
  mockSensorHistory,
  mockUsers,
  mockVistaTours,
};

// ===== Helper Functions =====

export function getMachinesByLine(lineId: string) {
  return mockMachines.filter((m) => m.lineId === lineId);
}

export function getMachineById(machineId: string) {
  return mockMachines.find((m) => m.id === machineId) ?? null;
}

export function getLineById(lineId: string) {
  return mockLines.find((l) => l.id === lineId) ?? null;
}

export function getProductionByMachine(machineId: string) {
  return mockProductionLogs
    .filter((p) => p.machineId === machineId)
    .sort((a, b) => b.shiftDate.localeCompare(a.shiftDate));
}

export function getLatestSensor(machineId: string) {
  return mockLatestSensors[machineId] ?? null;
}

export function getSensorHistory(machineId: string) {
  return mockSensorHistory[machineId] ?? [];
}

export function getDowntimeByMachine(machineId: string) {
  return mockDowntimeLogs
    .filter((d) => d.machineId === machineId)
    .sort((a, b) => b.startTime.localeCompare(a.startTime));
}

export function getMeasurementsByMachine(machineId: string) {
  return mockMeasurements
    .filter((m) => m.machineId === machineId)
    .sort((a, b) => b.measuredAt.localeCompare(a.measuredAt));
}

export function getVistaToursByLine(lineId: string) {
  return mockVistaTours.filter((v) => v.lineId === lineId);
}

export function getVistaTourByMachine(machineId: string) {
  return mockVistaTours.find((v) => v.machineId === machineId) ?? null;
}

// ===== Dashboard Statistics =====

export function getDashboardStats(): DashboardStats {
  const machines = mockMachines;
  const running = machines.filter(
    (m) => m.status === MachineStatus.RUNNING,
  ).length;
  const idle = machines.filter((m) => m.status === MachineStatus.IDLE).length;
  const stopped = machines.filter(
    (m) => m.status === MachineStatus.STOPPED,
  ).length;
  const maintenance = machines.filter(
    (m) => m.status === MachineStatus.MAINTENANCE,
  ).length;

  const activeDowntimes = mockDowntimeLogs.filter(
    (d) => d.status !== DowntimeStatus.RESOLVED,
  ).length;

  // Average yield from last 7 days
  const recentProduction = mockProductionLogs.slice(0, 100);
  const avgYield =
    recentProduction.length > 0
      ? recentProduction.reduce((sum, p) => sum + p.yield, 0) /
        recentProduction.length
      : 0;

  return {
    totalLines: mockLines.length,
    totalMachines: machines.length,
    runningMachines: running,
    idleMachines: idle,
    stoppedMachines: stopped,
    maintenanceMachines: maintenance,
    activeDowntimes,
    averageYield: Math.round(avgYield * 100) / 100,
  };
}

// ===== Alerts =====

export function getAlerts(): Alert[] {
  const alerts: Alert[] = [];

  // High temperature alerts
  for (const [machineId, sensor] of Object.entries(mockLatestSensors)) {
    if (sensor.temperature > 70) {
      const machine = getMachineById(machineId);
      alerts.push({
        id: `alert-temp-${machineId}`,
        type: "warning",
        title: "High Temperature",
        message: `${machine?.name} temperature at ${sensor.temperature}°C (threshold: 70°C)`,
        machineId,
        machineName: machine?.name,
        timestamp: sensor.recordedAt,
      });
    }
  }

  // Active downtime alerts
  for (const dt of mockDowntimeLogs) {
    if (dt.status === DowntimeStatus.OPEN) {
      alerts.push({
        id: `alert-dt-${dt.id}`,
        type: "error",
        title: "Machine Down",
        message: `${dt.machineName} — ${dt.description}`,
        machineId: dt.machineId,
        machineName: dt.machineName,
        timestamp: dt.startTime,
      });
    }
  }

  // Low yield alerts (machines with avg yield < 88%)
  const machineYields = new Map<string, number[]>();
  for (const p of mockProductionLogs.slice(0, 50)) {
    const yields = machineYields.get(p.machineId) ?? [];
    yields.push(p.yield);
    machineYields.set(p.machineId, yields);
  }
  for (const [machineId, yields] of machineYields) {
    const avg = yields.reduce((a, b) => a + b, 0) / yields.length;
    if (avg < 88) {
      const machine = getMachineById(machineId);
      alerts.push({
        id: `alert-yield-${machineId}`,
        type: "info",
        title: "Low Yield",
        message: `${machine?.name} average yield ${avg.toFixed(1)}% (target: ≥88%)`,
        machineId,
        machineName: machine?.name,
        timestamp: new Date().toISOString(),
      });
    }
  }

  return alerts.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
}

// ===== Production Chart Data (last 7 days) =====

export function getProductionChartData() {
  const days = 7;
  const now = new Date("2026-02-08");
  const data: { date: string; output: number; scrap: number; yield: number }[] =
    [];

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];

    const dayLogs = mockProductionLogs.filter((p) => p.shiftDate === dateStr);
    const totalOutput = dayLogs.reduce((s, p) => s + p.output, 0);
    const totalScrap = dayLogs.reduce((s, p) => s + p.scrap, 0);
    const totalInput = dayLogs.reduce((s, p) => s + p.input, 0);
    const avgYield = totalInput > 0 ? (totalOutput / totalInput) * 100 : 0;

    data.push({
      date: dateStr,
      output: totalOutput,
      scrap: totalScrap,
      yield: Math.round(avgYield * 100) / 100,
    });
  }

  return data;
}
