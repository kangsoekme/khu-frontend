import React from "react";
import { useState } from "react";

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

import { toast } from "sonner";

import { useAddPretestMutation } from "../../../../store/api/tahsinApi";

function PretestForm({ initialData, onSuccess }) {
  const tahap = [
    { label: "Jilid 1", value: "JILID_1" },
    { label: "Jilid 2", value: "JILID_2" },
    { label: "Jilid 3", value: "JILID_3" },
    { label: "Jilid 4", value: "JILID_4" },
    { label: "Jilid 5", value: "JILID_5" },
    { label: "Jilid 6", value: "JILID_6" },
    { label: "Tilawah Juz 1-5", value: "TILAWAH_JUZ_1_5" },
    { label: "Gharib", value: "GHARIB" },
    { label: "Tajwid", value: "TAJWID" },
    { label: "Al-Quran", value: "ALQURAN" },
    { label: "Munaqosyah", value: "MUNAQOSYAH" },
  ];

  const [addPretest, { isLoading }] = useAddPretestMutation();
  const [tahapanValue, setTahapanValue] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!data.tahapan) {
      toast.error("Mohon isi tahapan terlebih dahulu");
      return;
    }

    try {
      await addPretest({
        nis: data.nis,
        keterangan: data.keterangan,
        tahapan: data.tahapan,
      }).unwrap();

      toast.success("Hasil Pretest berhasil disimpan");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Gagal menyimpan hasil pretest");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden text-left">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nama Lengkap</Label>
          <Input
            type="text"
            name="nama"
            id="name"
            placeholder="Ahmad Fulan"
            defaultValue={initialData?.nama}
            readOnly
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="nis">NIS</Label>
          <Input
            type="text"
            name="nis"
            id="nis"
            placeholder="123789456"
            defaultValue={initialData?.nis}
            readOnly
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="keterangan">Catatan / Keterangan</Label>
          <Textarea
            id="keterangan"
            name="keterangan"
            defaultValue={initialData?.keterangan}
            className="min-h-20 break-all w-full bg-white"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Label>Pilih Tahapan</Label>
          <>
            <input type="hidden" name="tahapan" value={tahapanValue} />
            <Select items={tahap} onValueChange={setTahapanValue}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Tahapan Placement" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {tahap.map((item) => (
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

      <div className="shrink-0 pt-3 pb-2 bg-white dark:bg-neutral-900 border-t border-border mt-2 w-full">
        <Button type="submit" className="w-full font-semibold shadow-xs" disabled={isLoading}>
          {isLoading ? "Menyimpan..." : "Simpan Hasil Pretest"}
        </Button>
      </div>
    </form>
  );
}

export default PretestForm;
