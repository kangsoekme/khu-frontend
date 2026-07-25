import React from "react";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

function HalaqohItem({ halaqoh, onClick }) {
  return (
    <>
      <Item
        variant="shadow"
        onClick={onClick}
        className="cursor-pointer bg-neutral-bg hover:bg-neutral-surface "
      >
        <ItemContent className="flex flex-col gap-3">
          <ItemTitle className="xl:text-xl">{halaqoh.nama_halaqoh}</ItemTitle>
          <div className=" flex flex-col items-start ">
            <ItemDescription>Al Ustadz {halaqoh.guru?.nama}</ItemDescription>
            <ItemDescription>{halaqoh.siswa.length} siswa</ItemDescription>
          </div>
        </ItemContent>
      </Item>
    </>
  );
}

export default HalaqohItem;
