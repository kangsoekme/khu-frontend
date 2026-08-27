import {
  FaFileExcel,
  FaFileWord,
  FaUsers,
  FaLayerGroup,
  FaUserGraduate,
  FaClipboardList,
} from "react-icons/fa";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { FaSearch } from "react-icons/fa";
import { BASE_API_URL } from "../../store/baseApi";

const getFilenameTimestamp = () => {
  const d = new Date();
  const pad = (n) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}_${pad(d.getHours())}-${pad(d.getMinutes())}-${pad(d.getSeconds())}`;
};

// Nama file resmi ditentukan server via header Content-Disposition, agar nama
// file selalu konsisten dengan periode/tahun ajaran di dalam dokumen (sheet
// INFO). Fallback lokal hanya dipakai bila header tidak terkirim/terbaca.
const getServerFilename = (response, fallback) => {
  const disposition = response.headers.get("content-disposition") || "";
  const match = disposition.match(/filename="?([^";]+)"?/i);
  return match ? match[1] : fallback;
};

import { toast } from "sonner";
import { useGetStudentsQuery } from "../../store/api/studentsApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function LaporanManagement() {
  const [loadingType, setLoadingType] = useState(null);
  const [selectedNis, setSelectedNis] = useState("");
  const [searchStudent, setSearchStudent] = useState("");
  const [openStudentPopover, setOpenStudentPopover] = useState(false);
  const [periodeType, setPeriodeType] = useState("semester");
  const [selectedBulan, setSelectedBulan] = useState(
    new Date().toISOString().slice(0, 7),
  );
  const [kelompokKategori, setKelompokKategori] = useState("TAHSIN");

  // Export Pembagian Kelompok & Munaqosyah hanya untuk DIREKTUR (backend
  // membatasi role yang sama di /api/export/halaqoh & /munaqosyah)
  const role = localStorage.getItem("role");
  const canDownloadInstitusional = role === "DIREKTUR";

  const { data: studentsRes } = useGetStudentsQuery();
  const students = studentsRes?.data || [];
  const filteredStudents = students.filter(
    (s) =>
      s.nama?.toLowerCase().includes(searchStudent.toLowerCase()) ||
      s.nis?.includes(searchStudent),
  );

  const handleDownload = async (kategori) => {
    try {
      setLoadingType(kategori);
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams({
        kategori,
        periode: periodeType,
        ...(periodeType === "bulanan" ? { bulan: selectedBulan } : {}),
      }).toString();

      const response = await fetch(
        `${BASE_API_URL}/export/jamai?${queryParams}`,
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
      const infoPeriode =
        periodeType === "bulanan" ? `_BULANAN_${selectedBulan}` : `_SEMESTERAN`;
      a.download = getServerFilename(
        response,
        `Laporan_Jamai_${kategori.toUpperCase()}${infoPeriode}_${getFilenameTimestamp()}.xlsx`,
      );
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

  const handleDownloadIndividual = async () => {
    if (!selectedNis) {
      toast.error("Silakan pilih siswa terlebih dahulu");
      return;
    }
    try {
      setLoadingType("individu");
      const token = localStorage.getItem("token");
      const selectedStudent = students.find((s) => s.nis === selectedNis);
      const response = await fetch(
        `${BASE_API_URL}/export/individual/${selectedNis}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (!response.ok) throw new Error("Gagal mengunduh rapor individu");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getServerFilename(
        response,
        `Rapor_Perkembangan_${selectedStudent?.nama || selectedNis}_${getFilenameTimestamp()}.xlsx`,
      );
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Rapor individu berhasil diunduh!");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengunduh rapor individu");
    } finally {
      setLoadingType(null);
    }
  };

  const handleDownloadUmmiWord = async () => {
    try {
      setLoadingType("ummi-word");
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_API_URL}/export/ummi-word`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal mengunduh laporan Ummi Word");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getServerFilename(
        response,
        `Laporan_Perkembangan_Ummi_${getFilenameTimestamp()}.docx`,
      );
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan Ummi (.docx) berhasil diunduh!");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengunduh dokumen Word");
    } finally {
      setLoadingType(null);
    }
  };
  // 💡 2. Handler Unduh Rapor Individu Word (.docx)
  const handleDownloadIndividualWord = async () => {
    if (!selectedNis) {
      toast.error("Silakan pilih siswa terlebih dahulu");
      return;
    }
    try {
      setLoadingType("individu-word");
      const token = localStorage.getItem("token");
      const selectedStudent = students.find((s) => s.nis === selectedNis);
      const response = await fetch(
        `${BASE_API_URL}/export/individual-word/${selectedNis}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Gagal mengunduh rapor Word individu");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getServerFilename(
        response,
        `Rapor_Word_${selectedStudent?.nama || selectedNis}_${getFilenameTimestamp()}.docx`,
      );
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Rapor individu Word (.docx) berhasil diunduh!");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengunduh rapor Word individu");
    } finally {
      setLoadingType(null);
    }
  };

  // Handler unduh rekap Pembagian Kelompok (Halaqoh Tahsin/Tahfidz) — label
  // semester & tahun ajaran diambil dari tahun akademik aktif oleh server.
  const handleDownloadKelompok = async () => {
    try {
      setLoadingType("kelompok");
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${BASE_API_URL}/export/halaqoh?kategori=${kelompokKategori}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Gagal mengunduh pembagian kelompok");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getServerFilename(
        response,
        `Pembagian_Kelompok_${kelompokKategori}_${getFilenameTimestamp()}.xlsx`,
      );
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Pembagian kelompok berhasil diunduh!");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengunduh pembagian kelompok");
    } finally {
      setLoadingType(null);
    }
  };

  const handleDownloadMunaqosyah = async () => {
    try {
      setLoadingType("munaqosyah");
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_API_URL}/export/munaqosyah`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Gagal mengunduh data munaqosyah");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = getServerFilename(
        response,
        `Data_Munaqosyah_${getFilenameTimestamp()}.xlsx`,
      );
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Data munaqosyah berhasil diunduh!");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengunduh data munaqosyah");
    } finally {
      setLoadingType(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border shadow-sm bg-blue-50/50">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold text-blue-900">
            ⚙️ Konfigurasi Periode Laporan Jamai (Halaqoh & Kelas)
          </CardTitle>
          <CardDescription className="text-xs text-blue-700">
            Pilih apakah laporan Jamai diunduh berdasarkan keseluruhan semester
            aktif atau rekapitulasi khusus per bulan. Pengaturan ini hanya
            berlaku untuk <b>Laporan Jamai</b> (Halaqoh &amp; Kelas) — rapor
            individu selalu mengikuti semester berjalan.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs font-medium text-neutral-700 whitespace-nowrap">
              Jenis Laporan:
            </span>
            <Select value={periodeType} onValueChange={setPeriodeType}>
              <SelectTrigger className="w-44 h-9 bg-white text-xs">
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="semester">Laporan Semesteran</SelectItem>
                <SelectItem value="bulanan">Laporan Bulanan</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {periodeType === "bulanan" && (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-medium text-neutral-700 whitespace-nowrap">
                Pilih Bulan:
              </span>
              <input
                type="month"
                value={selectedBulan}
                onChange={(e) => setSelectedBulan(e.target.value)}
                className="h-9 px-3 py-1 bg-white border border-neutral-300 rounded-md text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ==================================================== */}
        {/* KARTU 1: EXPORT PER HALAQOH (EXCEL)                  */}
        {/* ==================================================== */}
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
          <CardContent className="pt-4 flex flex-col justify-between h-44">
            <p className="text-sm text-neutral-600">
              Menghasilkan file Excel yang memuat seluruh nilai siswa dengan
              pemisahan sheet berdasarkan halaqoh (misal: Abu Bakar, Umar, dst).
            </p>
            {/* ✔️ Kembalikan tombol hijau asli untuk unduh halaqoh */}
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

        {/* ==================================================== */}
        {/* KARTU 2: EXPORT PER KELAS (EXCEL) + UMMI (WORD)      */}
        {/* ==================================================== */}
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
              <FaUsers size={24} />
            </div>
            <div>
              <CardTitle className="text-lg">Laporan Jamai & Ummi</CardTitle>
              <CardDescription>
                Rapor Kelas (Excel) & Ummi Foundation (Word)
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col justify-between h-48">
            <p className="text-sm text-neutral-600">
              Unduh rekap nilai per Kelas (1-A, dst) atau cetak dokumen resmi
              perkembangan siswa untuk laporan ke Ummi Foundation.
            </p>
            <div className="flex flex-col gap-2 mt-auto">
              <Button
                onClick={() => handleDownload("kelas")}
                disabled={loadingType === "kelas"}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2"
              >
                <FaFileExcel />{" "}
                {loadingType === "kelas" ? "Mengunduh..." : "Unduh Rapor Excel"}
              </Button>

              {/* ✔️ Tambahkan tombol untuk memanggil handleDownloadUmmiWord */}
              <Button
                onClick={handleDownloadUmmiWord}
                disabled={loadingType === "ummi-word"}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white gap-2"
              >
                <FaFileWord />{" "}
                {loadingType === "ummi-word"
                  ? "Mengunduh..."
                  : "Laporan Ummi (.docx)"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ==================================================== */}
        {/* KARTU 3: RAPOR INDIVIDU (EXCEL & WORD)               */}
        {/* ==================================================== */}
        <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center gap-4 pb-2">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
              <FaUserGraduate size={24} />
            </div>
            <div>
              <CardTitle className="text-lg">
                Rapor Perkembangan Siswa
              </CardTitle>
              <CardDescription>
                Rapor 1 siswa (Tahsin &amp; Tahfidz), siap cetak
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col justify-between h-48 gap-2">
            <p className="text-sm text-neutral-600">
              Menghasilkan file Rapor Individual untuk 1 siswa tertentu yang
              siap cetak (Tahsin & Tahfidz).
            </p>
            {/* ✔️ Hapus duplikasi div flex-col di sini */}
            <div className="flex flex-col gap-2 mt-auto">
              <Popover
                open={openStudentPopover}
                onOpenChange={setOpenStudentPopover}
              >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full h-9 justify-start text-xs font-normal border-neutral-300"
                  >
                    {selectedNis
                      ? `${selectedNis} - ${students.find((s) => s.nis === selectedNis)?.nama || ""}`
                      : "Pilih Siswa..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <div className="flex flex-col gap-1 p-2">
                    <div className="relative">
                      <FaSearch className="absolute left-2.5 top-2.5 h-3 w-3 text-neutral-400" />
                      <input
                        type="text"
                        placeholder="Cari NIS / Nama..."
                        className="h-8 w-full pl-8 pr-3 border border-neutral-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-purple-500"
                        value={searchStudent}
                        onChange={(e) => setSearchStudent(e.target.value)}
                        autoFocus
                      />
                    </div>
                    <div className="max-h-60 overflow-y-auto flex flex-col mt-1 scrollbar-thin">
                      {filteredStudents.length > 0 ? (
                        filteredStudents.map((s) => (
                          <div
                            key={s.nis}
                            className="p-2 text-xs hover:bg-neutral-100 cursor-pointer rounded text-left transition-colors"
                            onClick={() => {
                              setSelectedNis(s.nis);
                              setOpenStudentPopover(false);
                              setSearchStudent("");
                            }}
                          >
                            {s.nis} - {s.nama}
                          </div>
                        ))
                      ) : (
                        <div className="p-2 text-xs text-neutral-500 text-center">
                          Tidak ditemukan
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>

              <Button
                onClick={handleDownloadIndividual}
                disabled={loadingType === "individu" || !selectedNis}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2"
              >
                <FaFileExcel />{" "}
                {loadingType === "individu"
                  ? "Mengunduh..."
                  : "Rapor Excel (.xlsx)"}
              </Button>

              <Button
                onClick={handleDownloadIndividualWord}
                disabled={loadingType === "individu-word" || !selectedNis}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
              >
                <FaFileWord />{" "}
                {loadingType === "individu-word"
                  ? "Mengunduh..."
                  : "Rapor Word (.docx)"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* ==================================================== */}
        {/* KARTU 4: LAPORAN INSTITUSIONAL (SA & DIREKTUR)       */}
        {/* ==================================================== */}
        {canDownloadInstitusional && (
          <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
                <FaClipboardList size={24} />
              </div>
              <div>
                <CardTitle className="text-lg">Laporan Institusional</CardTitle>
                <CardDescription>
                  Pembagian Kelompok &amp; Data Munaqosyah
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-4 flex flex-col justify-between h-48 gap-2">
              <p className="text-sm text-neutral-600">
                Rekap pembagian kelompok halaqoh per kategori serta data siswa
                munaqosyah. Label semester &amp; tahun ajaran mengikuti tahun
                akademik aktif.
              </p>
              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex items-center gap-2">
                  <Select
                    value={kelompokKategori}
                    onValueChange={setKelompokKategori}
                  >
                    <SelectTrigger className="w-full h-9 bg-white text-xs">
                      <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TAHSIN">Tahsin Qiraah</SelectItem>
                      <SelectItem value="TAHFIDZ">Tahfidz Quran</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleDownloadKelompok}
                    disabled={loadingType === "kelompok"}
                    className="w-full bg-amber-600 hover:bg-amber-700 text-white gap-2"
                  >
                    <FaFileExcel />{" "}
                    {loadingType === "kelompok"
                      ? "Mengunduh..."
                      : "Pembagian Kelompok"}
                  </Button>
                </div>
                <Button
                  onClick={handleDownloadMunaqosyah}
                  disabled={loadingType === "munaqosyah"}
                  variant="outline"
                  className="w-full gap-2"
                >
                  <FaFileExcel />{" "}
                  {loadingType === "munaqosyah"
                    ? "Mengunduh..."
                    : "Data Munaqosyah (.xlsx)"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default LaporanManagement;
