import { useState } from "react";
import { SearchInput } from "../../../components/ui/SearchInput";
import HalaqohItem from "../../../components/halaqoh/HalaqohItem";
import { useNavigate } from "react-router-dom";
import { useGetAllHalaqohQuery } from "../../../store/api/halaqohApi";
import { useLazyGetLaporanTahfidzQuery } from "../../../store/api/laporanApi";
import { exportToExcel } from "../../../utils/exportExcel";

import { TbFileSpreadsheet } from "react-icons/tb";

import { Button } from "@/components/ui/button";

function TahfidzManagement() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const currentRole = localStorage.getItem("role");
  const currentNama = localStorage.getItem("nama");

  const [triggerGetLaporan, { isLoading: isExporting }] =
    useLazyGetLaporanTahfidzQuery();

  const { data: halaqohObj, isLoading } = useGetAllHalaqohQuery();

  if (isLoading) return <p>Memuat data halaqoh...</p>;

  let allHalaqohTahfidz = (halaqohObj?.data || []).filter(
    (h) => h.kategori === "TAHFIDZ",
  );

  if (currentRole === "GURU") {
    allHalaqohTahfidz = allHalaqohTahfidz.filter(
      (h) => h.guru?.nama === currentNama,
    );
  }

  // FE-6: hubungkan SearchInput ke state dan filter daftar halaqoh
  const filteredHalaqoh = search.trim()
    ? allHalaqohTahfidz.filter(
        (h) =>
          h.nama_halaqoh?.toLowerCase().includes(search.toLowerCase()) ||
          h.guru?.nama?.toLowerCase().includes(search.toLowerCase()),
      )
    : allHalaqohTahfidz;

  const handleExport = async () => {
    try {
      const result = await triggerGetLaporan().unwrap();
      exportToExcel(result.data, "Laporan_Perkembangan_Tahfidz", "Tahfidz");
    } catch (error) {
      console.error("Gagal export data : ", error);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full  gap-5">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama halaqoh / guru..."
        />
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
      {filteredHalaqoh.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-20 text-neutral-textmuted text-center">
          <h2 className="text-2xl font-bold mb2">
            {search ? "Halaqoh tidak ditemukan" : "Belum ada Halaqoh"}
          </h2>
          <p>
            {search
              ? `Tidak ada halaqoh yang cocok dengan "${search}"`
              : currentRole === "GURU"
                ? "Anda tidak memiliki halaqoh saat ini"
                : "Belum ada halaqoh untuk sistem ini"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4">
          {filteredHalaqoh.map((halaqoh) => (
            <HalaqohItem
              key={halaqoh.id}
              halaqoh={halaqoh}
              onClick={() => navigate(`/tahfidz/${halaqoh.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default TahfidzManagement;
