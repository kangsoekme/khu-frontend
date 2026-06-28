import React from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function StudentTableItem({
  profilePhoto,
  name,
  nis,
  alamat,
  kelas,
  waliSiswa,
}) {
  return (
    <>
      <TableRow>
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
                {nis} | {alamat}
              </ItemDescription>
            </ItemContent>
          </Item>
        </TableCell>
        <TableCell>{kelas}</TableCell>
        <TableCell>{waliSiswa}</TableCell>
      </TableRow>
    </>
  );
}

export default StudentTableItem;
