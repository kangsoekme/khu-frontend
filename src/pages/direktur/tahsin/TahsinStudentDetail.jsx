import React from "react";
import { useState } from "react";

import { useParams, useNavigate } from "react-router-dom";
import { useGetStudentQuery } from "../../../store/api/studentsApi";
import { useGetRiwayatTahsinQuery } from "../../../store/api/tahsinApi";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

import { useAjukanUjianMutation } from "../../../store/api/pengajuanApi";
import { toast } from "sonner";

import {
  FaArrowLeft,
  FaDownload,
  FaCalendarCheck,
  FaGraduationCap,
} from "react-icons/fa";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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

function TahsinStudentDetail() {
  const [ajukanUjian, { isLoading: isMengajukan }] = useAjukanUjianMutation();
  const { nis } = useParams();
  const currentRole = localStorage.getItem("role");

  const [openForm, setOpenForm] = useState(false);
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
          <div className="flex gap-5">
            {currentRole === "GURU" && (
              <Button
                onClick={() => setOpenForm(true)}
                className="flex-1 h-12 flex"
              >
                <FaCalendarCheck className="text-2xl" /> Tambah Penilaian
              </Button>
            )}
            {currentRole === "GURU" && (
              <Button
                onClick={() => setOpenPengajuan(true)}
                disabled={isMengajukan}
                className="flex-1 h-12 flex bg-orange-600"
              >
                {isMengajukan ? "Mengajukan..." : "Ajukan Ujian Kenaikan"}
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
          <ChartPerkembangan className="col-span-2" />
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
                <TableHead>HAFALAN PENDEK</TableHead>
                <TableHead>LAPORAN BACAAN</TableHead>
                <TableHead>NILAI</TableHead>
                <TableHead>STATUS</TableHead>
                <TableHead>KETERANGAN</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {riwayatList.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-5">
                    Belum ada riwayat setoran tahsin
                  </TableCell>
                </TableRow>
              ) : (
                riwayatList.map((riwayat) => (
                  <TableRow>
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
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {riwayat.hafalan_surah?.surah || "-"}
                        </span>
                        <span className="text-neutral-textmuted">
                          {riwayat.hafalan_surah?.ayat_awal || "-"} -
                          {riwayat.hafalan_surah?.ayat_akhir || "-"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-primary-600">
                          {typeof riwayat.laporan_bacaan?.jilid_surah ===
                          "number"
                            ? `JILID ${riwayat.laporan_bacaan.jilid_surah}`
                            : riwayat.laporan_bacaan?.jilid_surah || "-"}
                        </span>
                        <span className="text-neutral-textmuted">
                          {riwayat.laporan_bacaan?.ayat || "-"}
                        </span>
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
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          <div className="flex flex-col lg:hidden mt-4 gap-6">
            {riwayatList.length === 0 ? (
              <p className="text-center text-sm text-neutral-400">
                Belum ada riwayat setoran
              </p>
            ) : (
              riwayatList.map((riwayat, index) => (
                <MobileHistoryCard
                  key={index}
                  day={new Date(riwayat.timestamp).toLocaleDateString("id-ID", {
                    weekday: "long",
                  })}
                  date={new Date(riwayat.timestamp).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                  titleInformation1={"Setoran"}
                  title1={riwayat.laporan_bacaan.jilid_surah || "-"}
                  subtitle1={riwayat.laporan_bacaan?.ayat}
                  titleInformation2={"Hafalan Pendek"}
                  title2={riwayat.hafalan_surah?.surah || "-"}
                  subtitle2={`${riwayat.hafalan_surah?.ayat_awal} -
                ${riwayat.hafalan_surah?.ayat_akhir}`}
                  badgeText={riwayat.nilai_tahsin}
                  description={riwayat.keterangan}
                />
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {isDesktop ? (
        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Setoran Bacaan</DialogTitle>
            </DialogHeader>
            <TahsinAssessmentForm
              nis={nis}
              halaqohId={student?.halaqoh_tahsin?.id}
              tahapan={student?.tahapan_tahsin}
              lastRiwayat={riwayatList[0]}
              onSuccess={() => setOpenForm(false)}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={openForm} onOpenChange={setOpenForm}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Tambah Setorah Bacaan</DrawerTitle>
            </DrawerHeader>
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
                  <SelectItem value="TAJWID">Tajwid</SelectItem>
                  <SelectItem value="GHARIB">Gharib</SelectItem>
                  <SelectItem value="ALQURAN">Al-Quran</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <Button type="submit" disabled={isMengajukan} className="w-full">
              {isMengajukan ? "Menyimpan..." : "Kirim Pengajuan"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default TahsinStudentDetail;
