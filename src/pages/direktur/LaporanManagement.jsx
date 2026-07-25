import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaFileExcel, FaUsers, FaLayerGroup } from "react-icons/fa";
import { BASE_API_URL } from "../../store/baseApi";
import { toast } from "sonner";

function LaporanManagement() {
  const [loadingType, setLoadingType] = useState(null);

  const handleDownload = async (kategori) => {
    try {
      setLoadingType(kategori);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_API_URL}/export/jamai?kategori=${kategori}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Gagal mengunduh laporan");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Laporan_Jamai_${kategori.toUpperCase()}_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan berhasil diunduh!");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengunduh laporan");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-neutral-800">
          Pusat Laporan & Rapor
        </h1>
        <p className="text-sm text-neutral-500">
          Unduh rekapitulasi nilai akademik Tahsin dan Tahfidz siswa akhir
          semester
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* CARD EXPORT PER HALAQOH */}
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 bg-green-100 text-green-600 rounded-lg">
              <FaLayerGroup size={24} />
            </div>
            <div>
              <CardTitle className="text-lg">
                Laporan Jamai (Per Halaqoh)
              </CardTitle>
              <CardDescription>
                Dipisah berdasarkan sheet nama Halaqoh
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col justify-between h-36">
            <p className="text-sm text-neutral-600">
              Menghasilkan file Excel yang memuat seluruh nilai siswa dengan
              pemisahan sheet berdasarkan halaqoh (misal: Abu Bakar, Umar, dst).
            </p>
            <Button
              onClick={() => handleDownload("halaqoh")}
              disabled={loadingType === "halaqoh"}
              className="w-full bg-green-600 hover:bg-green-700 text-white gap-2"
            >
              <FaFileExcel />{" "}
              {loadingType === "halaqoh"
                ? "Mengunduh..."
                : "Unduh Laporan Halaqoh"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <FaUsers size={24} />
            </div>
            <div>
              <CardTitle className="text-lg">
                Laporan Jamai (+ Rapor Kelas)
              </CardTitle>
              <CardDescription>
                Dipisah per Kelas & Rapor Individual di sheet akhir
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col justify-between h-36">
            <p className="text-sm text-neutral-600">
              Menghasilkan file Excel berdasar Kelas (1-A, 1-B, dst) dan
              otomatis menyertakan format Rapor Individual untuk langsung
              dicetak.
            </p>
            <Button
              onClick={() => handleDownload("kelas")}
              disabled={loadingType === "kelas"}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
            >
              <FaFileExcel />{" "}
              {loadingType === "kelas" ? "Mengunduh..." : "Unduh Rapor Lengkap"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default LaporanManagement;
