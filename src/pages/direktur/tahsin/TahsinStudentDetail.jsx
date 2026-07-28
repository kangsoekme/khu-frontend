import React from "react";
import { useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useGetStudentQuery } from "../../../store/api/studentsApi";
import { useGetRiwayatTahsinQuery } from "../../../store/api/tahsinApi";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

import { useAjukanUjianMutation } from "../../../store/api/pengajuanApi";
import { BASE_API_URL } from "../../../store/baseApi";
import { toast } from "sonner";
import {
  FaArrowLeft,
  FaCalendarCheck,
  FaGraduationCap,
  FaEllipsisV,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ScrollArea } from "@/components/ui/scroll-area";

import ChartPerkembangan from "../../../components/tahsin-tahfidz/ChartPerkembangan";
import TahsinAssessmentForm from "../../../components/tahsin-tahfidz/tahsin/TahsinAssessmentForm";
import { MobileHistoryCard } from "../../../components/ui/MobileHistoryCard";
import { useDeleteTahsinMutation } from "../../../store/api/tahsinApi";
import {
  cekKelengkapanPengajuan,
  getKategoriTahapan,
} from "../../../utils/tahsinCompletion";
import { formatEnum } from "../../../utils/formatEnum";

// Helper: Format laporan bacaan untuk ditampilkan (title + subtitle)
// Mengembalikan string dinamis berdasarkan jenis setoran (buku / quran / keduanya)
const formatLaporanBacaan = (riwayat) => {
  const laporan = riwayat?.laporan_bacaan || {};
  const kategori = getKategoriTahapan(riwayat?.tahapan);

  const parts = [];

  // Komponen BUKU (Jilid UMMI / Gharib / Tajwid)
  const hasBuku =
    laporan.jilid !== null &&
    laporan.jilid !== undefined &&
    laporan.bab !== null &&
    laporan.bab !== undefined;

  if (hasBuku) {
    const isGharibOrTajwid = kategori === "GANDA";
    const labelBuku = isGharibOrTajwid
      ? formatEnum(riwayat.tahapan)
      : laporan.jilid === 0
        ? "Buku"
        : `Jilid ${laporan.jilid}`;
    parts.push({
      label: labelBuku,
      sub: `Halaman ${laporan.bab ?? "-"}`,
    });
  }

  // Komponen Al-QURAN (surah + ayat)
  if (laporan.surah) {
    parts.push({
      label: laporan.surah,
      sub: `Ayat ${laporan.ayat_awal ?? "-"} - ${laporan.ayat_akhir ?? "-"}`,
    });
  }

  // Fallback format lama (jilid_surah + ayat)
  if (parts.length === 0 && laporan.jilid_surah != null) {
    const isNumber = !isNaN(Number(laporan.jilid_surah));
    parts.push({
      label: isNumber ? `Jilid ${laporan.jilid_surah}` : laporan.jilid_surah,
      sub: laporan.ayat ? `Halaman/Ayat ${laporan.ayat}` : "-",
    });
  }

  return parts;
};

