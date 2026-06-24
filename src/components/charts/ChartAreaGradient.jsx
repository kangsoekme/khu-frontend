"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

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

export const description = "An area chart with gradient fill";

const chartData = [
  { month: "10 Feb", tahsin_qiraah: 186, tahfiz_quran: 80 },
  { month: "11 Feb", tahsin_qiraah: 305, tahfiz_quran: 200 },
  { month: "12 Feb", tahsin_qiraah: 237, tahfiz_quran: 120 },
  { month: "13 Feb", tahsin_qiraah: 73, tahfiz_quran: 190 },
  { month: "14 Feb", tahsin_qiraah: 209, tahfiz_quran: 130 },
  { month: "15 Feb", tahsin_qiraah: 214, tahfiz_quran: 140 },
  { month: "16 Feb", tahsin_qiraah: 225, tahfiz_quran: 157 },
];

const chartConfig = {
  tahsin_qiraah: {
    label: "Tahsin Qiraah",
    color: "var(--chart-1)",
  },
  tahfiz_quran: {
    label: "Tahfidz Quran",
    color: "var(--chart-2)",
  },
};

export function ChartAreaGradient({ className }) {
  return (
    <Card
      className={cn("flex flex-col justify-between h-fit xl:h-full", className)}
    >
      <CardHeader>
        <CardTitle>Analisis Perkembangan</CardTitle>
        <CardDescription>
          Analisis perkembangan dalam satu pekan
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 ">
        <ChartContainer config={chartConfig} className="h-60 xl:h-full w-full">
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 0,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
              padding={{ left: 10, right: 10 }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillTahsin" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tahsin_qiraah)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tahsin_qiraah)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillTahfidz" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tahfiz_quran)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tahfiz_quran)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="tahfiz_quran"
              type="natural"
              fill="url(#fillTahfidz)"
              fillOpacity={0.4}
              stroke="var(--color-tahfiz_quran)"
              stackId="a"
            />
            <Area
              dataKey="tahsin_qiraah"
              type="natural"
              fill="url(#fillTahsin)"
              fillOpacity={0.4}
              stroke="var(--color-tahsin_qiraah)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
