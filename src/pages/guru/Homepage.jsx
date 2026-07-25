import { useGetGuruDashboardQuery } from "../../store/api/dashboardApi";
import { ChartAreaGradient } from "../../components/charts/ChartAreaGradient";
import { FaCalendarDay, FaCircleExclamation } from "react-icons/fa6";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { id } from "date-fns/locale";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";

import { AiOutlineSafety } from "react-icons/ai";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

function Homepage() {
  const { data: dashboardRes, isLoading } = useGetGuruDashboardQuery();

  const dashboardData = dashboardRes?.data;
  const summary = dashboardData?.summary;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const alerts = Array.isArray(dashboardData?.progress_alert)
    ? dashboardData.progress_alert
    : [];

  return (
    <div className="flex flex-col min-h-screen">
      <div className=" flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-lg border-0 transition-transform ">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-primmary-100">
                Total Siswa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">{summary?.total_siswa || 0}</p>
              <p className="text-sm text-primary-50 mt-1">
                Siswa di semua Halaqoh
              </p>
            </CardContent>
          </Card>

          <Card className="bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-lg border-0 transition-transform ">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium text-primmary-100">
                Total Halaqoh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-4xl font-bold">
                {summary?.total_halaqoh || 0}
              </p>
              <p className="text-sm text-primary-50 mt-1">
                Halaqoh yang diampu
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartAreaGradient
            dataPerkembangan={dashboardData?.chart_perkembangan}
            className="lg:col-span-2"
          />
          <Card className="shadow-sm border-border">
            <CardHeader className="pb-3">
              <CardTitle>Warning Student</CardTitle>
              <CardDescription>
                Siswa perlu bimbingan lebih intensif
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3 h-full">
              {alerts.length === 0 ? (
                <div className="flex flex-col items-center h-full justify-center">
                  <AiOutlineSafety
                    size={100}
                    className="text-neutral-textmuted"
                  />
                  <p className="text-sm text-neutral-textmuted text-center py-4 ">
                    Semua siswa dalam performa yang baik
                  </p>
                </div>
              ) : (
                alert.slice(0, 4).map((item, index) => (
                  <Item key={index} variant="outline">
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage
                          src={item.siswa.avatar}
                          className="grayscale"
                        />
                        <AvatarFallback>{item.siswa.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent className="gap-1">
                      <ItemTitle>{item.siswa}</ItemTitle>
                      <ItemDescription>{item.keterangan}</ItemDescription>
                    </ItemContent>
                  </Item>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default Homepage;
