import { VistaTour } from "@/types";

export const mockVistaTours: VistaTour[] = [
  {
    id: "vista-001",
    machineId: null,
    lineId: "line-001",
    lineName: "Assembly Line A",
    tourUrl: "https://www.3dvista.com/demos/gallery/CorvinCastle/",
    thumbnailUrl: "/placeholder-vista-1.jpg",
    name: "Assembly Line A — Full Tour",
    description:
      "360° virtual tour of Assembly Line A showing all 4 machines and workstations",
    createdAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "vista-002",
    machineId: "machine-001",
    machineName: "SMT Placer A1",
    lineId: "line-001",
    lineName: "Assembly Line A",
    tourUrl: "https://www.3dvista.com/demos/gallery/CorvinCastle/",
    thumbnailUrl: "/placeholder-vista-2.jpg",
    name: "SMT Placer A1 — Machine Detail",
    description:
      "Detailed 360° view of SMT Placer A1 with interactive hotspots for each component",
    createdAt: "2025-06-15T00:00:00Z",
  },
  {
    id: "vista-003",
    machineId: null,
    lineId: "line-002",
    lineName: "Packaging Line B",
    tourUrl: "https://www.3dvista.com/demos/gallery/CorvinCastle/",
    thumbnailUrl: "/placeholder-vista-3.jpg",
    name: "Packaging Line B — Overview",
    description:
      "360° walkthrough of the entire packaging line from labeling to palletizing",
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "vista-004",
    machineId: null,
    lineId: "line-003",
    lineName: "Testing Line C",
    tourUrl: "https://www.3dvista.com/demos/gallery/CorvinCastle/",
    thumbnailUrl: "/placeholder-vista-4.jpg",
    name: "Testing Line C — Quality Lab",
    description: "Virtual tour of the testing and quality inspection area",
    createdAt: "2025-09-01T00:00:00Z",
  },
];
