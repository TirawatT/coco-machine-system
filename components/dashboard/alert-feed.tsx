"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert } from "@/types";
import { formatDistanceToNow } from "date-fns";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";

interface AlertFeedProps {
  alerts: Alert[];
  maxItems?: number;
}

const alertConfig = {
  error: {
    icon: AlertCircle,
    dotColor: "bg-red-500",
    iconColor: "text-red-400",
    bgColor: "bg-red-500/5 border-red-500/10",
  },
  warning: {
    icon: AlertTriangle,
    dotColor: "bg-yellow-500",
    iconColor: "text-yellow-400",
    bgColor: "bg-yellow-500/5 border-yellow-500/10",
  },
  info: {
    icon: Info,
    dotColor: "bg-blue-500",
    iconColor: "text-blue-400",
    bgColor: "bg-blue-500/5 border-blue-500/10",
  },
};

export function AlertFeed({ alerts, maxItems = 10 }: AlertFeedProps) {
  const displayAlerts = alerts.slice(0, maxItems);

  if (displayAlerts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center mb-3">
          <svg
            className="h-5 w-5 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-sm font-medium">All Clear</p>
        <p className="text-xs">No active alerts</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[320px] pr-3">
      <div className="space-y-2">
        {displayAlerts.map((alert, index) => {
          const config = alertConfig[alert.type];
          const Icon = config.icon;
          const timeAgo = (() => {
            try {
              return formatDistanceToNow(new Date(alert.timestamp), {
                addSuffix: true,
              });
            } catch {
              return "";
            }
          })();

          return (
            <div
              key={alert.id}
              className={`flex items-start gap-3 rounded-lg border p-3 transition-all hover:bg-accent/50 animate-fade-in-up ${config.bgColor}`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${config.bgColor}`}
              >
                <Icon className={`h-3.5 w-3.5 ${config.iconColor}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold">{alert.title}</span>
                  {timeAgo && (
                    <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                      {timeAgo}
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  {alert.message}
                </p>
                {alert.machineName && (
                  <span className="inline-block mt-1 text-[10px] text-muted-foreground/70 bg-muted/30 rounded px-1.5 py-0.5">
                    {alert.machineName}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
