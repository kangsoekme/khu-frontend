import React, { useState, useEffect } from "react";

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
import { useGetAllSurahQuery } from "../../../../store/api/surahApi";

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
  const { data: surahData } = useGetAllSurahQuery();
  const surahs = surahData?.data || [];

  const [tahapanValue, setTahapanValue] = useState("");
  const [jilidValue, setJilidValue] = useState("1");
  const [halamanValue, setHalamanValue] = useState("1");
  const [materiValue, setMateriValue] = useState("");
  const [selectedSurah, setSelectedSurah] = useState("");
  const [ayatTerakhirValue, setAyatTerakhirValue] = useState("");

  const isJilid = ["JILID_1", "JILID_2", "JILID_3", "JILID_4", "JILID_5", "JILID_6"].includes(tahapanValue);
  const isGharibTajwid = ["GHARIB", "TAJWID"].includes(tahapanValue);
  const isQuran = ["TILAWAH_JUZ_1_5", "ALQURAN", "MUNAQOSYAH"].includes(tahapanValue);

  const handleTahapanChange = (val) => {
    setTahapanValue(val);
    if (val.startsWith("JILID_")) {
      const jNum = val.replace("JILID_", "");
      setJilidValue(jNum);
      setHalamanValue("1");
    } else if (val === "GHARIB") {
      setMateriValue("Gharib");
      setHalamanValue("1");
    } else if (val === "TAJWID") {
      setMateriValue("Tajwid");
      setHalamanValue("1");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!tahapanValue) {
      toast.error("Mohon isi tahapan terlebih dahulu");
      return;
    }

    const payload = {
      nis: initialData?.nis,
      keterangan: e.target.keterangan?.value || "",
      tahapan: tahapanValue,
    };

    if (isJilid) {
      payload.jilid = Number(jilidValue);
      payload.halaman = Number(halamanValue) || 1;
    } else if (isGharibTajwid) {
      payload.materi = materiValue || (tahapanValue === "GHARIB" ? "Gharib" : "Tajwid");
      payload.halaman = Number(halamanValue) || 1;
      if (selectedSurah) payload.no_surah = Number(selectedSurah);
      if (ayatTerakhirValue) {
        payload.ayat_akhir = Number(ayatTerakhirValue);
        payload.ayat_awal = Number(ayatTerakhirValue);
      }
    } else if (isQuran) {
      if (selectedSurah) payload.no_surah = Number(selectedSurah);
      if (ayatTerakhirValue) {
        payload.ayat_akhir = Number(ayatTerakhirValue);
        payload.ayat_awal = Number(ayatTerakhirValue);
      }
    }

    try {
      await addPretest(payload).unwrap();
      toast.success("Hasil Pretest placement berhasil disimpan");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error.data?.message || "Gagal menyimpan hasil pretest");
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
          <Label>Pilih Tahapan Placement</Label>
          <Select onValueChange={handleTahapanChange}>
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
        </div>

        {/* INPUT UNTUK TAHAPAN JILID 1-6 */}
        {isJilid && (
          <div className="p-3 bg-blue-50/60 rounded-lg border border-blue-200 space-y-3">
            <span className="text-xs font-bold text-blue-800 uppercase block">Detail Placement Jilid Ummi</span>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs font-semibold">Jilid</Label>
                <Input type="number" value={jilidValue} readOnly className="bg-white font-bold" />
              </div>
              <div>
                <Label className="text-xs font-semibold">Halaman Terakhir Dibaca</Label>
                <Input
                  type="number"
                  min={1}
                  max={40}
                  value={halamanValue}
                  onChange={(e) => setHalamanValue(e.target.value)}
                  placeholder="1 - 40"
                  className="bg-white font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* INPUT UNTUK TILAWAH / ALQURAN / MUNAQOSYAH */}
        {isQuran && (
          <div className="p-3 bg-emerald-50/60 rounded-lg border border-emerald-200 space-y-3">
            <span className="text-xs font-bold text-emerald-800 uppercase block">Detail Placement Bacaan Qur'an</span>
            <div className="flex flex-col gap-3">
              <div>
                <Label className="text-xs font-semibold">Surah Terakhir Dibaca</Label>
                <Select onValueChange={setSelectedSurah}>
                  <SelectTrigger className="bg-white w-full">
                    <SelectValue placeholder="Pilih Surah..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectGroup>
                      {surahs.map((s) => (
                        <SelectItem key={s.no_surah} value={String(s.no_surah)}>
                          {s.no_surah}. {s.nama_surah}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold">Ayat Terakhir Dibaca</Label>
                <Input
                  type="number"
                  min={1}
                  value={ayatTerakhirValue}
                  onChange={(e) => setAyatTerakhirValue(e.target.value)}
                  placeholder="Contoh: 15"
                  className="bg-white font-medium"
                />
              </div>
            </div>
          </div>
        )}

        {/* INPUT UNTUK GHARIB & TAJWID */}
        {isGharibTajwid && (
          <div className="p-3 bg-amber-50/60 rounded-lg border border-amber-200 space-y-3">
            <span className="text-xs font-bold text-amber-800 uppercase block">Detail Placement Gharib / Tajwid</span>
            <div className="grid grid-cols-2 gap-3 mb-2">
              <div>
                <Label className="text-xs font-semibold">Materi</Label>
                <Input
                  type="text"
                  value={materiValue}
                  onChange={(e) => setMateriValue(e.target.value)}
                  className="bg-white font-medium"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold">Halaman Jilid</Label>
                <Input
                  type="number"
                  min={1}
                  value={halamanValue}
                  onChange={(e) => setHalamanValue(e.target.value)}
                  placeholder="Contoh: 1"
                  className="bg-white font-medium"
                />
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <Label className="text-xs font-semibold">Surah Terakhir Dibaca</Label>
                <Select onValueChange={setSelectedSurah}>
                  <SelectTrigger className="bg-white w-full">
                    <SelectValue placeholder="Pilih Surah..." />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    <SelectGroup>
                      {surahs.map((s) => (
                        <SelectItem key={s.no_surah} value={String(s.no_surah)}>
                          {s.no_surah}. {s.nama_surah}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold">Ayat Terakhir Dibaca</Label>
                <Input
                  type="number"
                  min={1}
                  value={ayatTerakhirValue}
                  onChange={(e) => setAyatTerakhirValue(e.target.value)}
                  placeholder="Contoh: 148"
                  className="bg-white font-medium"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2 w-full">
          <Label htmlFor="keterangan">Catatan / Keterangan</Label>
          <Textarea
            id="keterangan"
            name="keterangan"
            defaultValue={initialData?.keterangan}
            placeholder="Catatan tambahan placement..."
            className="min-h-16 break-all w-full bg-white"
          />
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
