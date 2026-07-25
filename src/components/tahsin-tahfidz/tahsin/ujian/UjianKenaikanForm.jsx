import React from "react";
import { useAddUjianKenaikanMutation } from "../../../../store/api/ujianApi";
import { toast } from "sonner";

import { STATUS_PREDIKAT_TAHSIN } from "../../../../utils/constant";
import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";

function UjianKenaikanForm({ initialData, onSuccess }) {
  const [addUjian, { isLoading }] = useAddUjianKenaikanMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
      id_kelompok: initialData?.halaqoh_tahsin_id,
      tahapan_baru: formData.get("tahapan_baru"),
      nilai: formData.get("nilai"),
      keterangan: formData.get("keterangan"),
      status_kelulusan: formData.get("status_kelulusan"),
    };

    try {
      await addUjian({ nis: initialData.nis, ...payload }).unwrap();
      toast.success("Hasil ujian berhasil disimpan");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.data?.message || "Gagal menyimpan ujian");
      console.error(error);
    }
  };

  return (
    <form
      action=""
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 text-left"
    >
      <div className="p-4 rounded-lg">
        <p className="text-sm font-medium">Siswa:{initialData?.nama}</p>
        <p className="text-xs text-neutral-textmuted">
          Tahapan saat ini : {initialData?.tahapan_tahsin || "Belum ada"}
        </p>
      </div>

      <Field>
        <FieldLabel>Ujian Kenaikan Jilid Ummi</FieldLabel>
        <Select name="tahapan_baru" required>
          <SelectTrigger>
            <SelectValue placeholder="Pilih tahapan / jilid" />
          </SelectTrigger>

          <SelectContent>
            <SelectGroup>
              <SelectItem value="JILID_1">Jilid 1</SelectItem>
              <SelectItem value="JILID_2">Jilid 2</SelectItem>
              <SelectItem value="JILID_3">Jilid 3</SelectItem>
              <SelectItem value="JILID_4">Jilid 4</SelectItem>
              <SelectItem value="JILID_5">Jilid 5</SelectItem>
              <SelectItem value="JILID_6">Jilid 6</SelectItem>
              <SelectItem value="TAJWID">Tajwid</SelectItem>
              <SelectItem value="GHARIB">Gharib</SelectItem>
              <SelectItem value="ALQURAN">Al-Quran</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field>
          <FieldLabel>Nilai Ujian</FieldLabel>
          <Select name="nilai" required>
            <SelectTrigger>
              <SelectValue placeholder="Pilih tahapan / jilid" />
            </SelectTrigger>

            <SelectContent>
              {Object.keys(STATUS_PREDIKAT_TAHSIN).map((key) => (
                <SelectItem key={key} value={key}>
                  {key}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Keputusan</FieldLabel>
          <Select name="status_kelulusan">
            <SelectTrigger>
              <SelectValue placeholder="status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="LULUS" className="text-green-600 font-bold">
                LULUS
              </SelectItem>
              <SelectItem
                value="TIDAK_LULUS"
                className="text-red-600 font-bold"
              >
                TIDAK LULUS
              </SelectItem>
            </SelectContent>
          </Select>
        </Field>

        <Field>
          <FieldLabel>Catatan</FieldLabel>
          <Textarea name="keterangan" className="min-h-25 break-all w-full" />
        </Field>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Menyimpan" : "Simpan Hasil Ujian"}
        </Button>
      </div>
    </form>
  );
}

export default UjianKenaikanForm;
