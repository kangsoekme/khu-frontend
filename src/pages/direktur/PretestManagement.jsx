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
  const { data, isLoading } = useGetStudentsQuery();

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("only screen and (min-width:768px)");

  if (isLoading) return <p>Memua data siswa baru...</p>;

  const newStudents = data?.data?.filter(
    (student) => student.tahapan_tahsin === null,
  );

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full gap-5">
        <SearchInput />
      </div>

      <PretestTableContainer
        students={newStudents}
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
