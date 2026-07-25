"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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

import { cn } from "@/lib/utils";

export const description = "A donut chart with text";

const chartConfig = {
  super_admin: { label: "Super Admin", color: "var(--color-primary-800)" },
  direktur: { label: "Direktur", color: "var(--color-role-direktur-icon)" },
  guru: { label: "Guru", color: "var(--color-primary-300)" },
};

export function ChartPieDonutText({ className, dataPie }) {
  const chartData = dataPie || [];

  const totalUsers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + (curr.total || 0), 0);
  }, [chartData]);

  return (
    <Card className={cn("flex flex-col", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Skema Pengguna</CardTitle>
        <CardDescription>Distribusi peran di sistem</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className=" h-full min-h-62.5 w-full"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="total"
              nameKey="role"
              innerRadius={60}
              strokeWidth={5}
            >
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
                          y={(viewBox.cy || 0) - 18}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 8}
                          className="fill-muted-foreground text-xs"
                        >
                          Pengguna
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey="role" />} />
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
