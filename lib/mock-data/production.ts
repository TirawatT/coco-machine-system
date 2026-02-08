import { ProductionLog, ShiftType } from "@/types";
import { format, subDays } from "date-fns";
import { createSeededRandom } from "./seed-random";

function generateProductionLogs(): ProductionLog[] {
  const rand = createSeededRandom(12345);
  const logs: ProductionLog[] = [];
  const machineIds = [
    "machine-001",
    "machine-002",
    "machine-003",
    "machine-005",
    "machine-006",
    "machine-008",
    "machine-009",
    "machine-010",
  ];
  const operators = [
    { id: "user-002", name: "Napat Operator" },
    { id: "user-003", name: "Kanya Operator" },
  ];

  const now = new Date("2026-02-08");

  for (let dayOffset = 0; dayOffset < 30; dayOffset++) {
    const date = subDays(now, dayOffset);
    const shiftDate = format(date, "yyyy-MM-dd");

    for (const machineId of machineIds) {
      for (const shift of [ShiftType.DAY, ShiftType.NIGHT]) {
        const input = Math.floor(rand() * 500) + 800; // 800-1300
        const yieldRate = 0.85 + rand() * 0.13; // 85%-98%
        const output = Math.floor(input * yieldRate);
        const scrap = input - output;

        const operator = operators[Math.floor(rand() * operators.length)];

        logs.push({
          id: `prod-${machineId}-${shiftDate}-${shift}`,
          machineId,
          shiftDate,
          shift,
          input,
          output,
          scrap,
          yieldRate: Math.round((output / input) * 10000) / 100,
          operatorId: operator.id,
          operatorName: operator.name,
          createdAt: date.toISOString(),
        });
      }
    }
  }

  return logs;
}

export const mockProductionLogs: ProductionLog[] = generateProductionLogs();
