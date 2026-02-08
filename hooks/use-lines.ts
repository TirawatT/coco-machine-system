"use client";

import { getMachinesByLine, mockLines } from "@/lib/mock-data";
import { useMemo } from "react";

export function useLines() {
  const data = useMemo(() => {
    return mockLines.map((line) => {
      const machines = getMachinesByLine(line.id);
      return {
        ...line,
        machineCount: machines.length,
        runningCount: machines.filter((m) => m.status === "RUNNING").length,
        stoppedCount: machines.filter(
          (m) => m.status === "STOPPED" || m.status === "MAINTENANCE",
        ).length,
      };
    });
  }, []);

  return { data, isLoading: false };
}

export function useLine(lineId: string) {
  const data = useMemo(() => {
    return mockLines.find((l) => l.id === lineId) ?? null;
  }, [lineId]);

  return { data, isLoading: false };
}
