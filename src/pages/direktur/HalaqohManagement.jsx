import React, { useState, useMemo } from "react";
import { useGetWaitingHalaqohQuery } from "../../store/api/studentsApi";
import {
  useGetAllHalaqohQuery,
  useDeleteHalaqohMutation,
  useAddHalaqohMutation,
  useAutoGenerateHalaqohMutation,
} from "../../store/api/halaqohApi";

import { BASE_API_URL } from "../../store/baseApi";

import HalaqohForm from "../../components/halaqoh/HalaqohForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
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
import { useMediaQuery } from "@/hooks/use-media-query";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";
import { formatEnum } from "../../utils/formatEnum";

import { toast } from "sonner";

function HalaqohManagement() {
  const [activeTab, setActiveTab] = useState("TAHSIN");
  
  const { data: studentObj, isLoading: isStudentLoading } =
    useGetWaitingHalaqohQuery({ kategori: activeTab });
  const { data: halaqohObj, isLoading: isHalaqohLoading } =
    useGetAllHalaqohQuery();
  const [autoGenerateHalaqoh, { isLoading: isGenerating }] =
    useAutoGenerateHalaqohMutation();

  const [openForm, setOpenForm] = useState(false);
  const [selectedHalaqoh, setSelectedHalaqoh] = useState(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const allHalaqoh = useMemo(() => halaqohObj?.data || [], [halaqohObj?.data]);
  const waitingStudent = useMemo(() => studentObj?.data || [], [studentObj?.data]);

  const groupedStudents = useMemo(() => {
    const sortedStudents = [...waitingStudent].sort((a, b) => {
      if (activeTab === "TAHSIN") {
        const hasSetoranA = a.setoranTahsin && a.setoranTahsin.length > 0;
        const hasSetoranB = b.setoranTahsin && b.setoranTahsin.length > 0;
        if (hasSetoranA && !hasSetoranB) return -1;
        if (!hasSetoranA && hasSetoranB) return 1;
        if (hasSetoranA && hasSetoranB) {
          const halA = Number(
            a.setoranTahsin[0]?.bab || a.setoranTahsin[0]?.halaman || 0,
          );
          const halB = Number(
            b.setoranTahsin[0]?.bab || b.setoranTahsin[0]?.halaman || 0,
          );
          return halA - halB;
        }
        return 0;
      } else {
        const surahA = Number(a.setoranHafalan?.[0]?.no_surah || 0);
        const surahB = Number(b.setoranHafalan?.[0]?.no_surah || 0);
        if (surahA !== surahB) return surahB - surahA;
        return (
          Number(a.setoranHafalan?.[0]?.ayat_akhir || 0) -
          Number(b.setoranHafalan?.[0]?.ayat_akhir || 0)
        );
      }
    });

    return sortedStudents.reduce((acc, student) => {
      let rawKey = "BELUM MULAI";
      if (activeTab === "TAHSIN") {
        rawKey =
          student.tahapan_tahsin ||
          student.setoranTahsin?.[0]?.tahapan ||
          student.ujianPretest?.[0]?.tahapan ||
          "🌟 BELUM MULAI / BELUM ADA TAHAPAN";
      } else {
        rawKey = student.setoranHafalan?.[0]?.surah?.nama_surah
          ? `Juz 30 (Qs. ${student.setoranHafalan[0].surah.nama_surah})`
          : student.setoranHafalan?.[0]?.no_surah
          ? `Juz 30 (Surah ke-${student.setoranHafalan[0].no_surah})`
          : "🌟 SISWA BARU (BELUM ADA SETORAN)";
      }
      const key =
        activeTab === "TAHSIN" && !rawKey.includes("🌟")
          ? formatEnum(rawKey)
          : rawKey;

      if (!acc[key]) acc[key] = [];
      acc[key].push(student);
      return acc;
    }, {});
  }, [waitingStudent, activeTab]);

  if (isStudentLoading || isHalaqohLoading) return <p>Memuat data..</p>;

  const handleAutoGenerate = async () => {

    try {
      const res = await autoGenerateHalaqoh({
        kategori: activeTab,
        targetSize: 11,
      }).unwrap();
      toast.success(
        `${res.data?.length || "Beberapa"} Kelompok Halaqoh berhasil dibentuk otomatis!`,
      );
    } catch (err) {
      console.error(err);
      toast.error(err.data?.message || "Gagal membuat kelompok otomatis");
    }
  };

  const handleExportExcel = async () => {
    try {
      const token = sessionStorage.getItem("token") || "";
      // Gunakan fetch untuk mengunduh file binary dari backend berserta header Authorization
      const response = await fetch(
        `${BASE_API_URL}/export/halaqoh?kategori=${activeTab}`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Gagal mengunduh file Excel");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `Pembagian_Kelompok_${activeTab}_2024_2025.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success("File Excel pembagian halaqoh berhasil diunduh!");
    } catch (error) {
      console.error(error);
      toast.error("Gagal mengunduh Laporan Excel");
    }
  };

  const handleAddClick = () => {
    setSelectedHalaqoh(null);
    setOpenForm(true);
  };

  const handleEditClick = (halaqoh) => {
    setSelectedHalaqoh(halaqoh);
    setOpenForm(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 w-full">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="TAHSIN"
          className="w-full lg:w-auto"
        >
          <TabsList className="flex w-full lg:w-auto">
            <TabsTrigger value="TAHSIN" className="flex-1">Tahsin Qiraah</TabsTrigger>
            <TabsTrigger value="TAHFIDZ" className="flex-1">Tahfidz Quran</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
          <Button onClick={handleAddClick} className="w-full sm:w-auto flex-1 sm:flex-none">
            <FaPlus className="mr-2" /> Buat Halaqoh
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="secondary"
                disabled={isGenerating}
                className="w-full sm:w-auto flex-1 sm:flex-none font-semibold shadow-xs"
              >
                {isGenerating ? "Membentuk..." : `Buat Otomatis (${activeTab})`}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Pembuatan Otomatis</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin membuat kelompok {activeTab} otomatis oleh server?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleAutoGenerate}>
                  Buat Otomatis
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            onClick={handleExportExcel}
            className="w-full sm:w-auto flex-1 sm:flex-none font-semibold shadow-xs"
          >
            Ekspor Excel
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* daftar siswa belum ada halaqoh */}
        <Card className="mx-auto w-full ">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Daftar siswa belum memiliki halaqoh
            </CardTitle>
          </CardHeader>
          <CardContent className=" flex flex-col gap-3">
            {Object.keys(groupedStudents).length === 0 ? (
              <p className="text-center py-4 text-neutral-textmuted">
                Semua siswa sudah memiliki halaqoh
              </p>
            ) : (
              Object.keys(groupedStudents).map((jilid) => (
                <div className="flex flex-col gap-5" key={jilid}>
                  <h3 className="font-bold">
                    {jilid} ({groupedStudents[jilid].length} Siswa)
                  </h3>
                  {groupedStudents[jilid].map((siswa) => (
                    <Item key={siswa.nis} variant="outline-">
                      <ItemContent>
                        <ItemTitle>{siswa.nama}</ItemTitle>
                        <ItemDescription>
                          {siswa.nis} |{" "}
                          {activeTab === "TAHSIN"
                            ? siswa.setoranTahsin?.[0]?.bab ||
                              siswa.setoranTahsin?.[0]?.halaman
                              ? `Hal. ${siswa.setoranTahsin[0].bab || siswa.setoranTahsin[0].halaman}`
                              : siswa.setoranTahsin?.[0]?.materi
                              ? siswa.setoranTahsin[0].materi
                              : `Pretest: ${formatEnum(siswa.ujianPretest?.[0]?.tahapan || siswa.tahapan_tahsin || "BELUM MULAI")}`
                            : siswa.setoranHafalan?.[0]?.surah?.nama_surah
                              ? `Qs. ${siswa.setoranHafalan[0].surah.nama_surah} (${siswa.setoranHafalan[0].ayat_akhir})`
                              : "Siswa Baru"}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="mx-auto w-full">
          <CardHeader>
            <CardTitle className="font-medium text-lg">
              Daftar Halaqoh Aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {allHalaqoh
              .filter((h) => h.kategori === activeTab)
              .map((halaqoh) => (
                <Item
                  key={halaqoh.id}
                  onClick={() => handleEditClick(halaqoh)}
                  variant="outline"
                >
                  <ItemContent className="w-full">
                    <div className="flex justify-between items-start w-full">
                      <div className="">
                        <ItemTitle>{halaqoh.nama_halaqoh}</ItemTitle>
                        <ItemDescription>
                          {halaqoh.guru?.nama} | {halaqoh.siswa?.length || 0}{" "}
                          Siswa
                        </ItemDescription>
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <Badge
                          variant={
                            halaqoh.kategori === "TAHSIN"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {halaqoh.kategori}
                        </Badge>
                      </div>
                    </div>
                  </ItemContent>
                </Item>
              ))}
          </CardContent>
        </Card>

        {isDesktop ? (
          <Dialog open={openForm} onOpenChange={setOpenForm}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {selectedHalaqoh ? "Edit Halaqoh" : "Buat Halaqoh Baru"}
                </DialogTitle>
              </DialogHeader>

              <HalaqohForm
                initialData={selectedHalaqoh}
                studentsList={waitingStudent}
                defaultKategori={activeTab}
                onSuccess={() => setOpenForm(false)}
              />
            </DialogContent>
          </Dialog>
        ) : (
          <Drawer open={openForm} onOpenChange={setOpenForm}>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>
                  {selectedHalaqoh ? "Edit Halaqoh" : "Buat Halaqoh Baru"}
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4">
                <HalaqohForm
                  initialData={selectedHalaqoh}
                  studentsList={waitingStudent}
                  defaultKategori={activeTab}
                  onSuccess={() => setOpenForm(false)}
                />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </div>
  );
}

export default HalaqohManagement;
