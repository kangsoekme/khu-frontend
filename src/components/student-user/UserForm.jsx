import { useState, useEffect } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import {
  useAddUserMutation,
  useDeleteUserMutation,
  useEditUserMutation,
} from "../../store/api/usersApi.js";

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

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Switch } from "@/components/ui/switch";

import { toast } from "sonner";

function UserForm({ className, onSuccess, initialData, isEdit }) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [editUser, { isLoading: isEditing }] = useEditUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const [genderValue, setGenderValue] = useState(
    initialData?.jenis_kelamin || "LAKI_LAKI",
  );
  const [isSertifikasi, setIsSertifikasi] = useState(
    initialData?.is_sertifikasi || false,
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    const parsedData = {
      ...data,
      jenis_kelamin: genderValue,
      is_sertifikasi:
        data.is_sertifikasi === "true" || data.is_sertifikasi === true,
    };

    try {
      if (isEdit) {
        const finalData = { ...parsedData, id: initialData?.id };

        await editUser(finalData).unwrap();
        toast.success("User berhasil diperbarui");
      } else {
        const finalData = { ...parsedData, role: "GURU" };

        await addUser(finalData).unwrap();
        toast.success("User berhasil ditambahkan");
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log("Error tambah user : ", error);
      toast.error(error.data?.message || "Gagal menambahkan user");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(initialData?.id).unwrap();
      toast.success("User berhasil dihapus");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log("Error hapus user : ", error);
      toast.error(error.data?.message || "Gagal hapus user");
    }
  };

  const showDeleteButton =
    isEdit &&
    initialData?.role !== "SUPER_ADMIN" &&
    isEdit &&
    initialData?.role !== "DIREKTUR";

  if (!isReady) {
    return (
      <div className="flex flex-col gap-6 py-6 w-full animate-pulse">
        <div className="h-10 bg-muted rounded-md w-full" />
        <div className="flex gap-3">
          <div className="h-10 bg-muted rounded-md w-full" />
          <div className="h-10 bg-muted rounded-md w-full" />
        </div>
        <div className="h-10 bg-muted rounded-md w-full" />
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className={cn("grid items-start gap-6 h-full", className)}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input
            type="text"
            id="nama"
            name="nama"
            placeholder="Ahmad Fulan"
            defaultValue={isEdit ? initialData?.nama : ""}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-3 w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="example@mail.com"
              autoComplete="new-password"
              defaultValue={isEdit ? initialData?.email : ""}
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Label htmlFor="no_telp">No. Telepon</Label>
            <Input
              id="no_telp"
              name="no_telp"
              placeholder="08123456789"
              defaultValue={isEdit ? initialData?.no_telp : ""}
            />
          </div>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Label>Jenis Kelamin</Label>
          <Select value={genderValue} onValueChange={setGenderValue}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Jenis Kelamin" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="LAKI_LAKI">Laki-Laki (Ustadz)</SelectItem>
                <SelectItem value="PEREMPUAN">Perempuan (Ustadzah)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            autoComplete="new-password"
            defaultValue={isEdit ? initialData?.password : ""}
          />
        </div>
        <div className="flex items-center w-full gap-3 justify-end">
          <Checkbox
            id="show-password"
            checked={showPassword}
            onCheckedChange={(checked) => setShowPassword(checked)}
          />
          <Label>Tampilkan Password</Label>
        </div>

        <div className="flex items-center justify-between p-4 border rounded-lg bg-neutral-50/50">
          <div className="flex flex-col gap-0.5">
            <Label
              htmlFor="is_sertifikasi"
              className="text-sm font-semibold text-neutral-800"
            >
              Sertifikasi Al-Quran / Ummi
            </Label>
            <p className="text-xs text-neutral-500">
              Aktifkan jika guru sudah memiliki syahadah/sertifikasi resmi
            </p>
          </div>
          <Switch
            id="is_sertifikasi"
            checked={isSertifikasi}
            onCheckedChange={(checked) => setIsSertifikasi(checked)}
          />
          {/* Input hidden ini sangat penting agar nilai dari Switch terbaca oleh FormData! */}
          <input
            type="hidden"
            name="is_sertifikasi"
            value={isSertifikasi ? "true" : "false"}
          />
        </div>
      </div>

      <div
        className={cn(
          "grid gap-3 w-full mt-6",
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
                {isDeleting ? "Menghapus ..." : "Hapus User"}
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak bisa dikembalikan, serta ini akan menghapus
                  data user ini secara permanen serta menghapus semua yang
                  berhubungan dengan user ini
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
          className="w-full "
        >
          {isAdding || isEditing ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </form>
  );
}
export default UserForm;
