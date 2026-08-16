import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  useAddTahsinMutation,
  useEditTahsinMutation,
} from "../../../store/api/tahsinApi";
import { toast } from "sonner";
import { formatEnum } from "../../../utils/formatEnum";
import { getKategoriTahapan, TARGET_BUKU } from "../../../utils/tahsinCompletion";
import { validasiAyatSurah, getMaxAyat } from "../../../utils/validasiAyat";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FaMinus, FaPlus } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";
import { Field, FieldLabel } from "@/components/ui/field";
import { useGetAllSurahQuery } from "../../../store/api/surahApi";
import { ScrollArea } from "@/components/ui/scroll-area";

function TahsinAssessmentForm({
  nis,
  halaqohId,
  tahapan,
  lastRiwayat,
  riwayatList = [],
  pretestData,
  editData,
  onSuccess,
}) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const [addTahsin, { isLoading: isAdding }] = useAddTahsinMutation();
  const [editTahsin, { isLoading: isEditing }] = useEditTahsinMutation();
  const { data: surahRes } = useGetAllSurahQuery();
  const allSurah = surahRes?.data || [];
  const surahJuz30 = allSurah.filter(
    (s) => s.no_surah >= 78 && s.no_surah <= 114,
  );
  const daftarNilai = ["D", "C-", "C", "C+", "B-", "B", "B+", "A", "A+"];

  const initialNilaiIndex =
    editData && daftarNilai.indexOf(editData.nilai_tahsin) !== -1
      ? daftarNilai.indexOf(editData.nilai_tahsin)
      : 8;
  const [nilaiIndex, setNilaiIndex] = useState(initialNilaiIndex);

  // Klasifikasi tahapan: BUKU (jilid 1-6), GANDA (Gharib/Tajwid), QURAN (Tilawah/Al-Quran/Munaqosyah)
  const kategori = getKategoriTahapan(tahapan);
  const isGharibOrTajwid = kategori === "GANDA";
  const isAlQuran = kategori === "QURAN";

  // Batas halaman buku sesuai kurikulum: Gharib 45, Jilid 1-6 & Tajwid 40
  const maxHalamanBuku = TARGET_BUKU[tahapan] || 40;

  // ===========================================================================
  // DEFAULT VALUE - LAPORAN BACAAN: BUKU (Jilid 1-6 atau Gharib/Tajwid)
  // ===========================================================================
  const rawJilidVal = editData
    ? editData.laporan_bacaan?.jilid || editData.laporan_bacaan?.jilid_surah
    : lastRiwayat?.laporan_bacaan?.jilid ||
      (tahapan?.includes("JILID") ? tahapan.replace("JILID_", "") : "");

  const jilidNum =
    !isNaN(Number(rawJilidVal)) && rawJilidVal !== ""
      ? Number(rawJilidVal)
      : tahapan?.includes("JILID")
        ? Number(tahapan.replace("JILID_", ""))
        : 0;

  const displayJilidText = isGharibOrTajwid
    ? formatEnum(tahapan)
    : jilidNum > 0
      ? `Jilid ${jilidNum}`
      : typeof rawJilidVal === "string" &&
          rawJilidVal.toLowerCase().includes("jilid")
        ? rawJilidVal
        : rawJilidVal || formatEnum(tahapan) || "";

  // Cari setoran paling baru yang memiliki entri Buku (halaman)
  const lastBukuSetoran = editData
    ? editData
    : riwayatList.find((r) => r.laporan_bacaan?.bab != null && Number(r.laporan_bacaan.bab) > 0) || lastRiwayat;

  // Cari setoran paling baru yang memiliki entri Al-Quran (surah/no_surah)
  const lastQuranSetoran = editData
    ? editData
    : riwayatList.find(
        (r) =>
          (r.laporan_bacaan?.surah != null && r.laporan_bacaan.surah !== "") ||
          r.laporan_bacaan?.no_surah != null,
      ) || lastRiwayat;

  // Cek apakah setoran PADA PERTEMUAN TERAKHIR (riwayatList[0]) mengandung Buku dan/atau Al-Quran
  const hasBukuInMostRecent = editData
    ? Boolean(editData.laporan_bacaan?.bab)
    : Boolean(lastRiwayat?.laporan_bacaan?.bab != null && Number(lastRiwayat.laporan_bacaan.bab) > 0);

  const hasQuranInMostRecent = editData
    ? Boolean(editData.laporan_bacaan?.surah || editData.laporan_bacaan?.no_surah)
    : Boolean(lastRiwayat?.laporan_bacaan?.surah || lastRiwayat?.laporan_bacaan?.no_surah);

  const isLastMengulang = !editData && lastRiwayat?.status_kelanjutan === "MENGULANG";

  // Halaman buku: ambil dari setoran sebelumnya +1, ATAU tetap jika MENGULANG. Jika belum ada setoran harian, ambil dari pretestData!
  const lastBukuHalaman = Number(lastBukuSetoran?.laporan_bacaan?.bab) || 0;
  
  const isValidPretest = pretestData?.tahapan === tahapan;
  const pretestHalaman = isValidPretest ? (Number(pretestData?.halaman) || 0) : 0;

  let nextBukuHalaman = "";
  if (editData) {
    nextBukuHalaman = lastBukuHalaman || "";
  } else if (lastRiwayat) {
    const isBukuLastMengulang = !editData && lastBukuSetoran?.status_kelanjutan === "MENGULANG";
    if (!isGharibOrTajwid || true) { // Always use last known for Ganda
      nextBukuHalaman = isBukuLastMengulang && lastBukuHalaman > 0
        ? lastBukuHalaman
        : lastBukuHalaman > 0
          ? Math.min(lastBukuHalaman + 1, maxHalamanBuku) // jangan sarankan melewati target buku
          : 1;
    }
  } else {
    // Belum ada setoran harian: ambil hasil placement Halaman dari pretest!
    nextBukuHalaman = pretestHalaman > 0 ? pretestHalaman : 1;
  }

  // ===========================================================================
  // DEFAULT VALUE - LAPORAN BACAAN: Al-QURAN (surah + ayat)
  // Logika +1 untuk ayat awal, ATAU tetap dari ayat_awal sebelumnya jika MENGULANG
  // ===========================================================================
  const pretestNoSurah = isValidPretest && pretestData?.no_surah ? String(pretestData.no_surah) : undefined;
  const pretestAyat = isValidPretest ? (Number(pretestData?.ayat_akhir || pretestData?.ayat_awal) || 0) : 0;

  // Prioritas: no_surah langsung (paling reliable) → lookup by nama (fallback) → pretest → undefined
  const defaultQuranSurah = editData?.laporan_bacaan?.surah
    ? allSurah
        .find((s) => s.nama_surah === editData.laporan_bacaan.surah)
        ?.no_surah.toString() ||
      editData.laporan_bacaan?.no_surah?.toString()
    : !editData &&
        (lastQuranSetoran?.laporan_bacaan?.no_surah ||
          lastQuranSetoran?.laporan_bacaan?.surah) &&
        (kategori === "QURAN" || isGharibOrTajwid)
      ? // Gunakan no_surah langsung jika ada, fallback ke lookup by nama
        lastQuranSetoran?.laporan_bacaan?.no_surah?.toString() ||
        allSurah
          .find((s) => s.nama_surah === lastQuranSetoran.laporan_bacaan.surah)
          ?.no_surah.toString()
      : undefined;

  const lastQuranAyatAkhir = Number(lastQuranSetoran?.laporan_bacaan?.ayat_akhir) || 0;

  // Batas ayat mengikuti jumlah ayat surah bacaan terakhir (auto-saran tidak melewati akhir surah)
  const noSurahBacaanTerakhir =
    lastQuranSetoran?.laporan_bacaan?.no_surah ||
    allSurah.find(
      (s) => s.nama_surah === lastQuranSetoran?.laporan_bacaan?.surah,
    )?.no_surah;
  const maxAyatBacaanTerakhir = getMaxAyat(
    allSurah.find((s) => String(s.no_surah) === String(noSurahBacaanTerakhir)),
  );

  let nextQuranAyatAwal = "";
  if (editData) {
    nextQuranAyatAwal = Number(editData.laporan_bacaan?.ayat_awal) || "";
  } else if (lastRiwayat) {
    const isQuranLastMengulang = !editData && lastQuranSetoran?.status_kelanjutan === "MENGULANG";
    if (kategori === "QURAN" || isGharibOrTajwid) {
      nextQuranAyatAwal = isQuranLastMengulang && lastQuranSetoran?.laporan_bacaan?.ayat_awal
        ? Number(lastQuranSetoran.laporan_bacaan.ayat_awal)
        : lastQuranAyatAkhir > 0
          ? Math.min(lastQuranAyatAkhir + 1, maxAyatBacaanTerakhir) // jangan sarankan melewati akhir surah
          : 1;
    }
  } else {
    nextQuranAyatAwal = pretestAyat > 0 ? pretestAyat : kategori === "QURAN" ? 1 : "";
  }

  const defaultQuranAyatAkhir = editData
    ? editData.laporan_bacaan?.ayat_akhir || ""
    : "";

  // ===========================================================================
  // DEFAULT VALUE - HAFALAN PENDEK (Surah Juz 30) - tetap dipertahankan
  // ===========================================================================
  const defaultHafalanSurah = editData?.hafalan_surah?.surah
    ? allSurah
        .find((s) => s.nama_surah === editData.hafalan_surah.surah)
        ?.no_surah.toString()
    : !editData && lastRiwayat?.hafalan_surah?.surah
      ? allSurah
          .find((s) => s.nama_surah === lastRiwayat.hafalan_surah.surah)
          ?.no_surah.toString()
      : undefined;

  const lastHafalanAyat = editData
    ? Number(editData.hafalan_surah?.ayat_akhir) || 0
    : Number(lastRiwayat?.hafalan_surah?.ayat_akhir) || 0;
  const nextHafalanAyatAwal = editData
    ? editData.hafalan_surah?.ayat_awal || ""
    : isLastMengulang && lastRiwayat?.hafalan_surah?.ayat_awal
      ? Number(lastRiwayat.hafalan_surah.ayat_awal)
      : lastHafalanAyat > 0
        ? lastHafalanAyat + 1
        : 1;
  const defaultHafalanAyatAkhir = editData
    ? editData.hafalan_surah?.ayat_akhir || ""
    : "";

  const kurangNilai = () => {
    if (nilaiIndex > 0) setNilaiIndex(nilaiIndex - 1);
  };
  const tambahNilai = () => {
    if (nilaiIndex < daftarNilai.length - 1) setNilaiIndex(nilaiIndex + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    if (isGharibOrTajwid) {
      const hasBuku = Boolean(formData.get("bab"));
      const hasAlquran = Boolean(formData.get("no_surah"));
      if (!hasBuku && !hasAlquran) {
        toast.error("Gagal! Minimal isi Halaman Buku ATAU Surah Al-Quran");
        return;
      }
    }

    // Validasi eksplisit batas halaman buku (Gharib 45, Jilid 1-6 & Tajwid 40)
    const babRaw = formData.get("bab");
    if (babRaw !== null && babRaw !== "") {
      const babVal = Number(babRaw);
      if (Number.isNaN(babVal) || babVal < 1 || babVal > maxHalamanBuku) {
        toast.error(
          `Halaman harus di antara 1–${maxHalamanBuku}` +
            (tahapan === "GHARIB" ? " (buku Gharib 45 halaman)" : "") +
            `. Jika santri sudah melewati halaman ${maxHalamanBuku}, ajukan Ujian Kenaikan.`,
        );
        return;
      }
    }

    // Validasi ayat Al-Quran & hafalan terhadap jumlah ayat surah terpilih.
    // Jika hanya salah satu yang diisi, divalidasi sebagai nilai tunggal.
    const cekAyatInput = (noSurah, awalRaw, akhirRaw, label) => {
      if (!noSurah) return null;
      const awal = Number(awalRaw) || 0;
      const akhir = Number(akhirRaw) || 0;
      if (awal <= 0 && akhir <= 0) return null; // kosong: tidak divalidasi
      const surahObj = allSurah.find((s) => String(s.no_surah) === String(noSurah));
      const a = awal > 0 ? awal : akhir;
      const k = akhir > 0 ? akhir : awal;
      const cek = validasiAyatSurah(surahObj, a, k);
      return cek.valid ? null : `${label}: ${cek.pesan}`;
    };

    const errBacaan = cekAyatInput(
      formData.get("no_surah"),
      formData.get("ayat_awal"),
      formData.get("ayat_akhir"),
      "Bacaan Al-Quran",
    );
    const errHafalan = cekAyatInput(
      formData.get("hafalan_surah"),
      formData.get("hafalan_ayat_awal"),
      formData.get("hafalan_ayat_akhir"),
      "Hafalan surah",
    );
    if (errBacaan || errHafalan) {
      toast.error(errBacaan || errHafalan);
      return;
    }

    const payload = {
      halaqohId,
      tahapan: tahapan,
      no_surah: Number(formData.get("no_surah")) || null,
      hafalan_surah: Number(formData.get("hafalan_surah")) || null,
      hafalan_ayat_awal: Number(formData.get("hafalan_ayat_awal")) || null,
      hafalan_ayat_akhir: Number(formData.get("hafalan_ayat_akhir")) || null,
      jilid: Number(formData.get("jilid")) || 0,
      bab: Number(formData.get("bab")) || null,
      ayat_awal: Number(formData.get("ayat_awal")) || 0,
      ayat_akhir: Number(formData.get("ayat_akhir")) || 0,
      nilai: formData.get("nilai") || daftarNilai[nilaiIndex],
      keterangan: formData.get("keterangan") || "-",
      status_kelanjutan: nilaiIndex >= 5 ? "LANJUT" : "MENGULANG",
    };

    try {
      if (editData) {
        await editTahsin({ id: editData.id, ...payload }).unwrap();
        toast.success("Penilaian berhasil diperbarui!");
      } else {
        await addTahsin({ nis, ...payload }).unwrap();
        toast.success("Penilaian tahsin berhasil disimpan!");
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.data?.message || "Gagal menyimpan penilaian");
      console.error("Error submit :", error);
    }
  };

  if (!isReady) {
    return (
      <div className="flex flex-col gap-5 py-6 w-full animate-pulse">
        <div className="h-10 bg-muted rounded-md w-full" />
        <div className="h-10 bg-muted rounded-md w-full" />
        <div className="h-24 bg-muted rounded-md w-full mt-4" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col h-full overflow-hidden text-left">
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 pb-4">
        {/* HAFALAN PENDEK - Surah Juz 30 (opsional) */}
        <Field>
          <FieldLabel>Hafalan Surah Pendek</FieldLabel>
          <Select name="hafalan_surah" defaultValue={defaultHafalanSurah}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Pilih Surah" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {surahJuz30.map((surah) => (
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
            <Input
              name="hafalan_ayat_awal"
              type="number"
              min={1}
              max={286}
              placeholder="Ayat Awal"
              defaultValue={nextHafalanAyatAwal}
            />
            <Input
              name="hafalan_ayat_akhir"
              type="number"
              min={1}
              max={286}
              placeholder="Ayat Akhir"
              defaultValue={defaultHafalanAyatAkhir}
            />
          </div>
        </Field>

        {/* LAPORAN BACAAN - dinamis sesuai kategori tahapan */}
        <Field>
          <FieldLabel>Laporan Bacaan</FieldLabel>
          {isGharibOrTajwid ? (
            /* ============ GHARIB / TAJWID ============ */
            /* Bisa berisi BUKU (Gharib/Tajwid) DAN/ATAU Al-Quran */
            <div className="flex flex-col gap-4 border p-4 rounded-lg bg-neutral-50/50">
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold">
                  Buku {formatEnum(tahapan)}
                </span>
                <div className="flex gap-5">
                  <input type="hidden" name="jilid" value={jilidNum} />
                  <Input
                    placeholder="Jilid"
                    type="text"
                    readOnly
                    value={displayJilidText}
                    className="bg-neutral-100 font-medium"
                  />
                  <Input
                    name="bab"
                    type="number"
                    min={1}
                    max={maxHalamanBuku}
                    placeholder={`Halaman (1-${maxHalamanBuku})`}
                    defaultValue={nextBukuHalaman}
                  />
                </div>
              </div>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-neutral-300" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-neutral-50/50 px-2 text-neutral-500 font-semibold">
                    DAN / ATAU
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-sm font-semibold">Al-Quran</span>
                <Select name="no_surah" defaultValue={defaultQuranSurah}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Surah" />
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
                  <Input
                    name="ayat_awal"
                    type="number"
                    min={1}
                    max={286}
                    placeholder="Ayat Awal"
                    defaultValue={nextQuranAyatAwal}
                  />
                  <Input
                    name="ayat_akhir"
                    type="number"
                    min={1}
                    max={286}
                    placeholder="Ayat Akhir"
                    defaultValue={defaultQuranAyatAkhir}
                  />
                </div>
              </div>
            </div>
          ) : !isAlQuran ? (
            /* ============ BUKU UMMI (Jilid 1-6) ============ */
            <div className="flex gap-5">
              <input type="hidden" name="jilid" value={jilidNum} />
              <Input
                placeholder="Jilid"
                type="text"
                readOnly
                value={displayJilidText}
                className="bg-neutral-100 font-medium"
              />
              <Input
                name="bab"
                type="number"
                min={1}
                max={maxHalamanBuku}
                placeholder={`Halaman (1-${maxHalamanBuku})`}
                defaultValue={nextBukuHalaman}
              />
            </div>
          ) : (
            /* ============ AL-QURAN / TILAWAH / MUNAQOSYAH ============ */
            <div className="flex flex-col gap-3">
              <Select name="no_surah" defaultValue={defaultQuranSurah}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Pilih Surah" />
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
                <Input
                  name="ayat_awal"
                  type="number"
                  min={1}
                  max={286}
                  placeholder="Ayat Awal"
                  defaultValue={nextQuranAyatAwal}
                />
                <Input
                  name="ayat_akhir"
                  type="number"
                  min={1}
                  max={286}
                  placeholder="Ayat Akhir"
                  defaultValue={defaultQuranAyatAkhir}
                />
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
              <span className="font-bold text-xl w-8 text-center">
                {daftarNilai[nilaiIndex]}
              </span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={tambahNilai}
              >
                <FaPlus />
              </Button>
            </div>
            <input
              type="hidden"
              name="nilai"
              value={daftarNilai[nilaiIndex]}
            />
          </div>
        </Field>

        <Field>
          <FieldLabel>Keterangan</FieldLabel>
          <Textarea
            name="keterangan"
            className="min-h-25 break-all w-full"
            defaultValue={
              editData?.keterangan !== "-" ? editData?.keterangan : ""
            }
          />
        </Field>
      </div>

      <div className="shrink-0 pt-3 pb-2 bg-white dark:bg-neutral-900 border-t border-border mt-2 w-full">
        <Button type="submit" disabled={isAdding || isEditing} className="w-full shadow-xs">
          {isAdding || isEditing ? "Menyimpan..." : editData ? "Update Penilaian" : "Simpan Penilaian"}
        </Button>
      </div>
    </form>
  );
}

export default TahsinAssessmentForm;
