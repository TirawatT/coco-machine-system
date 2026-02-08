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
import { getMachinesByLine, mockLines } from "@/lib/mock-data";
import { Plus } from "lucide-react";

export default function LinesAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Line Management</h1>
          <p className="text-muted-foreground">
            Create, edit, and manage production lines
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Line
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Machines</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockLines.map((line) => {
                const machines = getMachinesByLine(line.id);
                return (
                  <TableRow key={line.id}>
                    <TableCell className="font-medium">{line.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {line.location}
                    </TableCell>
                    <TableCell>{machines.length}</TableCell>
                    <TableCell>
                      <Badge variant={line.isActive ? "default" : "secondary"}>
                        {line.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {line.createdAt.split("T")[0]}
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
