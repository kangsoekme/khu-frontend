import React from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import { format } from "date-fns";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { useState, useEffect } from "react";
import {
  useAddStudentMutation,
  useDeleteStudentMutation,
  useEditStudentMutation,
} from "../../store/api/studentsApi";

import { toast } from "sonner";

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

function StudentForm({ className, onSuccess, initialData, isEdit }) {
  const [date, setDate] = useState();
  const [genderValue, setGenderValue] = useState("");

  const [addStudent, { isLoading: isAdding }] = useAddStudentMutation();
  const [deleteStudent, { isLoading: isDeleting }] = useDeleteStudentMutation();
  const [editStudent, { isLoading: isEditing }] = useEditStudentMutation();

  const gender = [
    { label: "LAKI LAKI", value: "LAKI_LAKI" },
    { label: "PEREMPUAN", value: "PEREMPUAN" },
  ];

  useEffect(() => {
    if (initialData) {
      if (initialData.tanggal_lahir) {
        setDate(new Date(initialData.tanggal_lahir));
      }
      if (initialData.jenis_kelamin) {
        setGenderValue(initialData.jenis_kelamin);
      }
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      if (isEdit) {
        const finalData = { ...data, nis: initialData?.nis };
        await editStudent(finalData).unwrap();
        toast.success("Siswa berhasil diperbarui");
      } else {
        const finalData = { ...data };
        await addStudent(finalData).unwrap();
        toast.success("Siswa berhasil ditambahkan");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log("Error tambah siswa : ", error);
      toast.error(error.data?.message || "Gagal menambahkan siswa");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteStudent(initialData?.nis).unwrap();
      toast.success("Siswa berhasil dihapus");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log("Error hapus siswa : ", error);
      toast.error(error.data?.message || "Gagal menghapus siswa");
    }
  };

  const showDeleteButton = isEdit;

  return (
    <form
      className={cn("flex flex-col h-full overflow-hidden text-left", className)}
      onSubmit={handleSubmit}
    >
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        <div className="flex flex-col gap-3">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            type="text"
            name="nama"
            id="name"
            placeholder="Ahmad Fulan"
            defaultValue={initialData?.nama}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-3 w-full">
            <Label htmlFor="nis">NIS</Label>
            <Input
              id="nis"
              name="nis"
              placeholder="123456"
              defaultValue={initialData?.nis}
              readOnly={isEdit}
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Label htmlFor="gender">Jenis Kelamin</Label>
            <>
              <Select
                items={gender}
                onValueChange={setGenderValue}
                defaultValue={initialData?.jenis_kelamin}
              >
                <input type="hidden" name="jenis_kelamin" value={genderValue} />
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {gender.map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </>
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="tanggal_lahir">Tanggal Lahir</Label>
          <Popover>
            <input
              type="hidden"
              name="tanggal_lahir"
              value={date ? date.toISOString() : ""}
            />
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                data-empty={!date}
                className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                defaultValue={initialData?.tanggal_lahir}
              >
                {date ? (
                  format(date, "dd/MM/yyyy")
                ) : (
                  <span>Pilih tanggal lahir...</span>
                )}
                <ChevronDownIcon className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                defaultMonth={date}
                captionLayout="dropdown"
                fromYear={1990}
                toYear={new Date().getFullYear()}
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="alamat">Alamat</Label>
          <Textarea
            name="alamat"
            defaultValue={initialData?.alamat}
            className="min-h-25 break-all w-full"
          />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="nama_wali">Nama Wali Siswa</Label>
          <Input
            id="nama_wali"
            name="nama_wali"
            defaultValue={initialData?.nama_wali}
            placeholder="Ahmad Fulan"
          />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="no_telp">No. Telepon</Label>
          <Input
            id="no_telp"
            name="no_telp"
            defaultValue={initialData?.no_telp}
            placeholder="08123456789"
          />
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="kelas">Kelas</Label>
          <Input
            id="kelas"
            name="kelas"
            defaultValue={initialData?.riwayatKelas?.[0]?.nama_kelas}
            placeholder="VI-A"
          />
        </div>
      </div>
      <div
        className={cn(
          "shrink-0 pt-3 pb-2 bg-white dark:bg-neutral-900 border-t border-border mt-2 grid gap-3 w-full",
          showDeleteButton ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        {showDeleteButton && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="destructive"
                className="w-full"
                disabled={isDeleting}
              >
                {isDeleting ? "Menghapus ..." : "Hapus Siswa"}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak bisa dikembalikan, serta ini akan menghapus
                  data siswa ini secara permanen serta menghapus semua yang
                  berhubungan dengan siswa ini
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Hapus
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <Button
          type="submit"
          disabled={isAdding || isEditing}
          className="w-full"
        >
          {isAdding || isEditing ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
export default StudentForm;
