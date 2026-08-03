import React from "react";

import { TableCell, TableRow } from "@/components/ui/table";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function PretestTableItem({
  profilePhoto,
  name,
  nis,
  waliSiswa,
  kelas,
  tahapan,
  onClick,
}) {
  // FE-4: gunakan inisial nama dinamis, bukan hardcode 'CN'
  const initials = (name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase() || "")
    .join("") || "?";

  return (
    <>
      <TableRow onClick={onClick}>
        <TableCell>
          <Item>
            <ItemMedia>
              <Avatar>
                <AvatarImage src={profilePhoto} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemTitle>{name}</ItemTitle>
              <ItemDescription>
                {nis} | {waliSiswa}
              </ItemDescription>
            </ItemContent>
          </Item>
        </TableCell>
        <TableCell>{kelas}</TableCell>
        <TableCell>{tahapan}</TableCell>
      </TableRow>
    </>
  );
}

export default PretestTableItem;
