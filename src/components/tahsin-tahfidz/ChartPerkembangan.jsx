"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
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

export function ChartPerkembangan({
  className,
  data = [],
  title = "Grafik Perkembangan Siswa",
  desc = "Riwayat capaian dari waktu ke waktu",
  dataKey = "score",
  label = "Nilai / Capaian",
}) {
  const chartConfig = {
    [dataKey]: {
      label: label,
      color: "var(--chart-1)",
    },
  };

  return (
    <Card className={`flex flex-col ${className}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        {data.length === 0 ? (
          <div className="flex h-full min-h-60 items-center justify-center text-sm font-medium text-neutral-400 border border-dashed rounded-lg my-4">
            Belum ada riwayat setoran untuk ditampilkan di grafik
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="h-full min-h-75 w-full"
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ left: 12, right: 12 }}
            >
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey={dataKey}
                type="natural"
                fill="#0D8ABC"
                fillOpacity={0.3}
                stroke="#0D8ABC"
                strokeWidth={3}
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default ChartPerkembangan;
