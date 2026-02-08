"use client";

import { getDowntimeByMachine, mockDowntimeLogs } from "@/lib/mock-data";
import { useMemo } from "react";

export function useDowntime(machineId?: string) {
  const data = useMemo(() => {
    if (machineId) return getDowntimeByMachine(machineId);
    return mockDowntimeLogs.sort((a, b) =>
      b.startTime.localeCompare(a.startTime),
    );
  }, [machineId]);

  return { data, isLoading: false };
}
