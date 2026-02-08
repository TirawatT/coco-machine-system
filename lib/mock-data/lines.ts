import { Line } from "@/types";

export const mockLines: Line[] = [
  {
    id: "line-001",
    name: "Assembly Line A",
    description:
      "Main assembly line for product series A — handles component assembly, soldering, and final integration.",
    location: "Building 1, Floor 1",
    isActive: true,
    createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "line-002",
    name: "Packaging Line B",
    description:
      "Automated packaging line for finished products — includes labeling, boxing, and palletizing.",
    location: "Building 1, Floor 2",
    isActive: true,
    createdAt: "2024-07-15T00:00:00Z",
  },
  {
    id: "line-003",
    name: "Testing Line C",
    description:
      "Quality testing and inspection line — performs electrical testing, stress testing, and visual inspection.",
    location: "Building 2, Floor 1",
    isActive: true,
    createdAt: "2024-09-01T00:00:00Z",
  },
];
