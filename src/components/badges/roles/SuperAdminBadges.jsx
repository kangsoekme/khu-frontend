import React from "react";

import { Badge } from "@/components/ui/badge";

function SuperAdminBadges() {
  return (
    <Badge
      variant="default"
      className="bg-role-admin-text text-role-admin-bg px-4 py-3"
    >
      SUPER ADMIN
    </Badge>
  );
}

export default SuperAdminBadges;
