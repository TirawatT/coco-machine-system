import { SensorData } from "@/types";
import { subMinutes } from "date-fns";

// Generate historical sensor data (last 24 hours, every 5 minutes)
function generateHistoricalSensorData(machineId: string): SensorData[] {
  const data: SensorData[] = [];
  const now = new Date("2026-02-08T12:00:00Z");
  const intervals = 288; // 24h * 60min / 5min

  const baseTemp = 40 + Math.random() * 20; // 40-60°C base
  const baseHumidity = 45 + Math.random() * 10;
  const basePressure = 1010 + Math.random() * 10;
  const baseVibration = 0.5 + Math.random() * 1.5;
  const basePower = 15 + Math.random() * 10;

  for (let i = 0; i < intervals; i++) {
    const recordedAt = subMinutes(now, i * 5);
    data.push({
      id: `sensor-${machineId}-${i}`,
      machineId,
      temperature: Math.round((baseTemp + (Math.random() - 0.5) * 8) * 10) / 10,
      humidity:
        Math.round((baseHumidity + (Math.random() - 0.5) * 6) * 10) / 10,
      pressure:
        Math.round((basePressure + (Math.random() - 0.5) * 4) * 10) / 10,
      vibration:
        Math.round((baseVibration + (Math.random() - 0.5) * 0.8) * 100) / 100,
      powerConsumption:
        Math.round((basePower + (Math.random() - 0.5) * 5) * 10) / 10,
      status: "normal",
      recordedAt: recordedAt.toISOString(),
      createdAt: recordedAt.toISOString(),
    });
  }

  return data.reverse(); // oldest first
}

// Generate real-time sensor reading (simulates live polling)
export function generateRealtimeSensorData(machineId: string): SensorData {
  const now = new Date();
  return {
    id: `sensor-${machineId}-${now.getTime()}`,
    machineId,
    temperature: Math.round((50 + (Math.random() - 0.5) * 30) * 10) / 10,
    humidity: Math.round((48 + (Math.random() - 0.5) * 12) * 10) / 10,
    pressure: Math.round((1013 + (Math.random() - 0.5) * 8) * 10) / 10,
    vibration: Math.round((1.2 + (Math.random() - 0.5) * 1.5) * 100) / 100,
    powerConsumption: Math.round((20 + (Math.random() - 0.5) * 10) * 10) / 10,
    status: Math.random() > 0.95 ? "warning" : "normal",
    recordedAt: now.toISOString(),
    createdAt: now.toISOString(),
  };
}

// Pre-generate historical data for active machines
const activeMachineIds = [
  "machine-001",
  "machine-002",
  "machine-003",
  "machine-005",
  "machine-006",
  "machine-008",
  "machine-009",
  "machine-010",
  "machine-011",
];

export const mockSensorHistory: Record<string, SensorData[]> = {};
for (const id of activeMachineIds) {
  mockSensorHistory[id] = generateHistoricalSensorData(id);
}

// Latest readings for all machines
export const mockLatestSensors: Record<string, SensorData> = {};
for (const id of activeMachineIds) {
  const history = mockSensorHistory[id];
  mockLatestSensors[id] = history[history.length - 1];
}
