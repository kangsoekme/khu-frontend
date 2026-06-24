import React from "react";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { cn } from "@/lib/utils";

function ActivityLogItem({ className }) {
  return (
    <Item variant="outline" className="w-full">
      <ItemContent>
        <div className="flex xl:justify-between">
          <div className="flex gap-5">
            <div className="hidden xl:w-10 xl:flex items-center">
              <img
                src="https://ui-avatars.com/api/?name=John+Doe"
                alt=""
                srcset=""
                className="hidden xl:block  rounded-full"
              />
            </div>
            <div className="flex flex-col">
              <ItemTitle className="text-sm">Ahmad Fulan</ItemTitle>
              <ItemDescription className="hidden xl:block">
                Lorem ipsum dolor sit amet.
              </ItemDescription>
              <ItemDescription className="xl:hidden">
                Lorem ipsum dolor sit amet. | 00.00 WIB
              </ItemDescription>
            </div>
          </div>
          <div className="hidden xl:flex items-end">
            <p>00.00 WIB</p>
          </div>
        </div>
      </ItemContent>
    </Item>
  );
}

export default ActivityLogItem;
