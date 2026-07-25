"use client";

import * as React from "react";
import { Label, Pie, PieChart, Cell } from "recharts";
import { cn } from "@/lib/utils";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const chartConfig = {
  MUMTAZ: { label: "Mumtaz", color: "#10b981" },
  JAYYID_JIDDAN: { label: "Jayyid Jiddan", color: "#3b82f6" },
  JAYYID: { label: "Jayyid", color: "#f59e0b" },
  MAQBUL: { label: "Maqbul", color: "#6366f1" },
  DHAIF: { label: "Dhaif", color: "#ef4444" },
};

export function ChartPiePredikat({ className, dataPie }) {
  const chartData = dataPie || [];

  const totalUsers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (curr.total || 0), 0);
  }, [chartData]);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="items-center pb-2">
        <CardTitle>Distribusi Predikat Tahfidz</CardTitle>
        <CardDescription>Pekan Terakhir</CardDescription>
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="h-[280px] w-full">
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="predikat"
              innerRadius={70}
              outerRadius={95}
              strokeWidth={3}
              paddingAngle={2}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={chartConfig[entry.predikat]?.color || "#1f4084"}
                />
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
                          y={(viewBox.cy || 0) - 20}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 14}
                          className="fill-muted-foreground text-xs"
                        >
                          Siswa
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="predikat" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
