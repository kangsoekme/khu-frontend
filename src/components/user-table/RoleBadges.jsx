import React from "react";
import { roleBadgesMap } from "../badges/roles/roleBadgeMap";

function RoleBadges({ role }) {
  const BadgeComponent = roleBadgesMap[role];
  if (!BadgeComponent) return null;

  return <BadgeComponent />;
}

export default RoleBadges;
