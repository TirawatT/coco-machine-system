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
      ? recentProduction.reduce((sum, p) => sum + p.yieldRate, 0) /
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
    yields.push(p.yieldRate);
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
  const data: {
    date: string;
    output: number;
    scrap: number;
    yieldRate: number;
  }[] = [];

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
      yieldRate: Math.round(avgYield * 100) / 100,
    });
  }

  return data;
}

// ===== Executive Dashboard Helpers =====

export function getOEE() {
  const machines = mockMachines;
  const running = machines.filter(
    (m) => m.status === MachineStatus.RUNNING,
  ).length;
  const total = machines.length;

  // Availability: running / total machines
  const availability = total > 0 ? running / total : 0;

  // Performance: actual output vs planned (assume planned = input)
  const recentProduction = mockProductionLogs.slice(0, 50);
  const totalOutput = recentProduction.reduce((s, p) => s + p.output, 0);
  const totalInput = recentProduction.reduce((s, p) => s + p.input, 0);
  const performance = totalInput > 0 ? totalOutput / totalInput : 0;

  // Quality: (output - scrap) / output
  const totalScrap = recentProduction.reduce((s, p) => s + p.scrap, 0);
  const quality =
    totalOutput > 0 ? (totalOutput - totalScrap) / totalOutput : 0;

  const oee = availability * performance * quality * 100;

  return {
    oee: Math.round(oee * 10) / 10,
    availability: Math.round(availability * 1000) / 10,
    performance: Math.round(performance * 1000) / 10,
    quality: Math.round(quality * 1000) / 10,
  };
}

export function getUptimePercentage() {
  const machines = mockMachines;
  const running = machines.filter(
    (m) => m.status === MachineStatus.RUNNING,
  ).length;
  const idle = machines.filter((m) => m.status === MachineStatus.IDLE).length;
  // Uptime = running + idle (not broken / not in maintenance)
  const uptime = running + idle;
  return machines.length > 0
    ? Math.round((uptime / machines.length) * 1000) / 10
    : 0;
}

export function getScrapRate() {
  const recentProduction = mockProductionLogs.slice(0, 50);
  const totalOutput = recentProduction.reduce((s, p) => s + p.output, 0);
  const totalScrap = recentProduction.reduce((s, p) => s + p.scrap, 0);
  return totalOutput > 0
    ? Math.round((totalScrap / totalOutput) * 1000) / 10
    : 0;
}

export function getTodayProductionSummary() {
  const today = "2026-02-08"; // mock "today"
  const todayLogs = mockProductionLogs.filter((p) => p.shiftDate === today);
  return {
    totalInput: todayLogs.reduce((s, p) => s + p.input, 0),
    totalOutput: todayLogs.reduce((s, p) => s + p.output, 0),
    totalScrap: todayLogs.reduce((s, p) => s + p.scrap, 0),
    logCount: todayLogs.length,
  };
}

export function getLinePerformance() {
  return mockLines.map((line) => {
    const lineMachines = mockMachines.filter((m) => m.lineId === line.id);
    const running = lineMachines.filter(
      (m) => m.status === MachineStatus.RUNNING,
    ).length;
    const lineProduction = mockProductionLogs.filter((p) =>
      lineMachines.some((m) => m.id === p.machineId),
    );
    const recentProd = lineProduction.slice(0, 30);
    const totalOutput = recentProd.reduce((s, p) => s + p.output, 0);
    const totalInput = recentProd.reduce((s, p) => s + p.input, 0);
    const avgYield = totalInput > 0 ? (totalOutput / totalInput) * 100 : 0;

    return {
      lineId: line.id,
      lineName: line.name,
      location: line.location,
      totalMachines: lineMachines.length,
      runningMachines: running,
      totalOutput,
      averageYield: Math.round(avgYield * 10) / 10,
      uptimePercent:
        lineMachines.length > 0
          ? Math.round((running / lineMachines.length) * 1000) / 10
          : 0,
    };
  });
}

export function getMachineStatusBreakdown() {
  const machines = mockMachines;
  return {
    running: machines.filter((m) => m.status === MachineStatus.RUNNING).length,
    idle: machines.filter((m) => m.status === MachineStatus.IDLE).length,
    stopped: machines.filter((m) => m.status === MachineStatus.STOPPED).length,
    maintenance: machines.filter((m) => m.status === MachineStatus.MAINTENANCE)
      .length,
    total: machines.length,
  };
}
