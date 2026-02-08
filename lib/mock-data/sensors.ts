import { SensorData } from "@/types";
import { subMinutes } from "date-fns";
import { createSeededRandom } from "./seed-random";

// Shared seeded random for historical data (deterministic)
const sensorRand = createSeededRandom(54321);

// Generate historical sensor data (last 24 hours, every 5 minutes)
function generateHistoricalSensorData(machineId: string): SensorData[] {
  const data: SensorData[] = [];
  const now = new Date("2026-02-08T12:00:00Z");
  const intervals = 288; // 24h * 60min / 5min

  const baseTemp = 40 + sensorRand() * 20; // 40-60°C base
  const baseHumidity = 45 + sensorRand() * 10;
  const basePressure = 1010 + sensorRand() * 10;
  const baseVibration = 0.5 + sensorRand() * 1.5;
  const basePower = 15 + sensorRand() * 10;

  for (let i = 0; i < intervals; i++) {
    const recordedAt = subMinutes(now, i * 5);
    data.push({
      id: `sensor-${machineId}-${i}`,
      machineId,
      temperature: Math.round((baseTemp + (sensorRand() - 0.5) * 8) * 10) / 10,
      humidity: Math.round((baseHumidity + (sensorRand() - 0.5) * 6) * 10) / 10,
      pressure: Math.round((basePressure + (sensorRand() - 0.5) * 4) * 10) / 10,
      vibration:
        Math.round((baseVibration + (sensorRand() - 0.5) * 0.8) * 100) / 100,
      powerConsumption:
        Math.round((basePower + (sensorRand() - 0.5) * 5) * 10) / 10,
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
    temperature: Math.round((50 + (sensorRand() - 0.5) * 30) * 10) / 10,
    humidity: Math.round((48 + (sensorRand() - 0.5) * 12) * 10) / 10,
    pressure: Math.round((1013 + (sensorRand() - 0.5) * 8) * 10) / 10,
    vibration: Math.round((1.2 + (sensorRand() - 0.5) * 1.5) * 100) / 100,
    powerConsumption: Math.round((20 + (sensorRand() - 0.5) * 10) * 10) / 10,
    status: sensorRand() > 0.95 ? "warning" : "normal",
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