function TahsinStudentDetail() {
  const [ajukanUjian, { isLoading: isMengajukan }] = useAjukanUjianMutation();
  const [deleteTahsin, { isLoading: isDeleting }] = useDeleteTahsinMutation();
  const { nis } = useParams();
  const currentRole = localStorage.getItem("role");

  const [openForm, setOpenForm] = useState(false);
  const [editData, setEditData] = useState(null);
  const [openPengajuan, setOpenPengajuan] = useState(false);

  const isDesktop = useMediaQuery("(min-width:768px");

  const { data: studentRes, isLoading: isLoadingStudent } =
    useGetStudentQuery(nis);
  const { data: riwayatRes, isLoading: isLoadingRiwayat } =
    useGetRiwayatTahsinQuery(nis);

  if (isLoadingStudent || isLoadingRiwayat) {
    return <p>Memuat profil dan riwayat siswa</p>;
  }

  const student = studentRes?.data;
  const riwayatList = riwayatRes?.data?.history || [];
  const summary = riwayatRes?.data?.summary;

  // Cek kelengkapan pengajuan ujian: HANYA boleh jika tahapan saat ini selesai.
  const statusPengajuan = cekKelengkapanPengajuan(
    riwayatList,
    student?.tahapan_tahsin,
  );

  const chartData = [...riwayatList].reverse().map((item, idx) => {
    const gradeMap = {
      "A+": 98,
      A: 90,
      "B+": 85,
      B: 80,
      "B-": 75,
      "C+": 70,
      C: 65,
      "C-": 60,
      D: 50,
    };
    const gradeVal = item.nilai_tahsin || item.nilai;
    const numScore = gradeMap[gradeVal] || 75;
    const dateVal = item.timestamp || item.tanggal;
    const dateStr = dateVal
      ? new Date(dateVal).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        })
      : `P-${idx + 1}`;
    return {
      date: dateStr,
      score: numScore,
      nilai: gradeVal,
    };
  });

  const handleAjukanUjian = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const tahapanPilihan = formData.get("tahapan_baru");

    try {
      await ajukanUjian({
        nis: nis,
        kategori: "TAHSIN",
        tahapan: tahapanPilihan,
      }).unwrap();
      toast.success("Pengajuan berhasil");
      setOpenPengajuan(false);
    } catch (error) {
      toast.error(error?.data?.message || "Gagal mengajukan ujian");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm("Apakah Anda yakin ingin menghapus riwayat setoran ini?")
    ) {
      try {
        await deleteTahsin(id).unwrap();
        toast.success("Riwayat berhasil dihapus!");
      } catch (error) {
        toast.error("Gagal menghapus riwayat");
        console.error("Error delete: ", error);
      }
    }
  };

  return (
    <div key={nis} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5 h-full">
          <Card className="col-span-2 row-span-2">
            <CardContent className="flex items-center gap-5">
              <Avatar className="h-24 w-24">
                <AvatarImage src={student?.profile_photo} />
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-700">
                  {student?.nama?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <CardTitle className="font-bold text-2xl">
                  {student?.nama}
                </CardTitle>

                <CardDescription>
                  {student?.nis} | {student?.riwayatKelas?.[0]?.nama_kelas}
                </CardDescription>
                <Badge className=" px-4 py-3">
                  {student?.halaqoh_tahsin?.nama || "Belum ada kelompok"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-wrap gap-3">
            {currentRole === "GURU" && (
              <Button
                onClick={() => {
                  setEditData(null);
                  setOpenForm(true);
                }}
                className="flex-1 h-12 flex"
              >
                <FaCalendarCheck className="text-2xl" /> Tambah Penilaian
              </Button>
            )}
            {currentRole === "GURU" && (
              <Button
                onClick={() => setOpenPengajuan(true)}
                disabled={isMengajukan || !statusPengajuan.bolehAjukan}
                title={statusPengajuan.alasan}
                className="flex-1 h-12 flex bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isMengajukan
                  ? "Mengajukan..."
                  : statusPengajuan.bolehAjukan
                    ? "Ajukan Ujian Kenaikan"
                    : "Belum Bisa Ajukan Ujian"}
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-5 flex-1">
            <Card className="row-span-3">
              <CardContent className="flex flex-col justify-between h-full">
                <div className="flex justify-end">
                  <div className="p-4 w-fit rounded-xl bg-primary-600">
                    <FaCalendarCheck className="text-neutral-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-4xl font-bold">
                    {summary?.total_pertemuan || 0}
                  </CardTitle>
                  <CardDescription>TOTAL PERTEMUAN</CardDescription>
                </div>
              </CardContent>
            </Card>
            <Card className="row-span-3">
              <CardContent className="flex flex-col justify-between h-full">
                <div className="flex justify-end">
                  <div className="p-4 w-fit rounded-xl bg-primary-600">
                    <FaCalendarCheck className="text-neutral-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-4xl font-bold">
                    {summary?.rata_rata || "-"}
                  </CardTitle>
                  <CardDescription>RATA RATA NILAI</CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="xl:col-span-3 w-full h-full min-h-100">
          <ChartPerkembangan
            className="col-span-2"
            data={chartData}
            title="Grafik Nilai Tahsin"
            desc="Pergerakan grafik berdasarkan nilai setoran harian siswa"
            dataKey="score"
            label="Skor Perkembangan"
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detail Riwayat Tahsin</CardTitle>
        </CardHeader>
        <CardContent>
          <Table className="hidden lg:table">
            <TableHeader>
              <TableRow>
                <TableHead>HARI / TANGGAL</TableHead>
                <TableHead>LAPORAN BACAAN</TableHead>
                <TableHead>NILAI</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>KETERANGAN</TableHead>
                {currentRole === "GURU" && <TableHead>AKSI</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {riwayatList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-5">
                    Belum ada riwayat setoran tahsin
                  </TableCell>
                </TableRow>
              ) : (
                riwayatList.map((riwayat) => {
                  const laporanParts = formatLaporanBacaan(riwayat);
                  return (
                    <TableRow key={riwayat.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-semibold uppercase">
                            {new Date(riwayat.timestamp).toLocaleDateString(
                              "id-ID",
                              { weekday: "long" },
                            )}
                          </span>
                          <span className="text-neutral-textmuted">
                            {new Date(riwayat.timestamp).toLocaleDateString(
                              "id-ID",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-10">
                          {laporanParts.length === 0 ? (
                            <span className="text-neutral-textmuted">-</span>
                          ) : (
                            laporanParts.map((part, i) => (
                              <div key={i} className="flex flex-col">
                                <span
                                  className={`font-bold ${part.label.startsWith("Jilid") || part.label === "Gharib" || part.label === "Tajwid" ? "text-primary-600" : "text-emerald-600"}`}
                                >
                                  {part.label}
                                </span>
                                <span className="text-neutral-textmuted">
                                  {part.sub}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        {riwayat.nilai_tahsin || "-"}
                      </TableCell>
                      <TableCell>
                        <span className="font-bold text-primary-600">
                          {riwayat.status_kelanjutan || ""}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm max-w-50 truncate">
                        {riwayat.keterangan || "-"}
                      </TableCell>
                      {currentRole === "GURU" && (
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <FaEllipsisV />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setEditData(riwayat);
                                  setOpenForm(true);
                                }}
                                className="cursor-pointer"
                              >
                                <FaEdit className="mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(riwayat.id)}
                                className="text-red-600 cursor-pointer focus:bg-red-50 focus:text-red-700"
                              >
                                <FaTrash className="mr-2" /> Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col lg:hidden mt-4 gap-6">
            {riwayatList.length === 0 ? (
              <p className="text-center text-sm text-neutral-400">
                Belum ada riwayat setoran
              </p>
            ) : (
              riwayatList.map((riwayat, index) => {
                const parts = formatLaporanBacaan(riwayat);
                return (
                  <MobileHistoryCard
                    key={index}
                    day={new Date(riwayat.timestamp).toLocaleDateString(
                      "id-ID",
                      { weekday: "long" },
                    )}
                    date={new Date(riwayat.timestamp).toLocaleDateString(
                      "id-ID",
                      { day: "numeric", month: "long", year: "numeric" },
                    )}
                    titleInformation1={
                      parts[0]?.label?.startsWith("Jilid") ||
                      parts[0]?.label === "Gharib" ||
                      parts[0]?.label === "Tajwid"
                        ? "Buku"
                        : "Al-Quran"
                    }
                    title1={parts[0]?.label || "-"}
                    subtitle1={parts[0]?.sub || "-"}
                    titleInformation2={
                      parts[1]
                        ? parts[1]?.label?.startsWith("Jilid") ||
                          parts[1]?.label === "Gharib" ||
                          parts[1]?.label === "Tajwid"
                          ? "Buku"
                          : "Al-Quran"
                        : undefined
                    }
                    title2={parts[1]?.label}
                    subtitle2={parts[1]?.sub}
                    badgeText={riwayat.nilai_tahsin}
                    description={riwayat.keterangan}
                  />
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {isDesktop ? (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editData ? "Edit Setoran Bacaan" : "Tambah Setoran Bacaan"}
              </DialogTitle>
            </DialogHeader>
            <TahsinAssessmentForm
              nis={nis}
              halaqohId={student?.halaqoh_tahsin?.id}
              tahapan={student?.tahapan_tahsin}
              lastRiwayat={riwayatList[0]}
              editData={editData}
              onSuccess={() => setOpenForm(false)}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={openForm} onOpenChange={setOpenForm}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>
                {editData ? "Edit Setoran Bacaan" : "Tambah Setoran Bacaan"}
              </DrawerTitle>
            </DrawerHeader>
            <div className="p-4">
              <TahsinAssessmentForm
                nis={nis}
                halaqohId={student?.halaqoh_tahsin?.id}
                tahapan={student?.tahapan_tahsin}
                lastRiwayat={riwayatList[0]}
                editData={editData}
                onSuccess={() => setOpenForm(false)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      <Dialog open={openPengajuan} onOpenChange={setOpenPengajuan}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajukan Ujian Kenaikan</DialogTitle>
          </DialogHeader>
          <form
            action=""
            onSubmit={handleAjukanUjian}
            className="flex flex-col gap-4"
          >
            {/* Info status kelengkapan pengajuan */}
            <div
              className={`rounded-lg border p-3 text-sm ${statusPengajuan.bolehAjukan ? "border-emerald-300 bg-emerald-50 text-emerald-800" : "border-amber-300 bg-amber-50 text-amber-800"}`}
            >
              <p className="font-semibold">
                Tahapan saat ini: {formatEnum(student?.tahapan_tahsin)}
              </p>
              <p>{statusPengajuan.alasan}</p>
            </div>

            <Select name="tahapan_baru" required className="w-full">
              <SelectTrigger>
                <SelectValue placeholder="Pilih tahapan / jilid" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="JILID_1">Jilid 1</SelectItem>
                  <SelectItem value="JILID_2">Jilid 2</SelectItem>
                  <SelectItem value="JILID_3">Jilid 3</SelectItem>
                  <SelectItem value="JILID_4">Jilid 4</SelectItem>
                  <SelectItem value="JILID_5">Jilid 5</SelectItem>
                  <SelectItem value="JILID_6">Jilid 6</SelectItem>
                  <SelectItem value="TILAWAH_JUZ_1_5">
                    Tilawah Juz 1-5
                  </SelectItem>
                  <SelectItem value="TAJWID">Tajwid</SelectItem>
                  <SelectItem value="GHARIB">Gharib</SelectItem>
                  <SelectItem value="ALQURAN">Al-Quran</SelectItem>
                  <SelectItem value="MUNAQOSYAH">Munaqosyah</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button
              type="submit"
              disabled={isMengajukan || !statusPengajuan.bolehAjukan}
              className="w-full"
            >
              {isMengajukan
                ? "Menyimpan..."
                : statusPengajuan.bolehAjukan
                  ? "Kirim Pengajuan"
                  : "Belum Bisa Ajukan"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TahsinStudentDetail;
