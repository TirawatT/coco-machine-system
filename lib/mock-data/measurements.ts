import { Measurement } from "@/types";
import { subDays } from "date-fns";
import { createSeededRandom } from "./seed-random";

function generateMeasurements(): Measurement[] {
  const rand = createSeededRandom(67890);
  const measurements: Measurement[] = [];
  const machineIds = [
    "machine-001",
    "machine-002",
    "machine-005",
    "machine-009",
    "machine-010",
  ];
  const now = new Date("2026-02-08");

  let counter = 0;
  for (let dayOffset = 0; dayOffset < 14; dayOffset++) {
    const date = subDays(now, dayOffset);

    for (const machineId of machineIds) {
      // 2-3 measurements per machine per day
      const count = 2 + Math.floor(rand() * 2);
      for (let i = 0; i < count; i++) {
        counter++;
        const gram = Math.round((25 + (rand() - 0.5) * 4) * 100) / 100;
        const pitch = Math.round((0 + (rand() - 0.5) * 2) * 1000) / 1000;
        const roll = Math.round((0 + (rand() - 0.5) * 2) * 1000) / 1000;
        const yaw = Math.round((0 + (rand() - 0.5) * 2) * 1000) / 1000;
        const gramOk = gram >= 23.5 && gram <= 26.5;
        const pitchOk = Math.abs(pitch) <= 0.8;
        const rollOk = Math.abs(roll) <= 0.8;
        const yawOk = Math.abs(yaw) <= 0.8;
        const isPass = gramOk && pitchOk && rollOk && yawOk;

        measurements.push({
          id: `meas-${String(counter).padStart(4, "0")}`,
          machineId,
          inspectorId: "user-004",
          inspectorName: "Wichai Inspector",
          measurementType: "Standard QC",
          gram,
          pitch,
          roll,
          yaw,
          customValues: {
            thickness: Math.round((1.2 + (rand() - 0.5) * 0.3) * 100) / 100,
            width: Math.round((50 + (rand() - 0.5) * 2) * 100) / 100,
          },
          isPass,
          notes: isPass ? "" : "Out of tolerance — flagged for review",
          measuredAt: date.toISOString(),
          createdAt: date.toISOString(),
        });
      }
    }
  }

  return measurements;
}

export const mockMeasurements: Measurement[] = generateMeasurements();
