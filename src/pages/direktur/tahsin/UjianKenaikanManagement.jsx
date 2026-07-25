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
  const { data: pengajuanData, isLoading } =
    useGetDaftarPengajuanQuery("TAHSIN");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);

  const isDesktop = useMediaQuery("only screen and (min-width:768px)");

  if (isLoading) return <p className="text-center">Memuat data siswa...</p>;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full gap-5">
        <SearchInput />
      </div>
      <UjianTableContainer
        dataPengajuan={pengajuanData?.data || []}
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
