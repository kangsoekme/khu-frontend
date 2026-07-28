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

import { Checkbox } from "@/components/ui/checkbox";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";
import RoleBadges from "./RoleBadges";

function UserTableItem({
  profilePhoto,
  name,
  email,
  noTelp,
  role,
  lastLogin,
  onClick,
  isSelected,
  onToggleSelect,
}) {
  return (
    <TableRow onClick={onClick} className="cursor-pointer ">
      <TableCell onClick={(e) => e.stopPropagation()}>
        <Checkbox checked={isSelected} onCheckedChange={onToggleSelect} />
      </TableCell>
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
              {email} | {noTelp}
            </ItemDescription>
          </ItemContent>
        </Item>
      </TableCell>
      <TableCell>
        <RoleBadges role={role} />
      </TableCell>
    </TableRow>
  );
}

export default UserTableItem;
