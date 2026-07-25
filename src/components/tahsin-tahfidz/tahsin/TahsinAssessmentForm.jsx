import React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAddTahsinMutation } from "../../../store/api/tahsinApi";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FaMinus } from "react-icons/fa";

import { FaPlus } from "react-icons/fa";

import { Textarea } from "@/components/ui/textarea";

import { Field, FieldDescription, FieldLabel } from "@/components/ui/field";
import { useGetAllSurahQuery } from "../../../store/api/surahApi";

function TahsinAssessmentForm({
  nis,
  halaqohId,
  tahapan,
  lastRiwayat,
  onSuccess,
}) {
  const [addTahsin, { isLoading }] = useAddTahsinMutation();
  const { data: surahRes } = useGetAllSurahQuery();
  const allSurah = surahRes?.data || [];
  const daftarNilai = ["D", "C-", "C", "C+", "B-", "B", "B+", "A", "A+"];

  const [nilaiIndex, setNilaiIndex] = useState(8);

  const isAlQuran = tahapan === "ALQURAN";

  const defaultJilid = tahapan?.includes("JILID")
    ? tahapan.replace("JILID_", "")
    : "";

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

    const payload = {
      halaqohId,
      tahapan: tahapan,
      no_surah: Number(formData.get("no_surah")) || null,
      hafalan_surah: Number(formData.get("hafalan_surah")),
      hafalan_ayat_awal: Number(formData.get("hafalan_ayat_awal")),
      hafalan_ayat_akhir: Number(formData.get("hafalan_ayat_akhir")),
      jilid: Number(formData.get("jilid")) || 0,
      bab: Number(formData.get("bab")) || null,
      ayat_awal: Number(formData.get("ayat_awal")) || 0,
      ayat_akhir: Number(formData.get("ayat_akhir")) || 0,
      nilai: formData.get("nilai") || daftarNilai[nilaiIndex],
      keterangan: formData.get("keterangan") || "-",
      status_kelanjutan: nilaiIndex >= 5 ? "LANJUT" : "MENGULANG",
    };

    try {
      await addTahsin({ nis, ...payload }).unwrap();
      toast.success("Penilaian tahsin berhasil disimpan!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.data?.message || "Gagal menyimpan penilaian");
      console.error("Error submit :", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-5">
        <Field>
          <FieldLabel>Hafalan Surah Pendek</FieldLabel>
          <Select name="hafalan_surah">
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {allSurah.map((surah) => (
                  <SelectItem
                    key={surah.no_surah}
                    value={surah.no_surah.toString()}
                  >
                    {surah.no_surah}. {surah.nama_surah}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-5">
            <Input name="hafalan_ayat_awal" placeholder="Ayat Awal" />
            <Input name="hafalan_ayat_akhir" placeholder="Ayat Akhir" />
          </div>
        </Field>
        <Field>
          <FieldLabel>Laporan Bacaan</FieldLabel>
          {!isAlQuran ? (
            <div className="flex gap-5">
              <Input
                placeholder="Jilid"
                name="jilid"
                type="number"
                readOnly
                defaultValue={
                  lastRiwayat?.laporan_bacaan?.jilid_surah || defaultJilid
                }
              />
              <Input name="bab" placeholder="Halaman : 10" />
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Select
                name="no_surah"
                defaultValue={
                  lastRiwayat?.laporan_bacaan?.jilid_surah
                    ? allSurah
                        .find(
                          (s) =>
                            s.nama_surah ===
                            lastRiwayat.laporan_bacaan.jilid_surah,
                        )
                        ?.no_surah.toString()
                    : undefined
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {allSurah.map((surah) => (
                      <SelectItem
                        key={surah.no_surah}
                        value={surah.no_surah.toString()}
                      >
                        {surah.no_surah}. {surah.nama_surah}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <div className="flex gap-5">
                <Input name="ayat_awal" placeholder="Ayat Awal" />
                <Input name="ayat_akhir" placeholder="Ayat Akhir" />
              </div>
            </div>
          )}
        </Field>
        <Field>
          <FieldLabel>PENILAIAN TAHSIN</FieldLabel>
          <div className="flex flex-col gap-5 items-center">
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
        </Field>
        <Field>
          <FieldLabel>Keterangan</FieldLabel>
          <Textarea name="keterangan" className="min-h-25 break-all w-full" />
        </Field>
        <Button>Tambah Setoran</Button>
      </div>
    </form>
  );
}

export default TahsinAssessmentForm;
