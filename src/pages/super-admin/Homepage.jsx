import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TbUserPlus } from "react-icons/tb";
import { PiStudentBold } from "react-icons/pi";
import { FiDatabase } from "react-icons/fi";
import { ChartAreaGradient } from "../../components/charts/ChartAreaGradient";
import { ChartPieDonutText } from "../../components/charts/ChartPieDonutText";
import { useGetSuperAdminDashboardQuery } from "../../store/api/dashboardApi";
import { useNavigate } from "react-router-dom";

function Homepage() {
  const navigate = useNavigate();

  const { data: dashboardRes, isLoading } = useGetSuperAdminDashboardQuery();

  if (isLoading) {
    return (
      <p className="text-center mt-10 text-neutral-textmuted animate-pulse">
        Memuat Dashboard..
      </p>
    );
  }

  const data = dashboardRes?.data;
  const summary = data?.summary;
  const systemStatus = data?.system_status;
  const systemLogs = data?.system_logs;

  return (
    <div className="flex flex-col gap-6 p-2 md:p-4 animate-in fade-in duration-500">
      {/* header */}

      {/* quick stats */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-lg border-0 transition-transform ">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-primmary-100">
              Total Pengguna
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">
              {(summary?.guru?.total || 0) +
                (data?.chart_skema_pengguna?.find((x) => x.role === "direktur")
                  ?.total || 0)}
            </p>
            <p className="text-sm text-primary-50 mt-1">
              Guru & Direktur Aktif
            </p>
          </CardContent>
        </Card>

        <Card className="bg-linear-to-br from-primary-600 to-primary-800 text-white shadow-lg border-0 transition-transform ">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium text-primmary-100">
              Total Siswa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{summary?.siswa?.total}</p>
            <p className="text-sm text-primary-50 mt-1">
              {summary?.siswa?.laki_laki} Laki Laki |{" "}
              {summary?.siswa?.perempuan} Perempuan
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
              {(summary?.halaqoh?.tahsin || 0) +
                (summary?.halaqoh?.tahfidz || 0)}
            </p>
            <p className="text-sm text-primary-50 mt-1">
              {summary?.halaqoh?.tahsin} Tahsin | {summary?.halaqoh?.tahfidz}{" "}
              Tahfidz
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-auto  items-start">
        <ChartAreaGradient
          dataPerkembangan={data?.chart_perkembangan}
          className="lg:col-span-2 shadow-sm border-border h-full"
        />
        <ChartPieDonutText
          dataPie={data?.chart_skema_pengguna}
          className="lg:col-span-1 shadow-sm h-full"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
        <Card className="lg:col-span-1 shadow-sm border-border bg-card h-full">
          <CardHeader>
            <CardTitle className="text-neutral-textprimary">
              Quick Access
            </CardTitle>
            <CardDescription className="text-neutral-textmuted">
              Pintasan utama sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button
              onClick={() => navigate("/manajemen-siswa")}
              className="w-full flex justify-start gap-3 bg-role-muhaffidz-bg text-role-muhaffidz-text "
            >
              <PiStudentBold size={18} /> Tambah Siswa Baru
            </Button>
            <Button
              onClick={() => navigate("/manajemen-user")}
              className="w-full flex justify-start gap-3 bg-role-admin-bg text-role-admin-text "
            >
              <TbUserPlus size={18} /> Tambah User Baru
            </Button>
            <Button
              onClick={() => navigate("/backup")}
              className="w-full flex justify-start gap-3 bg-role-direktur-bg text-role-direktur-text "
            >
              <FiDatabase size={18} /> Backup Data Sekarang
            </Button>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 shadow-sm border-border bg-card h-full">
          <CardHeader>
            <CardTitle className="text-neutral-textprimary">
              Status & Log Sistem
            </CardTitle>
            <CardDescription className="text-neutral-textmuted">
              Status :{" "}
              <span className="text-status-aktif-text font-semibold">
                {systemStatus?.status || "Normal"}
              </span>{" "}
              | Backup Terakhir : {systemStatus?.last_backup || "-"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {systemLogs?.map((log) => (
                <div className="flex flex-col gap-1 pb-3 border-b border-border last:border-0">
                  <div className="flex justify-between items-center">
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider ${log.type === "success" ? "bg-status-aktif-bg text-status-aktif-text" : log.type === "error" ? "bg-grade-dhaif-bg text-grade-dhaif-text" : "bg-role-admin-bg text-role-admin-text"}`}
                    >
                      {log.type}
                    </span>
                    <span className="text-xs text-neutral-textmuted">
                      {log.time}
                    </span>
                    <p className="text-sm text-neutral-textprimary mt-1">
                      {log.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default Homepage;
