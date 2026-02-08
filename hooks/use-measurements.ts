"use client";

import { getMeasurementsByMachine, mockMeasurements } from "@/lib/mock-data";
import { useMemo } from "react";

export function useMeasurements(machineId?: string) {
  const data = useMemo(() => {
    if (machineId) return getMeasurementsByMachine(machineId);
    return mockMeasurements.sort((a, b) =>
      b.measuredAt.localeCompare(a.measuredAt),
    );
  }, [machineId]);

  return { data, isLoading: false };
}
