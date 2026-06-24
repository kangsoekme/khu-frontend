import React from "react";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { FaRegCalendarCheck } from "react-icons/fa";

function ActivityCalendarItem() {
  return (
    <Item variant="outline">
      <div className="flex justify-between w-full items-center">
        <div className="flex flex-col">
          <ItemTitle>Lorem Ipsum</ItemTitle>
          <ItemDescription>20 Juni 2026</ItemDescription>
        </div>
        <FaRegCalendarCheck className="text-xl" />
      </div>
    </Item>
  );
}

export default ActivityCalendarItem;
