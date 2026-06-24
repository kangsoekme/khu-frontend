import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TbUserPlus } from "react-icons/tb";

function QuickAccessButton({ icon, title, description }) {
  const Icon = icon;

  return (
    <>
      <Card className="h-full">
        <CardHeader className="flex flex-col justify-between flex-1">
          <Icon className="text-3xl" />
          <div className="flex flex-col gap-1">
            <CardTitle className="text-sm">{title}</CardTitle>
            <CardDescription className="text-xs">{description}</CardDescription>
          </div>
        </CardHeader>
      </Card>
    </>
  );
}

export default QuickAccessButton;
