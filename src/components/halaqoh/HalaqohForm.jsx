import React from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersQuery } from "../../store/api/usersApi";
import {
  useAddHalaqohMutation,
  useDeleteHalaqohMutation,
  useEditHalaqohMutation,
} from "../../store/api/halaqohApi";

function HalaqohForm({ initialData, studentsList, onSuccess }) {
  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery();
  const daftarGuru =
    usersData?.data?.filter((user) => user.role === "GURU") || [];

  const [kategori, setKategori] = useState(initialData?.kategori || "");
  const [guruId, setGuruId] = useState(initialData?.guru?.id || "");

  const [addHalaqoh, { isLoading: isAdding }] = useAddHalaqohMutation();
  const [deleteHalaqoh, { isLoading: isDeleting }] = useDeleteHalaqohMutation();
  const [editHalaqoh, { isLoading: isEditing }] = useEditHalaqohMutation();

  const [selectedNis, setSelectedNis] = useState(
    initialData?.siswa?.map((s) => s.nis) || [],
  );

  const handleCheckboxChange = (nis, isChecked) => {
    if (isChecked) {
      setSelectedNis((prev) => [...prev, nis]);
    } else {
      setSelectedNis((prev) => prev.filter((id) => id !== nis));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!kategori || !guruId) {
      toast.error("Pili kategori dan guru terlebih dahulu");
      return;
    }

    const payload = {
      nama: data.nama,
      kategori: kategori,
      userId: guruId,
      nis_siswa: selectedNis,
    };

    try {
      if (initialData) {
        await editHalaqoh({
          id: initialData.id,
          updatedHalaqoh: payload,
        }).unwrap();
        toast.success("Perubahan halaqoh berhasil di simpan");
      } else {
        await addHalaqoh(payload).unwrap();
        toast.success("Halaqoh berhasil disimpan");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.log("Error tambah siswa : ", error);
      toast.error(error.data?.mesage || "Gagal membuat halaqoh");
    }
  };

  return (
    <form action="" onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        <Label>Nama Halaqoh</Label>
        <Input
          type="text"
          name="nama"
          placeholder="Abu Bakar Ash Shiddiq"
          defaultValue={initialData?.nama_halaqoh}
          required
        />
      </div>

      <div className="flex flex-col gap-3">
        <Label>Kategori Program</Label>
        <Select
          onValueChange={setKategori}
          defaultValue={initialData?.kategori}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Pilih Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="TAHSIN">Tahsin Qiraah</SelectItem>
              <SelectItem value="TAHFIDZ">Tahfidz Quran</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-5">
        <Label>Guru</Label>
        <Select
          items={daftarGuru}
          onValueChange={setGuruId}
          defaultValue={initialData?.guruId}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {daftarGuru.map((guru) => (
                <SelectItem key={guru.id} value={guru.id}>
                  {guru.nama}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-3 border p-4 rounded-md h-64 overflow-y-auto">
        <Label>Pilih siswa dalam kelompok</Label>
        {studentsList?.length === 0 ? (
          <p className="text-sm text-neutral-textmuted">
            Tidak ada siswa yang tersedia
          </p>
        ) : (
          studentsList?.map((student) => (
            <div
              key={student.nis}
              className="flex items-center space-x-3 bg-gray-50 p-2 rounded-md"
            >
              <Checkbox
                id={`chk-${student.nis}`}
                checked={selectedNis.includes(student.nis)}
                onCheckedChange={(checked) =>
                  handleCheckboxChange(student.nis, checked)
                }
              />
              <label
                htmlFor={`chk-${student.nis}`}
                className="text-sm cursor-pointer w-full font-medium leading-0 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {student.nama}
                {""}
                <span className="text-gray-400 font-normal">
                  ({student.tahapan_tahsin || student.tahapan_tahfidz})
                </span>
              </label>
            </div>
          ))
        )}
      </div>

      <Button type="submit" className="w-full mt-4">
        Simpan
      </Button>
    </form>
  );
}

export default HalaqohForm;
