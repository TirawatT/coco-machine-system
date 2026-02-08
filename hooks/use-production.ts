"use client";

import { getProductionByMachine, mockProductionLogs } from "@/lib/mock-data";
import { useMemo } from "react";

export function useProduction(machineId?: string) {
  const data = useMemo(() => {
    if (machineId) return getProductionByMachine(machineId);
    return mockProductionLogs.sort((a, b) =>
      b.shiftDate.localeCompare(a.shiftDate),
    );
  }, [machineId]);

  return { data, isLoading: false };
}
