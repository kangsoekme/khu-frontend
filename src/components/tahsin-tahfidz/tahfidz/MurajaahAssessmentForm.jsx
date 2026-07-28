import { Input } from "@/components/ui/input";
import { useState } from "react";
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
  useGetRiwayatMurajaahQuery,
  useGetRiwayatHafalanQuery,
  useAddMurajaahMutation,
} from "../../../store/api/tahfidzApi";
import { FaMinus, FaPlus } from "react-icons/fa";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

function MurajaahAssessmentForm({ nis, halaqohId, onSuccess }) {
  const { data: murajaahRes } = useGetRiwayatMurajaahQuery(nis);

  const { data: hafalanRes } = useGetRiwayatHafalanQuery(nis);
  const lastRef =
    murajaahRes?.data?.history?.murajaah_baru?.[0] ||
    hafalanRes?.data?.history?.hafalan_baru?.[0];

  const allSurah = surahRes?.data || [];

  const [jumlahSalah, setJumlahSalah] = useState(0);
  const [nilaiBacaan, setNilaiBacaan] = useState(80);

  const nilaiHafalan = Math.max(60, 95 - jumlahSalah * 10);
  const [addMurajaah] = useAddMurajaahMutation();

  const kurangSalah = () => setJumlahSalah((p) => Math.max(0, p - 1));
  const tambahSalah = () => setJumlahSalah((p) => Math.min(20, p + 1));

  const kurangBacaan = () => setNilaiBacaan((p) => Math.max(0, p - 1));
  const tambahBacaan = () => setNilaiBacaan((p) => Math.min(100, p + 1));

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);

    const payload = {
      nis: nis,
      nis_siswa: nis,
      halaqohId: halaqohId,
      no_surah: Number(formData.get("hafalan_surah")),
      ayat_awal: Number(formData.get("hafalan_ayat_awal")),
      ayat_akhir: Number(formData.get("hafalan_ayat_akhir")),
      jumlah_salah: Number(formData.get("jumlah_salah")),
      nilai_bacaan: Number(formData.get("nilai_bacaan")),
    };

    try {
      await addMurajaah(payload).unwrap();
      if (onSuccess) onSuccess();
      toast.success("Setoran murajaah berhasil disimpan");
    } catch (error) {
      toast.error("Setoran gagal disimpan");
      console.error("Gagal menyimpan setoran : ", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
      <div className="flex flex-col gap-5">
        <ScrollArea className="h-100">
          <div className="flex flex-col gap-5">
            <Field>
              <Select
                name="hafalan_surah"
                defaultValue={
                  lastRef?.no_surah?.toString() ||
                  lastRef?.surah?.no_surah?.toString()
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
                <Input
                  name="hafalan_ayat_awal"
                  placeholder="Ayat Awal"
                  defaultValue={
                    lastRef?.ayat_akhir ? Number(lastRef.ayat_akhir) + 1 : 1
                  }
                />
                <Input name="hafalan_ayat_akhir" placeholder="Ayat Akhir" />
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
              {/* Walaupun auto, Backend kitalah yang menghitung aslinya. Jadi tidak perlu hidden input di sini. */}
            </Field>
          </div>
        </ScrollArea>
        <Button>Tambah Setoran Murajaah</Button>
      </div>
    </form>
  );
}

export default MurajaahAssessmentForm;
