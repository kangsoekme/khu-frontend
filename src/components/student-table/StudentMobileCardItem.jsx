import React, { useRef } from "react";

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
  isSelected,
  isSelectionMode,
  onToggleSelect,
}) {
  const timerRef = useRef(null);
  const longPressTriggered = useRef(false);

  const startPress = () => {
    if (isSelectionMode) return;
    longPressTriggered.current = false;
    timerRef.current = setTimeout(() => {
      longPressTriggered.current = true;
      onToggleSelect();
      if (window.navigator && window.navigator.vibrate) {
        window.navigator.vibrate(50);
      }
    }, 500);
  };

  const cancelPress = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const handleClick = (e) => {
    if (longPressTriggered.current) {
      longPressTriggered.current = false;
      return;
    }

    if (isSelectionMode) {
      onToggleSelect();
    } else {
      onClick(e);
    }
  };

  return (
    <Item
      variant="outline"
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onClick={handleClick}
      onContextMenu={(e) => {
        if (window.innerWidth < 1024) e.preventDefault();
      }}
      className={`cursor-pointer transition-all duration-200 select-none ${
        isSelected 
          ? "border-blue-500 bg-blue-50 shadow-sm ring-1 ring-blue-500" 
          : "hover:bg-neutral-textmuted"
      }`}
    >
      <ItemMedia className="shrink-0">
        <Avatar>
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
