import React from "react";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { SearchInput } from "../../../components/ui/SearchInput";
import UjianTableContainer from "../../../components/tahsin-tahfidz/tahsin/ujian/UjianTableContainer";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_API_URL } from "../../../store/baseApi";
import { toast } from "sonner";
import { FaFileExcel } from "react-icons/fa";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import UjianKenaikanForm from "../../../components/tahsin-tahfidz/tahsin/ujian/UjianKenaikanForm";

import { useGetDaftarPengajuanQuery } from "../../../store/api/pengajuanApi";

function UjianKenaikanManagement() {
  const [search, setSearch] = useState("");
  const { data: pengajuanData, isLoading } =
    useGetDaftarPengajuanQuery("TAHSIN");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("only screen and (min-width:768px)");
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadMunaqosyah = async () => {
    try {
      setIsDownloading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_API_URL}/export/munaqosyah`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) throw new Error("Gagal mengunduh laporan munaqosyah");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Data_Pengajuan_Munaqosyah_${new Date().toISOString().split("T")[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Laporan Munaqosyah berhasil diunduh!");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat mengunduh laporan munaqosyah");
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) return <p className="text-center">Memuat data siswa...</p>;

  const pengajuanList = pengajuanData?.data || [];
  const filteredPengajuan = pengajuanList.filter((item) => {
    const keyword = search.toLowerCase();
    return (
      item.siswa?.nama?.toLowerCase().includes(keyword) ||
      item.siswa?.nis?.toLowerCase().includes(keyword) ||
      item.guru?.nama?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full gap-5">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari siswa atau guru penguji..."
          className="h-full"
        />
        <Button
          onClick={handleDownloadMunaqosyah}
          disabled={isDownloading}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          <FaFileExcel className="md:mr-2" />
          <span className="hidden md:inline">
            {isDownloading ? "Mengunduh..." : "Data Munaqosyah"}
          </span>
        </Button>
      </div>
      <UjianTableContainer
        dataPengajuan={filteredPengajuan}
        onRowClick={(student) => {
          setSelectedStudent(student);
          setOpen(true);
        }}
      />

      {isDesktop && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-125 max-h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader className="shrink-0">
              <DialogTitle>Ujian Kenaikan Jilid</DialogTitle>
              <DialogDescription>
                Masukkan hasil ujian untuk menentukkan kenaikan tahapan / jilid
                siswa
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden flex flex-col">
              <UjianKenaikanForm
                initialData={selectedStudent}
                onSuccess={() => setOpen(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {!isDesktop && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[90vh] flex flex-col">
            <DrawerHeader className="text-left shrink-0">
              <DrawerTitle>Ujian Kenaikan Jilid</DrawerTitle>
              <DrawerDescription>
                Masukkan hasil ujian untuk menentukkan kenaikan tahapan / jilid
                siswa
              </DrawerDescription>
            </DrawerHeader>

            <div className="px-4 flex-1 overflow-hidden flex flex-col pb-3">
              <UjianKenaikanForm
                initialData={selectedStudent}
                onSuccess={() => setOpen(false)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default UjianKenaikanManagement;
