"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

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
} from "@/components/ui/chart";

import { cn } from "@/lib/utils";

export const description = "An area chart with gradient fill";

const chartConfig = {
  tahsin_qiraah: {
    label: "Tahsin",
    color: "var(--color-role-muhassin-text)",
  },
  tahfidz_quran: {
    label: "Tahfidz",
    color: "var(--color-role-direktur-text)",
  },
};

export function ChartAreaGradient({ className, dataPerkembangan }) {
  const chartData = (dataPerkembangan || []).slice(-7);

  return (
    <Card className={cn("flex flex-col justify-between", className)}>
      <CardHeader>
        <CardTitle>Analisis Perkembangan</CardTitle>
        <CardDescription>Grafik Setoran dalam Satu Pekan</CardDescription>
      </CardHeader>
      <CardContent className=" ">
        <ChartContainer className="w-full h-70" config={chartConfig}>
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <YAxis domain={[0, "auto"]} hide={true} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-role-muhassin-text)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-role-muhassin-text)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-role-muhaffidz-text)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-role-muhaffidz-text)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="tahsin_qiraah"
              type="monotone"
              fill="url(#fillMobile)"
              fillOpacity={0.4}
              stroke="var(--color-role-muhaffidz-text)"
            />
            <Area
              dataKey="tahfidz_quran"
              type="monotone"
              fill="url(#fillDesktop)"
              fillOpacity={0.4}
              stroke="var(--color-role-muhassin-text)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
