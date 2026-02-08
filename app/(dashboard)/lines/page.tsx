"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLines } from "@/hooks/use-lines";
import { ArrowRight, Cpu, Factory } from "lucide-react";
import Link from "next/link";

export default function LinesPage() {
  const { data: lines } = useLines();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Production Lines</h1>
        <p className="text-muted-foreground">
          Overview of all manufacturing lines and their machines
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lines.map((line) => (
          <Link key={line.id} href={`/lines/${line.id}`}>
            <Card className="hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center gap-2">
                  <Factory className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">{line.name}</CardTitle>
                </div>
                <Badge variant={line.isActive ? "default" : "secondary"}>
                  {line.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {line.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <Cpu className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className="font-medium">{line.machineCount}</span>
                      <span className="text-muted-foreground">machines</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-green-500" />
                      <span className="text-green-600">
                        {line.runningCount}
                      </span>
                      <span className="text-muted-foreground">/</span>
                      <span className="h-2 w-2 rounded-full bg-red-500" />
                      <span className="text-red-600">{line.stoppedCount}</span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {line.location}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
