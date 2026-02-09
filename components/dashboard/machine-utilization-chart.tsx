"use client";

import {
  Cell,
  Label,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface MachineUtilizationChartProps {
  data: {
    running: number;
    idle: number;
    stopped: number;
    maintenance: number;
    total: number;
  };
}

const COLORS = {
  Running: "#22c55e",
  Idle: "#eab308",
  Stopped: "#ef4444",
  Maintenance: "#f97316",
};

export function MachineUtilizationChart({
  data,
}: MachineUtilizationChartProps) {
  const chartData = [
    { name: "Running", value: data.running, fill: COLORS.Running },
    { name: "Idle", value: data.idle, fill: COLORS.Idle },
    { name: "Stopped", value: data.stopped, fill: COLORS.Stopped },
    { name: "Maintenance", value: data.maintenance, fill: COLORS.Maintenance },
  ].filter((d) => d.value > 0);

  return (
    <div className="flex flex-col items-center">
      <div className="h-[220px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={65}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 8}
                          className="fill-foreground text-2xl font-bold"
                        >
                          {data.running}/{data.total}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 12}
                          className="fill-muted-foreground text-xs"
                        >
                          Running
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                fontSize: "12px",
              }}
              formatter={(value: number, name: string) => [
                `${value} machine${value !== 1 ? "s" : ""}`,
                name,
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {chartData.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5">
            <div
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.fill }}
            />
            <span className="text-xs text-muted-foreground">
              {entry.name}{" "}
              <span className="font-medium text-foreground">{entry.value}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
