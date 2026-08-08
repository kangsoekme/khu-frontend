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
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import StudentForm from "../../components/student-user/StudentForm.jsx";

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

import { ScrollArea } from "@/components/ui/scroll-area";

import { FaPlus } from "react-icons/fa6";
import {
  useGetStudentsQuery,
  useImportStudentMutation,
  useDeleteBulkStudentsMutation,
} from "../../store/api/studentsApi.js";

import { FaFileImport } from "react-icons/fa";
import { FaFileExcel } from "react-icons/fa6";

import { toast } from "sonner";
import { downloadStudentTemplate } from "../../utils/exportExcel.js";

function StudentManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [deleteBulk, { isLoading: isDeletingBulk }] =
    useDeleteBulkStudentsMutation();

  const fileInputRef = useRef(null);
  const [importStudent, { isLoading: isImporting }] =
    useImportStudentMutation();

  const {
    data: studentsData,
    isLoading,
    isError,
    refetch,
  } = useGetStudentsQuery({ page: currentPage, limit: 7, search });
  const students = studentsData?.data || [];
  const totalPages = studentsData?.meta?.totalPages || 1;

  // Query untuk mendapatkan seluruh daftar NIS siswa sesuai filter pencarian (tanpa batas halaman)
  const { data: allStudentsData } = useGetStudentsQuery({ limit: 10000, search });
  const allMatchingNisList = (allStudentsData?.data || []).map((s) => s.nis);
  const totalMatchingCount = studentsData?.meta?.totalData || allMatchingNisList.length;

  const filteredStudents = students;

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

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStudents(allMatchingNisList);
    } else {
      setSelectedStudents([]);
    }
  };
  const handleSelectRow = (nis) => {
    setSelectedStudents((prev) =>
      prev.includes(nis) ? prev.filter((id) => id !== nis) : [...prev, nis],
    );
  };
  const handleBulkDelete = async () => {
    try {
      await deleteBulk(selectedStudents).unwrap();
      toast.success(`${selectedStudents.length} siswa berhasil dihapus`);
      setSelectedStudents([]); // reset setelah berhasil
    } catch (error) {
      toast.error(error.data?.message || "Gagal menghapus siswa");
    }
  };

  return (
    <div className="flex flex-col gap-5 animate-in fade-in duration-500">
      <div className="flex w-full gap-5">
        <SearchInput
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Cari nama / NIS siswa..."
        />

        {selectedStudents.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="destructive"
                disabled={isDeletingBulk}
              >
                {isDeletingBulk
                  ? "Menghapus..."
                  : `Hapus (${selectedStudents.length})`}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Konfirmasi Hapus Massal</AlertDialogTitle>
                <AlertDialogDescription>
                  Apakah Anda yakin ingin menghapus {selectedStudents.length} data siswa terpilih? Tindakan ini tidak dapat dibatalkan.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700 text-white">
                  Ya, Hapus Data
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

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
          onClick={downloadStudentTemplate}
          title="Unduh format Excel kosong untuk diisi sebelum import"
        >
          <span className="hidden xl:block">Download Template</span>
          <FaFileExcel className="xl:hidden" />
        </Button>

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
        <p className="text-center py-10 text-neutral-500">Memuat data siswa...</p>
      ) : isError ? (
        <p className="text-center py-10 text-red-500">Gagal memuat data. Silakan coba lagi nanti.</p>
      ) : (
        <StudentTableContainer
          students={filteredStudents}
          onRowClick={handleRowClick}
          selectedStudents={selectedStudents}
          onSelectAll={handleSelectAll}
          onSelectRow={handleSelectRow}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => setCurrentPage(page)}
          totalMatchingCount={totalMatchingCount}
        />
      )}

      {/* tambah siswa */}
      {isDesktop && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="sm:max-w-130 max-h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader className="shrink-0">
              <DialogTitle>Tambah Siswa</DialogTitle>
              <DialogDescription>
                Tambah data siswa untuk kebutuhan komputasi
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden flex flex-col">
              <StudentForm onSuccess={() => setOpen(false)} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {!isDesktop && (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerContent className="max-h-[90vh] flex flex-col">
            <DrawerHeader className="text-left shrink-0">
              <DrawerTitle>Tambah Siswa</DrawerTitle>
              <DrawerDescription>
                Tambah data siswa untuk kebutuhan komputasi
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 flex-1 overflow-hidden flex flex-col pb-3">
              <StudentForm onSuccess={() => setOpen(false)} />
            </div>
          </DrawerContent>
        </Drawer>
      )}

      {/* edit siswa */}
      {isDesktop && (
        <Dialog open={openEdit} onOpenChange={setOpenEdit}>
          <DialogContent className="sm:max-w-130 max-h-[90vh] flex flex-col overflow-hidden">
            <DialogHeader className="shrink-0">
              <DialogTitle>Edit Siswa</DialogTitle>
              <DialogDescription>
                Tambah data siswa untuk kebutuhan komputasi
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-hidden flex flex-col">
              <StudentForm
                initialData={selectedStudent}
                isEdit={true}
                onSuccess={() => setOpenEdit(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {!isDesktop && (
        <Drawer open={openEdit} onOpenChange={setOpenEdit}>
          <DrawerContent className="max-h-[90vh] flex flex-col">
            <DrawerHeader className="text-left shrink-0">
              <DrawerTitle>Edit Siswa</DrawerTitle>
              <DrawerDescription>
                Tambah data siswa untuk kebutuhan komputasi
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-4 flex-1 overflow-hidden flex flex-col pb-3">
              <StudentForm
                initialData={selectedStudent}
                isEdit={true}
                onSuccess={() => setOpenEdit(false)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default StudentManagement;
