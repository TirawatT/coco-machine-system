"use client";

import { type LucideIcon } from "lucide-react";

interface KpiCardProps {
  title: string;
  value: string | number;
  suffix?: string;
  subtitle?: string;
  icon: LucideIcon;
  gradient: string;
  trend?: {
    value: number;
    label: string;
    isPositive?: boolean;
  };
  className?: string;
}

export function KpiCard({
  title,
  value,
  suffix = "",
  subtitle,
  icon: Icon,
  gradient,
  trend,
  className = "",
}: KpiCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl ${gradient} p-5 text-white shadow-lg transition-transform hover:scale-[1.02] hover:shadow-xl ${className}`}
    >
      {/* Watermark Icon */}
      <div className="absolute -right-3 -top-3 opacity-[0.08]">
        <Icon className="h-24 w-24" strokeWidth={1} />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
            <Icon className="h-4 w-4" />
          </div>
          <span className="text-xs font-medium uppercase tracking-wider text-white/70">
            {title}
          </span>
        </div>

        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-bold tracking-tight animate-count-up">
            {value}
          </span>
          {suffix && (
            <span className="text-lg font-medium text-white/70">{suffix}</span>
          )}
        </div>

        {(trend || subtitle) && (
          <div className="mt-2 flex items-center gap-2">
            {trend && (
              <span
                className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                  trend.isPositive
                    ? "bg-emerald-400/20 text-emerald-300"
                    : "bg-red-400/20 text-red-300"
                }`}
              >
                {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
              </span>
            )}
            {subtitle && (
              <span className="text-xs text-white/50">{subtitle}</span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
