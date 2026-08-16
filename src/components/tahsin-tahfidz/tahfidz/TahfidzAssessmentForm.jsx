import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";

import { Field, FieldLabel } from "@/components/ui/field";
import { useGetAllSurahQuery } from "../../../store/api/surahApi";
import {
  useAddHafalanMutation,
  useGetRiwayatHafalanQuery,
} from "../../../store/api/tahfidzApi";

import { FaMinus, FaPlus } from "react-icons/fa";

import { Switch } from "@/components/ui/switch";

import { ScrollArea } from "@/components/ui/scroll-area";

import { toast } from "sonner";
import { validasiAyatSurah } from "../../../utils/validasiAyat";

function TahfidzAssessmentForm({ nis, halaqohId, onSuccess }) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const { data: surahRes } = useGetAllSurahQuery();
  const allSurah = surahRes?.data || [];

  const [pengulangan, setPengulangan] = useState(18);
  const [jumlahSalah, setJumlahSalah] = useState(0);
  const [nilaiBacaan, setNilaiBacaan] = useState(80);
  const [isTarjamah, setIsTarjamah] = useState(false);

  const [selectedSurah, setSelectedSurah] = useState("");
  const [ayatAwal, setAyatAwal] = useState("");
  const [ayatAkhir, setAyatAkhir] = useState("");

  const nilaiHafalan = Math.max(60, 95 - jumlahSalah * 10);

  const [addHafalan, { isLoading: isAdding }] = useAddHafalanMutation();


  const kurangPengulangan = () => setPengulangan((p) => Math.max(0, p - 1));
  const tambahPengulangan = () => setPengulangan((p) => Math.min(100, p + 1));

  const kurangSalah = () => setJumlahSalah((p) => Math.max(0, p - 1));
  const tambahSalah = () => setJumlahSalah((p) => p + 1);

  const kurangBacaan = () => setNilaiBacaan((p) => Math.max(0, p - 1));
  const tambahBacaan = () => setNilaiBacaan((p) => Math.min(100, p + 1));

  const { data: riwayatRes } = useGetRiwayatHafalanQuery(nis);
  const lastHafalan = riwayatRes?.data?.history?.hafalan_baru?.[0];

  useEffect(() => {
    if (!selectedSurah && allSurah.length > 0) {
      const initSurahNo =
        lastHafalan?.no_surah?.toString() ||
        lastHafalan?.surah?.no_surah?.toString() ||
        allSurah[0]?.no_surah?.toString() ||
        "1";
      setSelectedSurah(initSurahNo);

      const surahObj =
        allSurah.find((s) => s.no_surah.toString() === initSurahNo) ||
        allSurah[0];
      const maxAyat = surahObj?.jumlah_ayat || 286;

      if (lastHafalan?.ayat_akhir) {
        const nextAwal = Number(lastHafalan.ayat_akhir) + 1;
        if (nextAwal <= maxAyat) {
          setAyatAwal(nextAwal.toString());
          setAyatAkhir(Math.min(maxAyat, nextAwal + 4).toString());
        } else {
          setAyatAwal("1");
          setAyatAkhir(Math.min(maxAyat, 5).toString());
        }
      } else {
        setAyatAwal("1");
        setAyatAkhir(Math.min(maxAyat, 5).toString());
      }
    }
  }, [allSurah, lastHafalan, selectedSurah]);

  const handleSurahChange = (val) => {
    setSelectedSurah(val);
    const surahObj = allSurah.find((s) => s.no_surah.toString() === val);
    const maxAyat = surahObj?.jumlah_ayat || 286;

    const lastSurahNo =
      lastHafalan?.no_surah?.toString() ||
      lastHafalan?.surah?.no_surah?.toString();
    if (val === lastSurahNo && lastHafalan?.ayat_akhir) {
      const nextAwal = Number(lastHafalan.ayat_akhir) + 1;
      if (nextAwal <= maxAyat) {
        setAyatAwal(nextAwal.toString());
        setAyatAkhir(Math.min(maxAyat, nextAwal + 4).toString());
        return;
      }
    }
    setAyatAwal("1");
    setAyatAkhir(Math.min(maxAyat, 5).toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const surahObj = allSurah.find(
      (s) => s.no_surah.toString() === selectedSurah,
    );
    const awal = Number(ayatAwal);
    const akhir = Number(ayatAkhir);

    // Validasi terpusat: sesuai jumlah ayat surah terpilih (utils/validasiAyat)
    const cekAyat = validasiAyatSurah(surahObj, awal, akhir);
    if (!cekAyat.valid) {
      toast.error(cekAyat.pesan);
      return;
    }

    const formData = new FormData(e.target);

    const payload = {
      nis: nis,
      nis_siswa: nis,
      halaqohId: halaqohId,
      no_surah: Number(selectedSurah),
      ayat_awal: awal,
      ayat_akhir: akhir,
      toggle_tarjamah: formData.get("toggle_tarjamah") === "true",
      jumlah_pengulangan: Number(formData.get("jumlah_pengulangan")),
      jumlah_salah: Number(formData.get("jumlah_salah")),
      nilai_bacaan: Number(formData.get("nilai_bacaan")),
    };

    try {
      await addHafalan(payload).unwrap();

      if (onSuccess) onSuccess();

      console.log("Sukses menyimpan data");
      toast.success("Setoran berhasil disimpan");
    } catch (error) {
      toast.error("Setoran gagal disimpan");
      console.error("Gagal menyimpan setoran : ", error);
    }
  };

  if (!isReady) {
    return (
      <div className="flex flex-col gap-5 py-6 w-full animate-pulse">
        <div className="h-10 bg-muted rounded-md w-full" />
        <div className="h-10 bg-muted rounded-md w-full" />
        <div className="h-10 bg-muted rounded-md w-full" />
        <div className="h-24 bg-muted rounded-md w-full mt-4" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden text-left">
      <div className="flex-1 overflow-y-auto space-y-5 pr-1 pb-4">
        <Field>
          <Select
            name="hafalan_surah"
            value={selectedSurah}
            onValueChange={handleSurahChange}
          >
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
                    {surah.no_surah}. {surah.nama_surah} (
                    {surah.jumlah_ayat} ayat)
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <div className="flex gap-5">
            <Input
              name="hafalan_ayat_awal"
              type="number"
              placeholder="Ayat Awal"
              value={ayatAwal}
              onChange={(e) => setAyatAwal(e.target.value)}
            />
            <Input
              name="hafalan_ayat_akhir"
              type="number"
              placeholder="Ayat Akhir"
              value={ayatAkhir}
              onChange={(e) => setAyatAkhir(e.target.value)}
            />
          </div>
        </Field>

        <Field>
          <div className="flex justify-between items-center">
            <FieldLabel>Membaca Terjemah</FieldLabel>
            <Switch checked={isTarjamah} onCheckedChange={setIsTarjamah} />
            <input
              type="hidden"
              name="toggle_tarjamah"
              value={isTarjamah}
            />
          </div>
        </Field>

        <Field>
          <FieldLabel>Jumlah Pengulangan</FieldLabel>
          <div className="flex flex-col gap-5 items-center py-5 ">
            <div className="flex items-center gap-5 w-full justify-between px-20">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={kurangPengulangan}
                className="size-12"
              >
                <FaMinus className="size-7" />
              </Button>

              <span className="text-4xl font-bold">{pengulangan}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={tambahPengulangan}
                className="size-12"
              >
                <FaPlus className="size-7" />
              </Button>
            </div>
            <input
              type="hidden"
              name="jumlah_pengulangan"
              value={pengulangan}
            />
          </div>
        </Field>

        <Field>
          <FieldLabel>Jumlah Salah</FieldLabel>
          <div className="flex flex-col gap-5 items-center py-5">
            <div className="flex items-center gap-5 w-full justify-between px-20">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={kurangSalah}
                className="size-12"
              >
                <FaMinus className="size-7" />
              </Button>

              <span className="text-4xl font-bold">{jumlahSalah}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={tambahSalah}
                className="size-12"
              >
                <FaPlus className="size-7" />
              </Button>
            </div>
            <input type="hidden" name="jumlah_salah" value={jumlahSalah} />
          </div>
        </Field>

        <Field>
          <FieldLabel>Nilai Bacaan (BB)</FieldLabel>
          <div className="flex flex-col gap-5 items-center py-5">
            <div className="flex items-center gap-5 w-full justify-between px-20">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={kurangBacaan}
                className="size-12"
              >
                <FaMinus className="size-7" />
              </Button>

              <span className="text-4xl font-bold">{nilaiBacaan}</span>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={tambahBacaan}
                className="size-12"
              >
                <FaPlus className="size-7" />
              </Button>
            </div>
            <input type="hidden" name="nilai_bacaan" value={nilaiBacaan} />
          </div>
        </Field>

        <Field>
          <FieldLabel>Nilai Hafalan (HB)</FieldLabel>
          <div className="p-4 bg-gray-100 rounded-lg flex flex-col items-center justify-center">
            <span
              className={`text-5xl font-bold ${jumlahSalah > 3 ? "text-red-500" : "text-green-600"}`}
            >
              {nilaiHafalan}
            </span>
            <p className="text-xs text-gray-500 mt-2">
              Dihitung otomatis berdasarkan jumlah salah
            </p>
          </div>
        </Field>
      </div>

      <div className="shrink-0 pt-3 pb-2 bg-white dark:bg-neutral-900 border-t border-border mt-2 w-full">
        <Button type="submit" disabled={isAdding} className="w-full shadow-xs">
          {isAdding ? "Menyimpan..." : "Tambah Setoran Hafalan"}
        </Button>
      </div>
    </form>
  );
}

export default TahfidzAssessmentForm;
