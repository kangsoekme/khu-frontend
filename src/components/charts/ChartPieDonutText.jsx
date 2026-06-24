"use client";

import * as React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";
import { cn } from "@/lib/utils";

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

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

export const description = "A donut chart with text";

const chartData = [
  { role: "super_admin", total: 3, fill: "var(--color-super_admin)" },
  { role: "direktur", total: 5, fill: "var(--color-direktur)" },
  { role: "muhassin", total: 10, fill: "var(--color-muhassin)" },
  { role: "muhaffidz", total: 10, fill: "var(--color-muhaffidz)" },
];

const chartConfig = {
  super_admin: {
    label: "Super Admin",
    color: "var(--chart-1)",
  },
  direktur: {
    label: "Direktur",
    color: "var(--chart-2)",
  },
  muhassin: {
    label: "Muhassin",
    color: "var(--chart-3)",
  },
  muhaffidz: {
    label: "Muhaffidz",
    color: "var(--chart-4)",
  },
};

export function ChartPieDonutText({ className }) {
  const totalUsers = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.total, 0);
  }, []);

  return (
    <Card className={cn("", className)}>
      <CardHeader className="items-center pb-0">
        <CardTitle>Skema Pengguna</CardTitle>
        <CardDescription>Akumulasi skema pengguna keseluruhan</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-62.5"
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
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalUsers.toLocaleString()}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <ScrollArea className="h-30 w-full  ">
          <Table>
            <TableBody>
              {chartData.map((item) => {
                return (
                  <TableRow className="flex justify-between">
                    <TableCell>{chartConfig[item.role]?.label}</TableCell>
                    <TableCell>{item.total}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardFooter>
    </Card>
  );
}
