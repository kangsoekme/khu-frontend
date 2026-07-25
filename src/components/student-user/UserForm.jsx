// import React from "react";
import { useState } from "react";

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

import { toast } from "sonner";

function UserForm({ className, onSuccess, initialData, isEdit }) {
  const [addUser, { isLoading: isAdding }] = useAddUserMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [editUser, { isLoading: isEditing }] = useEditUserMutation();

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
      if (isEdit) {
        const finalData = { ...data, id: initialData.id };

        await editUser(finalData).unwrap();
        toast.success("User berhasil diperbarui");
      } else {
        const finalData = { ...data, role: "GURU" };

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
      await deleteUser(initialData.id).unwrap();
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
    initialData.role !== "SUPER_ADMIN" &&
    isEdit &&
    initialData.role !== "DIREKTUR";

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("grid items-start gap-6", className)}
    >
      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          <Label htmlFor="nama">Nama Lengkap</Label>
          <Input
            type="text"
            id="nama"
            name="nama"
            placeholder="Ahmad Fulan"
            defaultValue={initialData?.nama}
          />
        </div>
        <div className="flex gap-3">
          <div className="flex flex-col gap-3 w-full">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              placeholder="example@mail.com"
              defaultValue={initialData?.email}
            />
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Label htmlFor="no_telp">No. Telepon</Label>
            <Input
              id="no_telp"
              name="no_telp"
              placeholder="08123456789"
              defaultValue={initialData?.no_telp}
            />
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            defaultValue={initialData?.password}
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
      </div>
      <div
        className={cn(
          "grid gap-3 w-full",
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
