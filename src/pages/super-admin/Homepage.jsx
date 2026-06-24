import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ChartAreaGradient } from "../../components/charts/ChartAreaGradient";
import { ChartPieDonutText } from "../../components/charts/ChartPieDonutText";

import { Button } from "@/components/ui/button";

import { useNavigate } from "react-router-dom";

import { TbUserPlus } from "react-icons/tb";
import { PiStudentBold } from "react-icons/pi";
import { FaBookQuran } from "react-icons/fa6";
import { LiaQuranSolid } from "react-icons/lia";

import QuickAccessCard from "../../components/quick-access/QuickAccessCard";
import ActivityCalendarCard from "../../components/activity-calendar/ActivityCalendarCard";
import ActivityLogCard from "../../components/activity-log/ActivityLogCard";
import TotalCard from "../../components/total-card/TotalCard";

function Homepage() {
  const navigate = useNavigate();

  const quickAccessItem = [
    {
      icon: TbUserPlus,
      title: "Manajemen User",
      description: "Kelola semua data user",
      path: "/manajemen-user",
    },
    {
      icon: PiStudentBold,
      title: "Manajemen Siswa",
      description: "Kelola semua data siswa",
      path: "/manajemen-user",
    },
    {
      icon: FaBookQuran,
      title: "Kelola Tahsin",
      description: "Kelola semua data Tahsin",
      path: "/tahsin",
    },
    {
      icon: LiaQuranSolid,
      title: "Kelola Tahfidz",
      description: "Kelola semua data Tahfidz",
      path: "/tahfidz",
    },
  ];

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="grid xl:grid-cols-8 xl:grid-rows-1 2xl:grid-cols-9 gap-5 items-stretch">
          <QuickAccessCard
            quickAccess={quickAccessItem}
            className="xl:col-span-3 2xl:col-span-3"
          />
          <ChartAreaGradient className="xl:col-span-3 2xl:col-span-4" />

          <ChartPieDonutText className="xl:col-span-2 2xl:col-span-2" />
        </div>
        <div className="grid xl:grid-cols-6 2xl:grid-cols-7 grid-rows-1 gap-5 items-stretch">
          <div className="flex flex-col xl:grid xl:col-span-4 2xl:col-span-5 xl:grid-cols-4 xl:grid-rows-3 gap-5 h-full">
            <TotalCard className="col-span-4" />
            <ActivityLogCard className="xl:col-span-4 xl:row-start-2 xl:row-span-2" />
          </div>
          <ActivityCalendarCard className="xl:col-span-2" />
        </div>
      </div>
    </>
  );
}

export default Homepage;
