"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { User, UserRole } from "@/types";
import { mockUsers, defaultCurrentUser } from "@/lib/mock-data";

interface AuthContextType {
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  hasPermission: (action: Permission) => boolean;
  allUsers: User[];
}

export type Permission =
  | "view:dashboard"
  | "view:lines"
  | "view:machines"
  | "view:production"
  | "view:sensors"
  | "view:downtime"
  | "view:measurement"
  | "view:vista"
  | "create:production"
  | "create:downtime"
  | "create:measurement"
  | "manage:lines"
  | "manage:machines"
  | "manage:users"
  | "manage:vista";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    "view:dashboard", "view:lines", "view:machines", "view:production",
    "view:sensors", "view:downtime", "view:measurement", "view:vista",
    "create:production", "create:downtime", "create:measurement",
    "manage:lines", "manage:machines", "manage:users", "manage:vista",
  ],
  [UserRole.OPERATOR]: [
    "view:dashboard", "view:lines", "view:machines", "view:production",
    "view:sensors", "view:downtime", "view:measurement", "view:vista",
    "create:production", "create:downtime",
  ],
  [UserRole.INSPECTOR]: [
    "view:dashboard", "view:lines", "view:machines", "view:production",
    "view:sensors", "view:downtime", "view:measurement", "view:vista",
    "create:measurement",
  ],
  [UserRole.VIEWER]: [
    "view:dashboard", "view:lines", "view:machines", "view:production",
    "view:sensors", "view:downtime", "view:measurement", "view:vista",
  ],
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User>(defaultCurrentUser);

  const switchRole = useCallback((role: UserRole) => {
    const user = mockUsers.find((u) => u.role === role);
    if (user) setCurrentUser(user);
  }, []);

  const hasPermission = useCallback(
    (action: Permission) => {
      return ROLE_PERMISSIONS[currentUser.role]?.includes(action) ?? false;
    },
    [currentUser.role]
  );

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        switchRole,
        hasPermission,
        allUsers: mockUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
