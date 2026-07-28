import React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

import { useState, useMemo } from "react";
import { useGetWaitingPretestQuery } from "../../store/api/studentsApi";
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

import { Skeleton } from "@/components/ui/skeleton";
import PretestForm from "../../components/tahsin-tahfidz/tahsin/pretest/PretestForm";

function PretestManagement() {
  const [search, setSearch] = useState("");
  const { data, isLoading } = useGetWaitingPretestQuery();

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("only screen and (min-width:768px)");

  const allStudents = Array.isArray(data?.data)
    ? data.data
    : Array.isArray(data)
      ? data
      : [];

  const filteredNewStudents = useMemo(() => {
    if (!search) return allStudents;
    const keyword = search.toLowerCase();
    return allStudents.filter(
      (s) =>
        s.nama?.toLowerCase().includes(keyword) ||
        s.nis?.toLowerCase().includes(keyword)
    );
  }, [allStudents, search]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 py-6 w-full animate-in fade-in duration-500">
        <div className="flex gap-4">
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="flex flex-col gap-3 mt-4">
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
          <Skeleton className="h-16 w-full rounded-xl" />
        </div>
      </div>
    );
  }

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
            <div className="overflow-y-auto max-h-[80vh]">
              <div className="p-4">
                <PretestForm
                  initialData={selectedStudent}
                  onSuccess={() => setOpen(false)}
                />
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default PretestManagement;
