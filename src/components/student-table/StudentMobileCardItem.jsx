import React from "react";

import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function StudentMobileCardItem({
  profilePhoto,
  name,
  nis,
  alamat,
  kelas,
  waliSiswa,
  onClick,
}) {
  return (
    <Item variant="outline" onClick={onClick}>
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
            </div>
          </ItemTitle>
          <ItemDescription className="text-xs">
            {nis} | {kelas} | {waliSiswa}
          </ItemDescription>
        </div>
      </ItemContent>
    </Item>
  );
}

export default StudentMobileCardItem;
