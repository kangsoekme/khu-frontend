// import React from "react";
import { useState, useRef } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

import StudentTableContainer from "../../components/student-table/StudentTableContainer";

import { Button } from "@/components/ui/button";
import { SearchInput } from "../../components/ui/SearchInput.jsx";

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
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import StudentForm from "../../components/student-user/StudentForm.jsx";

import { ScrollArea } from "@/components/ui/scroll-area";

import { FaPlus } from "react-icons/fa6";
import {
  useGetStudentsQuery,
  useImportStudentMutation,
} from "../../store/api/studentsApi.js";

import { FaFileImport } from "react-icons/fa";

import { toast } from "sonner";

function StudentManagement() {
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const fileInputRef = useRef(null);
  const [importStudent, { isLoading: isImporting }] =
    useImportStudentMutation();

  const {
    data: studentsData,
    isLoading,
    isError,
    refetch,
  } = useGetStudentsQuery();
  const students = studentsData?.data || [];

  const filteredStudents = students.filter((s) => {
    const keyword = search.toLowerCase();
    return (
      s.nama?.toLowerCase().includes(keyword) ||
      s.nis?.toLowerCase().includes(keyword)
    );
  });

  const handleRowClick = (student) => {
    setSelectedStudent(student);
    setOpenEdit(true);
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await importStudent(formData).unwrap();
      const toastId = toast.loading("Sedang memproses data excel ...");

      event.target.value = null;

      setTimeout(() => {
        refetch();

        toast.success("File excel berhasil diunggah", { id: toastId });
      }, 3000);
    } catch (error) {
      toast.error(error.data?.message || "Gagal import data");
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full gap-5">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama / NIS siswa..."
        />

        <input
          type="file"
          name=""
          id=""
          accept=".xlsx, .xls"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileUpload}
        />

        <Button
          variant="outline"
          disabled={isImporting}
          onClick={() => fileInputRef.current.click()}
        >
          <span className="hidden xl:block">
            {isImporting ? "Mengunggah...." : "Import Excel"}
          </span>
          <FaFileImport className="xl:hidden" />
        </Button>

        <Button onClick={() => setOpen(true)}>
          <span className="hidden xl:block">Tambah Siswa</span>
          <FaPlus className="xl:hidden" />
        </Button>
      </div>
      {isLoading ? (
        <p>Memuat data siswa</p>
      ) : (
        <StudentTableContainer
          students={filteredStudents}
          onRowClick={handleRowClick}
        />
      )}

      {/* tambah siswa */}
      {isDesktop && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={<Button variant="outline">Edit Profile</Button>}
          />
          <DialogContent className="sm:max-w-130">
            <DialogHeader>
              <DialogTitle>Tambah Siswa</DialogTitle>
              <DialogDescription>
                Tambah data siswa untuk kebutuhan komputasi
              </DialogDescription>
            </DialogHeader>
            <StudentForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      )}

      {!isDesktop && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger
            render={<Button variant="outline">Edit Profile</Button>}
          />
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Tambah Siswa</DrawerTitle>
              <DrawerDescription>
                Tambah data siswa untuk kebutuhan komputasi
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-100">
              <StudentForm className="p-4" onSuccess={() => setOpen(false)} />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}

      {/* edit siswa */}
      {isDesktop && (
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogTrigger
            render={<Button variant="outline">Edit Profile</Button>}
          />
          <DialogContent className="sm:max-w-130">
            <DialogHeader>
              <DialogTitle>Edit Siswa</DialogTitle>
              <DialogDescription>
                Tambah data siswa untuk kebutuhan komputasi
              </DialogDescription>
            </DialogHeader>
            <StudentForm
              initialData={selectedStudent}
              isEdit={true}
              onSuccess={() => setOpenEdit(false)}
            />
          </DialogContent>
        </Dialog>
      )}

      {!isDesktop && (
        <Drawer open={openEdit} onOpenChange={setOpenEdit}>
          <DrawerTrigger
            render={<Button variant="outline">Edit Profile</Button>}
          />
          <DrawerContent>
            <DrawerHeader className="text-left">
              <DrawerTitle>Edit Siswa</DrawerTitle>
              <DrawerDescription>
                Tambah data siswa untuk kebutuhan komputasi
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-100">
              <StudentForm
                className="p-4"
                initialData={selectedStudent}
                isEdit={true}
                onSuccess={() => setOpenEdit(false)}
              />
            </ScrollArea>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default StudentManagement;
