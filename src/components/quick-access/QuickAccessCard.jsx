import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import QuickAccessButton from "./QuickAccessButton";
import { useNavigate } from "react-router-dom";

import { cn } from "@/lib/utils";

function QuickAccessCard({ quickAccess, className }) {
  const navigate = useNavigate();

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader>
        <CardTitle>Quick Access</CardTitle>
        <CardDescription>Lorem ipsum dolor sit amet.</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4 flex-1 content-stretch">
        {quickAccess.map((item, index) => (
          <QuickAccessButton
            key={index}
            icon={item.icon}
            title={item.title}
            description={item.description}
            onClick={() => navigate(item.path)}
          />
        ))}
      </CardContent>
    </Card>
  );
}

export default QuickAccessCard;
