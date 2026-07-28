import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

import { useState } from "react";
import { useGetStudentsQuery } from "../../store/api/studentsApi";
import { SearchInput } from "../../components/ui/SearchInput";
import PretestTableContainer from "../../components/tahsin-tahfidz/tahsin/pretest/PretestTableContainer";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";

import PretestForm from "../../components/tahsin-tahfidz/tahsin/pretest/PretestForm";
function PretestManagement() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetStudentsQuery();

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("only screen and (min-width:768px)");

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <p className="text-neutral-500 font-medium">
          Memuat data siswa baru...
        </p>
      </div>
    );
  }

  const allStudents = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const newStudents = allStudents.filter(
    (student) => !student.tahapan_tahsin || student.tahapan_tahsin === "",
  );

  const filteredNewStudents = newStudents.filter((s) => {
    const keyword = search.toLowerCase();
    return (
      s.nama?.toLowerCase().includes(keyword) ||
      s.nis?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full gap-5">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari siswa pretest..."
        />
      </div>

      <PretestTableContainer
        students={filteredNewStudents}
        onRowClick={(student) => {
          setSelectedStudent(student);
          setOpen(true);
        }}
      />

      {isDesktop && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-130">
            <DialogHeader>
              <DialogTitle>Input Nilai Placement</DialogTitle>
              <DialogDescription>
                Berikan penilaian untuk penempatah tahap tahsin siswa
              </DialogDescription>
            </DialogHeader>
            <PretestForm
              initialData={selectedStudent}
              onSuccess={() => setOpen(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {!isDesktop && (
        <Drawer>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Input Nilai Placement</DrawerTitle>
              <DrawerDescription>
                Berikan penilaian untuk penempatah tahap tahsin siswa
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea>
              <div className="p-4">
                <PretestForm
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

export default PretestManagement;
