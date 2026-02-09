"use client";

import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ProductionTrendChartProps {
  data: { date: string; output: number; scrap: number; yieldRate: number }[];
}

export function ProductionTrendChart({ data }: ProductionTrendChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="gradOutput" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.1} />
            </linearGradient>
            <linearGradient id="gradYield" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22c55e" stopOpacity={0.6} />
              <stop offset="100%" stopColor="#22c55e" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="hsl(var(--border))"
            strokeOpacity={0.5}
          />
          <XAxis
            dataKey="date"
            tickFormatter={(v) => {
              const d = new Date(v);
              return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            yAxisId="output"
            orientation="left"
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => v.toLocaleString()}
          />
          <YAxis
            yAxisId="yield"
            orientation="right"
            domain={[80, 100]}
            tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "10px",
              fontSize: "12px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
            }}
            labelFormatter={(v) => {
              const d = new Date(v);
              return d.toLocaleDateString("en-US", {
                weekday: "short",
                month: "short",
                day: "numeric",
              });
            }}
            formatter={(value: number, name: string) => {
              if (name === "Yield %") return [`${value}%`, name];
              return [value.toLocaleString(), name];
            }}
          />
          <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
          <Bar
            yAxisId="output"
            dataKey="output"
            name="Output"
            fill="url(#gradOutput)"
            radius={[4, 4, 0, 0]}
            barSize={28}
          />
          <Bar
            yAxisId="output"
            dataKey="scrap"
            name="Scrap"
            fill="#ef4444"
            fillOpacity={0.6}
            radius={[4, 4, 0, 0]}
            barSize={28}
          />
          <Area
            yAxisId="yield"
            type="monotone"
            dataKey="yieldRate"
            name="Yield %"
            stroke="#22c55e"
            strokeWidth={2.5}
            fill="url(#gradYield)"
            dot={{ fill: "#22c55e", r: 3, strokeWidth: 0 }}
            activeDot={{
              r: 5,
              fill: "#22c55e",
              stroke: "#fff",
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
