import React from "react";
import { SearchInput } from "../../../components/ui/SearchInput";
import HalaqohItem from "../../../components/halaqoh/HalaqohItem";
import { useNavigate } from "react-router-dom";
import { useGetAllHalaqohQuery } from "../../../store/api/halaqohApi";

import { exportToExcel } from "../../../utils/exportExcel";
import { Button } from "@/components/ui/button";
import { TbFileSpreadsheet } from "react-icons/tb";
import { useLazyGetLaporanTahsinQuery } from "../../../store/api/laporanApi";

import { toast } from "sonner";

function TahsinManagement() {
  const navigate = useNavigate();

  const currentRole = localStorage.getItem("role");
  const currentNama = localStorage.getItem("nama");

  const [triggerGetLaporan, { isLoading: isExporting }] =
    useLazyGetLaporanTahsinQuery();

  const { data: halaqohObj, isLoading } = useGetAllHalaqohQuery();

  if (isLoading) return <p>Memuat data halaqoh...</p>;

  let allHalaqohTahsin = (halaqohObj?.data || []).filter(
    (h) => h.kategori === "TAHSIN",
  );

  if (currentRole === "GURU") {
    allHalaqohTahsin = allHalaqohTahsin.filter(
      (h) => h.guru?.nama === currentNama,
    );
  }

  const handleExport = async () => {
    try {
      const result = await triggerGetLaporan().unwrap();

      const rows = result.data || result || [];
      if (rows.length === 0) {
        toast.warning("Tidak ada data yang di export");
      }

      exportToExcel(rows, "Laporan_Perkembangan_Tahsin", "Tahsin");
    } catch (error) {
      console.error("Gagal export data : ", error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full  gap-5">
        <SearchInput />
        {currentRole === "DIREKTUR" && (
          <Button
            onClick={handleExport}
            disabled={isExporting}
            variant="outline"
            className="flex items-center gap-2 shrink-0"
          >
            <TbFileSpreadsheet className="text-lg text-green-600" />
            {isExporting ? "Mengekspor..." : "Export Excel"}
          </Button>
        )}
      </div>
      {allHalaqohTahsin.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-neutral-textmuted text-center">
          <h2 className="text-2xl font-bold mb2">Belum ada Halaqoh</h2>
          <p>
            {currentRole === "GURU"
              ? "Anda tidak memiliki halaqoh saat ini"
              : "Belum ada halaqoh untuk sistem ini"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {allHalaqohTahsin.map((halaqoh) => (
            <HalaqohItem
              key={halaqoh.id}
              halaqoh={halaqoh}
              onClick={() => navigate(`/tahsin/${halaqoh.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TahsinManagement;
