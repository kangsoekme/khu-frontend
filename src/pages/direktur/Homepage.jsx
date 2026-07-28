import { useGetDirekturDashboardQuery } from "../../store/api/dashboardApi";
import ChartBarPredikat from "../../components/charts/ChartBarPredikat";
import { ChartPiePredikat } from "../../components/charts/ChartPiePredikat";
import { ChartAreaGradient } from "../../components/charts/ChartAreaGradient";
import { TbUserPlus } from "react-icons/tb";
import { FaBookQuran } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";
import { PiExamFill } from "react-icons/pi";

import { FaNoteSticky } from "react-icons/fa6";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

function Homepage() {
  const navigate = useNavigate();
  const { data: dashboardRes, isLoading } = useGetDirekturDashboardQuery();

  const data = dashboardRes?.data;
  const summary = data?.summary;

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-lg border-0 ">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-primmary-100">
              Total Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold">
              {summary?.guru?.total +
                (data?.chart_skema_pengguna?.find((x) => x.role === "direktur")
                  ?.total || 0)}
            </p>
            <p className="text-sm text-primary-50 mt-1">
              Guru & Direktur Aktif
            </p>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-lg border-0 ">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-primmary-100">
              Total Siswa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold">{summary?.siswa?.total || 0}</p>
            <p className="text-sm text-primary-50 mt-1">
              {summary?.siswa?.laki_laki} Laki Laki |{" "}
              {summary?.siswa?.perempuan} Perempuan
            </p>
          </CardContent>
        </Card>
        <Card className="bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-lg border-0 ">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-primmary-100">
              Menunggu Persetujuan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-6xl font-bold">
              {data?.alerts?.menunggu_persetujuan || 0}
            </p>
            <p className="text-sm text-primary-50 mt-1">
              Pengajuan Ujian Kenaikan Jilid
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="lg:col-span-1 shadow-sm border-border bg-card h-full">
        <CardHeader>
          <CardTitle className="text-neutral-textprimary">
            Quick Access
          </CardTitle>
          <CardDescription className="text-neutral-textmuted">
            Pintasan utama sistem
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 lg:grid-cols-5 gap-3">
          <Item
            variant="outline"
            onClick={() => navigate("/manajemen-halaqoh")}
            className="bg-primary-600 text-primary-50 hover:bg-primary-50 hover:text-primary-600 cursor-pointer"
          >
            <ItemMedia variant="icon" className="flex items-center">
              <TbUserPlus />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                Kelola <br />
                Semua Halaqoh
              </ItemTitle>
            </ItemContent>
          </Item>
          <Item
            variant="outline"
            onClick={() => navigate("/tahsin")}
            className="bg-primary-600 text-primary-50 hover:bg-primary-50 hover:text-primary-600 cursor-pointer"
          >
            <ItemMedia variant="icon" className="flex items-center">
              <FaBookQuran />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                Pantau <br />
                Tahsin Qiraah
              </ItemTitle>
            </ItemContent>
          </Item>
          <Item
            variant="outline"
            onClick={() => navigate("/tahfidz")}
            className="bg-primary-600 text-primary-50 hover:bg-primary-50 hover:text-primary-600 cursor-pointer"
          >
            <ItemMedia variant="icon" className="flex items-center">
              <FaBookQuran />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                Pantau <br />
                Tahfidz Quran
              </ItemTitle>
            </ItemContent>
          </Item>
          <Item
            variant="outline"
            onClick={() => navigate("/pretest")}
            className="bg-primary-600 text-primary-50 hover:bg-primary-50 hover:text-primary-600 cursor-pointer"
          >
            <ItemMedia variant="icon" className="flex items-center">
              <FaNoteSticky />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                Uji <br />
                Placement Test
              </ItemTitle>
            </ItemContent>
          </Item>
          <Item
            variant="outline"
            onClick={() => navigate("/tahsin/ujian-kenaikan")}
            className="bg-primary-600 text-primary-50 hover:bg-primary-50 hover:text-primary-600 cursor-pointer"
          >
            <ItemMedia variant="icon" className="flex items-center">
              <PiExamFill />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                Uji <br />
                Kenaikan Jilid
              </ItemTitle>
            </ItemContent>
          </Item>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-7 2xl:grid-cols-5 gap-6">
        <ChartBarPredikat
          dataTahsin={data?.chart_tahsin}
          className="lg:col-span-5 2xl:col-span-2 shadow-sm border-border h-full"
        />
        <ChartPiePredikat
          dataPie={data?.chart_tahfidz}
          className="lg:col-span-2 2xl:col-span-1 shadow-sm border-border h-full"
        />
        <ChartAreaGradient
          dataPerkembangan={data?.chart_perkembangan}
          className="lg:col-span-7 2xl:col-span-2 shadow-sm border-border h-full"
        />
      </div>
    </div>
  );
}

export default Homepage;
