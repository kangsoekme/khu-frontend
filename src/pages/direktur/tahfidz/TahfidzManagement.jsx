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
      {allHalaqohTahfidz.length === 0 ? (
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
          {allHalaqohTahfidz.map((halaqoh) => (
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
