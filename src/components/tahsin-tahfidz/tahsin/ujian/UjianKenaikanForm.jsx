import React, { useState } from "react";
import { useAddUjianKenaikanMutation } from "../../../../store/api/ujianApi";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { FaMinus, FaPlus } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function UjianKenaikanForm({ initialData, onSuccess }) {
  const [addUjian, { isLoading }] = useAddUjianKenaikanMutation();

  const daftarNilai = ["D", "C-", "C", "C+", "B-", "B", "B+", "A", "A+"];
  const [nilaiIndex, setNilaiIndex] = useState(7); // Default A

  const kurangNilai = () => {
    if (nilaiIndex > 0) setNilaiIndex(nilaiIndex - 1);
  };
  const tambahNilai = () => {
    if (nilaiIndex < daftarNilai.length - 1) setNilaiIndex(nilaiIndex + 1);
  };

  const currentNilai = daftarNilai[nilaiIndex];
  const isLulus = ["A+", "A", "B+", "B"].includes(currentNilai);

  const targetJilid =
    initialData?.tahapan_tujuan || initialData?.tahapan_tahsin || "JILID_1";

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const payload = {
      id_kelompok: initialData?.halaqoh_tahsin_id,
      tahapan_baru: targetJilid,
      nilai: currentNilai,
      keterangan: formData.get("keterangan") || "-",
      status_kelulusan: isLulus ? "LULUS" : "TIDAK_LULUS",
    };

    if (!payload.tahapan_baru) {
      toast.error("Mohon pilih Jilid Tujuan terlebih dahulu");
      return;
    }

    try {
      await addUjian({ nis: initialData.nis, ...payload }).unwrap();
      toast.success("Hasil ujian kenaikan jilid berhasil disimpan!");
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(error?.data?.message || "Gagal menyimpan ujian");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-left">
      {/* Kartu Informasi Jilid Saat Ini */}
      <div className="p-4 rounded-lg bg-blue-50/70 border border-blue-200 flex justify-between items-center shadow-2xs">
        <div>
          <p className="text-[11px] text-blue-600 font-bold uppercase tracking-wider">
            Jilid Saat Ini
          </p>
          <p className="text-base font-black text-blue-950 mt-0.5">
            {initialData?.tahapan_tahsin
              ? initialData.tahapan_tahsin.replace(/_/g, " ")
              : "Belum Ada"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold text-neutral-800">
            {initialData?.nama}
          </p>
          <p className="text-xs text-neutral-500 font-medium">
            NIS: {initialData?.nis}
          </p>
        </div>
      </div>

      <div className="p-3 rounded-lg bg-emerald-50/80 border border-emerald-200">
        <p className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
          Target Jilid (Pengajuan)
        </p>
        <p className="text-sm font-black text-emerald-950 mt-0.5">
          {targetJilid.replace(/_/g, " ")}
        </p>
      </div>

      {/* Sistem Penilaian Tombol (- A+ +) */}
      <div className="flex flex-col gap-3 items-center p-5 border border-border rounded-lg bg-neutral-50/80 shadow-2xs">
        <Label className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">
          Penilaian Ujian
        </Label>
        <div className="flex items-center gap-6 my-1">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-white shadow-2xs hover:bg-neutral-100"
            onClick={kurangNilai}
          >
            <FaMinus className="text-neutral-700" />
          </Button>
          <span className="text-3xl font-black text-primary min-w-[60px] text-center">
            {currentNilai}
          </span>
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-10 w-10 bg-white shadow-2xs hover:bg-neutral-100"
            onClick={tambahNilai}
          >
            <FaPlus className="text-neutral-700" />
          </Button>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-xs text-neutral-500 font-medium">
            Rekomendasi Sistem:
          </span>
          <span
            className={`px-2 py-0.5 text-xs font-bold rounded shadow-3xs ${isLulus ? "bg-green-100 text-green-700 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}
          >
            {isLulus ? "LULUS" : "TIDAK LULUS (MENGULANG)"}
          </span>
        </div>
      </div>

      {/* Catatan / Evaluasi */}
      <div className="flex flex-col gap-2">
        <Label className="font-semibold text-neutral-800 text-sm">
          Catatan / Evaluasi
        </Label>
        <Textarea
          name="keterangan"
          placeholder="Tambahkan catatan untuk siswa..."
          className="min-h-20 bg-white"
        />
      </div>

      <Button
        type="submit"
        className="w-full font-semibold text-sm shadow-xs"
        disabled={isLoading}
      >
        {isLoading ? "Menyimpan Hasil..." : "Simpan Hasil Ujian"}
      </Button>
    </form>
  );
}

export default UjianKenaikanForm;
