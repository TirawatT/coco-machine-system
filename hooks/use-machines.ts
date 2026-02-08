"use client";

import {
  getMachineById,
  getMachinesByLine,
  mockMachines,
} from "@/lib/mock-data";
import { useMemo } from "react";

export function useMachines(lineId?: string) {
  const data = useMemo(() => {
    if (lineId) return getMachinesByLine(lineId);
    return mockMachines;
  }, [lineId]);

  return { data, isLoading: false };
}

export function useMachine(machineId: string) {
  const data = useMemo(() => {
    return getMachineById(machineId);
  }, [machineId]);

  return { data, isLoading: false };
}
