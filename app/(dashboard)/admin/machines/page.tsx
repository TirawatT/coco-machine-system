"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { mockMachines } from "@/lib/mock-data";
import { MachineStatus } from "@/types";
import { Plus } from "lucide-react";

const statusBadge: Record<MachineStatus, string> = {
  [MachineStatus.RUNNING]: "bg-green-100 text-green-800",
  [MachineStatus.IDLE]: "bg-yellow-100 text-yellow-800",
  [MachineStatus.STOPPED]: "bg-red-100 text-red-800",
  [MachineStatus.MAINTENANCE]: "bg-orange-100 text-orange-800",
};

export default function MachinesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Machine Management
          </h1>
          <p className="text-muted-foreground">
            Create, edit, and manage machines
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Machine
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Model</TableHead>
                  <TableHead>Serial</TableHead>
                  <TableHead>Line</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Active</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockMachines.map((machine) => (
                  <TableRow key={machine.id}>
                    <TableCell className="font-medium">
                      {machine.name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {machine.model}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {machine.serialNumber}
                    </TableCell>
                    <TableCell>{machine.lineName}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={statusBadge[machine.status]}
                      >
                        {machine.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={machine.isActive ? "default" : "secondary"}
                      >
                        {machine.isActive ? "Yes" : "No"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
