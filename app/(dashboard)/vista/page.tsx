"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { mockVistaTours } from "@/lib/mock-data";
import { ExternalLink } from "lucide-react";

export default function VistaOverviewPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">3DVista Tours</h1>
        <p className="text-muted-foreground">
          360° virtual tours of production lines and machines
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockVistaTours.map((tour) => (
          <Card key={tour.id} className="overflow-hidden">
            <div
              className="relative bg-muted"
              style={{ paddingBottom: "56.25%" }}
            >
              <iframe
                src={tour.tourUrl}
                className="absolute inset-0 w-full h-full"
                title={tour.name}
                loading="lazy"
              />
            </div>
            <CardContent className="pt-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-medium">{tour.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {tour.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    {tour.lineName && (
                      <Badge variant="secondary" className="text-xs">
                        {tour.lineName}
                      </Badge>
                    )}
                    {tour.machineName && (
                      <Badge variant="outline" className="text-xs">
                        {tour.machineName}
                      </Badge>
                    )}
                  </div>
                </div>
                <a
                  href={tour.tourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
