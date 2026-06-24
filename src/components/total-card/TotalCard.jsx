import React from "react";

import { cn } from "@/lib/utils";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LuUsers } from "react-icons/lu";
import { TbSchool } from "react-icons/tb";

function TotalCard({ className }) {
  return (
    <>
      <div className={cn("grid xl:grid-cols-4 gap-5", className)}>
        <Card className="flex flex-col justify-between xl:col-span-2">
          <CardContent>
            <div className="p-4 bg-primary-600 w-fit rounded-xl">
              <LuUsers className="text-xl text-neutral-white" />
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle className="font-bold text-4xl">20</CardTitle>
            <CardDescription className="text-lg">
              MUHASSIN / MUHAFFIDZ
            </CardDescription>
            <CardDescription className="text-sm">
              10 Muhassin - 10 Muhaffidz
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="flex flex-col justify-between xl:col-span-2">
          <CardContent>
            <div className="p-4 bg-primary-600 w-fit rounded-xl">
              <TbSchool className="text-xl text-neutral-white" />
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle className="font-bold text-4xl">20</CardTitle>
            <CardDescription className="text-lg">Total Siswa</CardDescription>
            <CardDescription className="text-sm">
              10 Laki Laki - 10 Perempuan
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </>
  );
}

export default TotalCard;
