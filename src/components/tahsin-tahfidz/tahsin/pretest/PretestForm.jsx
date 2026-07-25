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

import { FaMinus } from "react-icons/fa";

import { FaPlus } from "react-icons/fa";

import { toast } from "sonner";

import { useAddPretestMutation } from "../../../../store/api/tahsinApi";

function PretestForm({ initialData, onSuccess }) {
  const tahap = [
    {
      label: "Jilid 1",
      value: "JILID_1",
    },
    {
      label: "Jilid 2",
      value: "JILID_2",
    },
    {
      label: "Jilid 3",
      value: "JILID_3",
    },
    {
      label: "Jilid 4",
      value: "JILID_4",
    },
    {
      label: "Jilid 5",
      value: "JILID_5",
    },
    {
      label: "Jilid 6",
      value: "JILID_6",
    },
    {
      label: "Tajwid",
      value: "TAJWID",
    },
    {
      label: "Gharib",
      value: "GHARIB",
    },
    {
      label: "Al-Quran",
      value: "ALQURAN",
    },
  ];

  const daftarNilai = ["D", "C-", "C", "C+", "B-", "B", "B+", "A", "A+"];

  const [addPretest, { isLoading }] = useAddPretestMutation();
  const [tahapanValue, setTahapanValue] = useState("");
  const [nilaiIndex, setNilaiIndex] = useState(8);

  const kurangNilai = () => {
    if (nilaiIndex > 0) {
      setNilaiIndex(nilaiIndex - 1);
    }
  };

  const tambahNilai = () => {
    if (nilaiIndex < daftarNilai.length - 1) {
      setNilaiIndex(nilaiIndex + 1);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (!data.tahapan) {
      toast.error("Mohon isis tahapan terlebih dahulu");
    }

    try {
      await addPretest({
        nis: data.nis,
        nilai: data.nilai,
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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="flex flex-col gap-5">
        <Label htmlFor="email">Nama Lengkap</Label>
        <Input
          type="text"
          name="nama"
          id="name"
          placeholder="Ahmad Fulan"
          defaultValue={initialData?.nama}
          readOnly
        />
      </div>
      <div className="flex flex-col gap-5">
        <Label htmlFor="email">NIS</Label>
        <Input
          type="text"
          name="nis"
          id="nis"
          placeholder="123789456"
          defaultValue={initialData?.nis}
          readOnly
        />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Label htmlFor="alamat">Keterangan</Label>
        <Textarea
          name="keterangan"
          defaultValue={initialData?.keterangan}
          className="min-h-25 break-all w-full"
        />
      </div>

      <div className="flex flex-col gap-5 items-center">
        <Label>PENILAIAN TAHSIN</Label>
        <div className="flex items-center gap-5">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={kurangNilai}
          >
            <FaMinus />
          </Button>

          <span>{daftarNilai[nilaiIndex]}</span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={tambahNilai}
          >
            <FaPlus />
          </Button>
        </div>
        <input type="hidden" name="nilai" value={daftarNilai[nilaiIndex]} />
      </div>

      <div className="flex flex-col gap-3 w-full">
        <Label htmlFor="username">Pilih Tahapan</Label>
        <>
          <input type="hidden" name="tahapan" value={tahapanValue} />
          <Select items={tahap} onValueChange={setTahapanValue}>
            <SelectTrigger className="w-full">
              <SelectValue />
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

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Menyimpan..." : "Simpan Hasil Pretest"}{" "}
      </Button>
    </form>
  );
}

export default PretestForm;
