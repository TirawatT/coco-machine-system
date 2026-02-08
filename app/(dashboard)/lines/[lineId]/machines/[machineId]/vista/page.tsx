"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMachine } from "@/hooks/use-machines";
import { getVistaTourByMachine } from "@/lib/mock-data";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { use } from "react";

export default function VistaPage({
  params,
}: {
  params: Promise<{ lineId: string; machineId: string }>;
}) {
  const { lineId, machineId } = use(params);
  const { data: machine } = useMachine(machineId);
  const tour = getVistaTourByMachine(machineId);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/lines/${lineId}/machines/${machineId}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">3DVista Tour</h1>
          <p className="text-muted-foreground">
            {machine?.name} — 360° Virtual Tour
          </p>
        </div>
        {tour && (
          <a href={tour.tourUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="outline" size="sm">
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Open Full Screen
            </Button>
          </a>
        )}
      </div>

      {tour ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">{tour.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{tour.description}</p>
          </CardHeader>
          <CardContent>
            <div
              className="relative w-full rounded-lg overflow-hidden border"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src={tour.tourUrl}
                className="absolute inset-0 w-full h-full"
                allowFullScreen
                title={tour.name}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">
                No 3DVista tour available for this machine
              </p>
              <p className="text-sm text-muted-foreground">
                Contact admin to add a virtual tour for {machine?.name}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
