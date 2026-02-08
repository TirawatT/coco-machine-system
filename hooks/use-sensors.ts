"use client";

import {
  generateRealtimeSensorData,
  getLatestSensor,
  getSensorHistory,
} from "@/lib/mock-data";
import { SensorData } from "@/types";
import { useEffect, useMemo, useState } from "react";

export function useSensors(machineId: string, pollingInterval = 5000) {
  const [latest, setLatest] = useState<SensorData | null>(() =>
    getLatestSensor(machineId),
  );

  const history = useMemo(() => getSensorHistory(machineId), [machineId]);

  // Simulate real-time polling
  useEffect(() => {
    const interval = setInterval(() => {
      const newData = generateRealtimeSensorData(machineId);
      setLatest(newData);
    }, pollingInterval);

    return () => clearInterval(interval);
  }, [machineId, pollingInterval]);

  return { latest, history, isLoading: false };
}
