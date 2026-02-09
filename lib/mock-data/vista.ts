import { VistaTour } from "@/types";

export const mockVistaTours: VistaTour[] = [
  {
    id: "vista-001",
    machineId: null,
    lineId: "line-001",
    lineName: "Assembly Line A",
    tourUrl: "https://my.matterport.com/show/?m=7ffnfBNamei",
    thumbnailUrl:
      "https://my.matterport.com/api/v1/player/models/7ffnfBNamei/thumb?width=800",
    name: "Assembly Line A — Full Tour",
    description:
      "360° virtual tour of Assembly Line A — warehouse, production area and workstations walkthrough",
    createdAt: "2025-06-01T00:00:00Z",
  },
  {
    id: "vista-002",
    machineId: "machine-001",
    machineName: "SMT Placer A1",
    lineId: "line-001",
    lineName: "Assembly Line A",
    tourUrl: "https://my.matterport.com/show/?m=uB2E3DXZZL5",
    thumbnailUrl:
      "https://my.matterport.com/api/v1/player/models/uB2E3DXZZL5/thumb?width=800",
    name: "SMT Placer A1 — Machine Detail",
    description:
      "Detailed 360° view of SMT Placer A1 machine area with interactive hotspots for each component",
    createdAt: "2025-06-15T00:00:00Z",
  },
  {
    id: "vista-003",
    machineId: null,
    lineId: "line-002",
    lineName: "Packaging Line B",
    tourUrl: "https://my.matterport.com/show/?m=Q3tJNr4Moyx",
    thumbnailUrl:
      "https://my.matterport.com/api/v1/player/models/Q3tJNr4Moyx/thumb?width=800",
    name: "Packaging Line B — Overview",
    description:
      "360° industrial scanning walkthrough of the entire packaging line from labeling to palletizing",
    createdAt: "2025-08-01T00:00:00Z",
  },
  {
    id: "vista-004",
    machineId: null,
    lineId: "line-003",
    lineName: "Testing Line C",
    tourUrl: "https://my.matterport.com/show/?m=hcGmJG8kMtJ",
    thumbnailUrl:
      "https://my.matterport.com/api/v1/player/models/hcGmJG8kMtJ/thumb?width=800",
    name: "Testing Line C — Quality Lab",
    description:
      "Virtual tour of the cleanroom testing and quality inspection area",
    createdAt: "2025-09-01T00:00:00Z",
  },
  {
    id: "vista-005",
    machineId: "machine-005",
    machineName: "Labeler B1",
    lineId: "line-002",
    lineName: "Packaging Line B",
    tourUrl: "https://my.matterport.com/show/?m=CwMGYNx4MyN",
    thumbnailUrl:
      "https://my.matterport.com/api/v1/player/models/CwMGYNx4MyN/thumb?width=800",
    name: "Labeler B1 — Machine Detail",
    description:
      "360° view of the Labeler B1 station with close-up of labeling mechanism and control panel",
    createdAt: "2025-10-01T00:00:00Z",
  },
  {
    id: "vista-006",
    machineId: "machine-009",
    machineName: "AOI Tester C1",
    lineId: "line-003",
    lineName: "Testing Line C",
    tourUrl: "https://my.matterport.com/show/?m=fvVXVn144wg",
    thumbnailUrl:
      "https://my.matterport.com/api/v1/player/models/fvVXVn144wg/thumb?width=800",
    name: "AOI Tester C1 — Inspection Bay",
    description:
      "High-tech inspection area featuring automated optical inspection equipment and testing stations",
    createdAt: "2025-11-01T00:00:00Z",
  },
];
