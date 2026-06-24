import React from "react";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { cn } from "@/lib/utils";
import ActivityLogItem from "./ActivityLogItem";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

function ActivityLogCard({ className }) {
  return (
    <Card className={cn("w-full xl:h-full xl:flex xl:flex-col", className)}>
      <CardHeader>
        <CardTitle>Log Activity</CardTitle>
        <CardDescription>Pantau aktivitas pengguna</CardDescription>
      </CardHeader>
      <CardContent className="xl:flex-1 xl:flex xl:flex-col xl:min-h-0">
        <ScrollArea className="h-90 w-full ">
          <div className="flex flex-col gap-5">
            <ActivityLogItem />
            <ActivityLogItem />
            <ActivityLogItem />
            <ActivityLogItem />
            <ActivityLogItem />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default ActivityLogCard;
