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
import AvatarGroupComponent from "../ui/AvatarGroupComponent";

function HalaqohCard() {
  return (
    <div className="">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Abu Bakar Ash Shiddiq</CardTitle>
          <CardDescription>Al Ustadz Ahmad Fulan</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-between">
          <AvatarGroupComponent />
          <CardDescription>10 siswa</CardDescription>
        </CardFooter>
      </Card>
    </div>
  );
}

export default HalaqohCard;
