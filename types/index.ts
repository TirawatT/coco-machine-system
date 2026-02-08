// ===== Enums =====

export enum UserRole {
  ADMIN = "ADMIN",
  OPERATOR = "OPERATOR",
  INSPECTOR = "INSPECTOR",
  VIEWER = "VIEWER",
}

export enum MachineStatus {
  RUNNING = "RUNNING",
  IDLE = "IDLE",
  STOPPED = "STOPPED",
  MAINTENANCE = "MAINTENANCE",
}

export enum ShiftType {
  DAY = "DAY",
  NIGHT = "NIGHT",
}

export enum DowntimeReason {
  PLANNED_MAINTENANCE = "PLANNED_MAINTENANCE",
  BREAKDOWN = "BREAKDOWN",
  CHANGEOVER = "CHANGEOVER",
  OTHER = "OTHER",
}

export enum DowntimeStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  RESOLVED = "RESOLVED",
}

// ===== Interfaces =====

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Line {
  id: string;
  name: string;
  description: string;
  location: string;
  isActive: boolean;
  createdAt: string;
}

export interface Machine {
  id: string;
  name: string;
  model: string;
  serialNumber: string;
  lineId: string;
  lineName?: string;
  status: MachineStatus;
  isActive: boolean;
  imageUrl?: string;
  createdAt: string;
}

export interface ProductionLog {
  id: string;
  machineId: string;
  machineName?: string;
  shiftDate: string;
  shift: ShiftType;
  input: number;
  output: number;
  scrap: number;
  yieldRate: number; // percentage (output / input * 100)
  operatorId: string;
  operatorName?: string;
  createdAt: string;
}

export interface SensorData {
  id: string;
  machineId: string;
  temperature: number;
  humidity: number;
  pressure: number;
  vibration: number;
  powerConsumption: number;
  status: string;
  recordedAt: string;
  createdAt: string;
}

export interface DowntimeLog {
  id: string;
  machineId: string;
  machineName?: string;
  reason: DowntimeReason;
  description: string;
  startTime: string;
  endTime: string | null;
  duration: number | null; // minutes
  reportedById: string;
  reportedByName?: string;
  resolvedById: string | null;
  resolvedByName?: string;
  status: DowntimeStatus;
  createdAt: string;
}

export interface Measurement {
  id: string;
  machineId: string;
  machineName?: string;
  inspectorId: string;
  inspectorName?: string;
  measurementType: string;
  gram: number | null;
  pitch: number | null;
  roll: number | null;
  yaw: number | null;
  customValues: Record<string, number>;
  isPass: boolean;
  notes: string;
  measuredAt: string;
  createdAt: string;
}

export interface VistaTour {
  id: string;
  machineId: string | null;
  machineName?: string;
  lineId: string | null;
  lineName?: string;
  tourUrl: string;
  thumbnailUrl?: string;
  name: string;
  description: string;
  createdAt: string;
}

// ===== Dashboard Types =====

export interface DashboardStats {
  totalLines: number;
  totalMachines: number;
  runningMachines: number;
  idleMachines: number;
  stoppedMachines: number;
  maintenanceMachines: number;
  activeDowntimes: number;
  averageYield: number;
}

export interface Alert {
  id: string;
  type: "warning" | "error" | "info";
  title: string;
  message: string;
  machineId?: string;
  machineName?: string;
  timestamp: string;
}
