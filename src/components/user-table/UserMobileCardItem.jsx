import React from "react";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import RoleBadges from "./RoleBadges";

function UserMobileCardItem({
  profilePhoto,
  name,
  email,
  noTelp,
  role,
  onClick,
}) {
  return (
    <>
      <Item
        variant="outline"
        onClick={onClick}
        className="cursor-pointer hover:bg-neutral-textmuted transition-colors"
      >
        <ItemMedia>
          <Avatar className="flex items-center h-full">
            <AvatarImage src={profilePhoto} className="grayscale" />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent className="w-full">
          <div className="flex flex-col gap-1">
            <ItemTitle className="w-full">
              <div className="flex justify-between items-center w-full">
                <span>{name}</span>
                <div className="scale-70 origin-right flex items-center">
                  <RoleBadges role={role} />
                </div>
              </div>
            </ItemTitle>
            <ItemDescription className="text-xs">
              {email} | {noTelp}
            </ItemDescription>
          </div>
        </ItemContent>
      </Item>
    </>
  );
}

export default UserMobileCardItem;
