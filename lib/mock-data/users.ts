import { User, UserRole } from "@/types";

export const mockUsers: User[] = [
  {
    id: "user-001",
    email: "admin@coco.com",
    name: "Somchai Admin",
    role: UserRole.ADMIN,
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
  },
  {
    id: "user-002",
    email: "operator1@coco.com",
    name: "Napat Operator",
    role: UserRole.OPERATOR,
    createdAt: "2025-01-05T00:00:00Z",
    updatedAt: "2025-01-05T00:00:00Z",
  },
  {
    id: "user-003",
    email: "operator2@coco.com",
    name: "Kanya Operator",
    role: UserRole.OPERATOR,
    createdAt: "2025-02-01T00:00:00Z",
    updatedAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "user-004",
    email: "inspector@coco.com",
    name: "Wichai Inspector",
    role: UserRole.INSPECTOR,
    createdAt: "2025-01-10T00:00:00Z",
    updatedAt: "2025-01-10T00:00:00Z",
  },
  {
    id: "user-005",
    email: "viewer@coco.com",
    name: "Ploy Viewer",
    role: UserRole.VIEWER,
    createdAt: "2025-03-01T00:00:00Z",
    updatedAt: "2025-03-01T00:00:00Z",
  },
];

export const defaultCurrentUser = mockUsers[0]; // Admin by default
