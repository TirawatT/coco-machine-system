"use client";

import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { UserRole } from "@/types";

const roleBadgeVariants: Record<UserRole, string> = {
  [UserRole.ADMIN]: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  [UserRole.OPERATOR]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  [UserRole.INSPECTOR]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  [UserRole.VIEWER]:
    "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function RoleSwitcher() {
  const { currentUser, switchRole } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className="text-xs bg-yellow-50 text-yellow-700 border-yellow-300 dark:bg-yellow-900 dark:text-yellow-200 dark:border-yellow-700"
      >
        DEV
      </Badge>
      <Select
        value={currentUser.role}
        onValueChange={(value) => switchRole(value as UserRole)}
      >
        <SelectTrigger className="w-[160px] h-8 text-xs">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {Object.values(UserRole).map((role) => (
            <SelectItem key={role} value={role} className="text-xs">
              <div className="flex items-center gap-2">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${
                    role === UserRole.ADMIN
                      ? "bg-red-500"
                      : role === UserRole.OPERATOR
                        ? "bg-blue-500"
                        : role === UserRole.INSPECTOR
                          ? "bg-purple-500"
                          : "bg-gray-500"
                  }`}
                />
                {role}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export function RoleBadge() {
  const { currentUser } = useAuth();

  return (
    <Badge
      variant="outline"
      className={`text-xs ${roleBadgeVariants[currentUser.role]}`}
    >
      {currentUser.role}
    </Badge>
  );
}
