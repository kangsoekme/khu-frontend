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
  return (
    <>
      <TableRow onClick={onClick}>
        <TableCell>
          <Item>
            <ItemMedia>
              <Avatar>
                <AvatarImage src={profilePhoto} />
                <AvatarFallback>CN</AvatarFallback>
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
