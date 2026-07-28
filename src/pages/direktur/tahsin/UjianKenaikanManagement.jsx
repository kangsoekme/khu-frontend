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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BASE_API_URL } from "../../../store/baseApi";
import { toast } from "sonner";
import { FaFileExcel } from "react-icons/fa";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

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
        />
        <Button onClick={handleDownloadMunaqosyah} disabled={isDownloading} className="h-11 bg-emerald-600 hover:bg-emerald-700">
          <FaFileExcel className="mr-2" />
          {isDownloading ? "Mengunduh..." : "Data Munaqosyah"}
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
          <DialogContent className="sm:max-w-125">
            <DialogHeader>
              <DialogTitle>Ujian Kenaikan Jilid</DialogTitle>
              <DialogDescription>
                Masukkan hasil ujian untuk menentukkan kenaikan tahapan / jilid
                siswa
              </DialogDescription>
            </DialogHeader>
            <UjianKenaikanForm
              initialData={selectedStudent}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {!isDesktop && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="sm:max-w-125">
            <DrawerHeader>
              <DrawerTitle>Ujian Kenaikan Jilid</DrawerTitle>
              <DrawerDescription>
                Masukkan hasil ujian untuk menentukkan kenaikan tahapan / jilid
                siswa
              </DrawerDescription>
            </DrawerHeader>

            <ScrollArea className="h-auto max-h-[80vh]">
              <div className="p-4">
                <UjianKenaikanForm
                  initialData={selectedStudent}
                  onSuccess={() => setOpen(false)}
                />
              </div>
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default UjianKenaikanManagement;
