import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemActions,
  ItemTitle,
} from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Badge } from "@/components/ui/badge";

function MobileItemCard({
  avatar,
  title,
  subtitle,
  statusText,
  badgeText,
  onClick,
}) {
  return (
    <Item
      variant="outline"
      className="cursor-pointer hover:bg-neutral-50 transition-colors"
      onClick={onClick}
    >
      <ItemMedia>
        <Avatar className="h-12 w-12">
          <AvatarImage src={avatar} className="grayscale" />
          <AvatarFallback className=" text-primary-700 font-bold">
            {title?.charAt(0) || "-"}
          </AvatarFallback>
        </Avatar>
      </ItemMedia>

      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        <ItemDescription>
          {subtitle} | {statusText}
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge>{badgeText}</Badge>
      </ItemActions>
    </Item>
  );
}

export default MobileItemCard;
