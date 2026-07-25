"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
} from "@/components/ui/chart";

import { cn } from "@/lib/utils";

export const description = "A bar chart";

function ChartBarPredikat({ dataTahsin, className }) {
  const chartData = dataTahsin || [];

  const chartConfig = {
    total: { label: "Total", color: "#1f4084" },
  };

  return (
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardHeader>
        <CardTitle>Distribusi Predikat Tahsin</CardTitle>
        <CardDescription>Pekan Terakhir</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer className="w-full h-70" config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="nilai"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={true} content={<ChartTooltipContent />} />
            <Bar
              dataKey="total"
              radius={8}
              style={{ fill: "var(--color-primary-600)", opacity: 1 }}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default ChartBarPredikat;
