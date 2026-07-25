import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { RiAlarmFill } from "react-icons/ri";
import { Calendar } from "@/components/ui/calendar";
import ActivityLogItem from "../activity-log/ActivityLogItem";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import { cn } from "@/lib/utils";
import ActivityCalendarItem from "./ActivityCalendarItem";

function ActivityCalendarCard({ className }) {
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex flex-col">
            <CardTitle>Kalender Kegiatan</CardTitle>
            <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
          </div>
          <RiAlarmFill className="text-4xl" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5 items-center">
        <div className="w-full [&&>*]:w-full">
          <Calendar mode="single" className="rounded-lg border p-6" />
        </div>
        <ScrollArea className="h-50 w-full">
          <div className="flex flex-col flex-1 w-full gap-5">
            <ActivityCalendarItem />
            <ActivityCalendarItem />
            <ActivityCalendarItem />
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

export default ActivityCalendarCard;
