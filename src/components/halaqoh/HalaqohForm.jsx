import { useState, useEffect } from "react";

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

import { useGetStudentsQuery } from "../../store/api/studentsApi";

import { Marker, MarkerContent } from "@/components/ui/marker";

import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatEnum } from "../../utils/formatEnum";

function HalaqohForm({
  initialData,
  studentsList,
  onSuccess,
  defaultKategori,
}) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    // Delay rendering heavy list until modal animation completes
    const timer = setTimeout(() => setIsReady(true), 150);
    return () => clearTimeout(timer);
  }, []);

  const { data: usersData, isLoading: isLoadingUsers } = useGetUsersQuery();
  const daftarGuru =
    usersData?.data?.filter((user) => user.role === "GURU") || [];

  const { data: studentsData } = useGetStudentsQuery();
  const allStudents = studentsData?.data || [];

  const [kategori, setKategori] = useState(
    initialData?.kategori || defaultKategori || "TAHSIN",
  );
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
      toast.error("Pilih kategori dan guru terlebih dahulu");
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
      toast.error(error.data?.message || "Gagal membuat halaqoh");
    }
  };
  const waitingStudents = allStudents.filter((student) => {
    if (kategori === "TAHFIDZ") {
      return (
        student.halaqoh_tahfidz_id === null ||
        student.halaqoh_tahfidz_id === initialData?.id
      );
    }
    if (kategori === "TAHSIN") {
      const hasTahsinProgressOrPretest =
        (student.ujianPretest && student.ujianPretest.length > 0) ||
        (student.setoranTahsin && student.setoranTahsin.length > 0) ||
        student.tahapan_tahsin !== null;

      return (
        (student.halaqoh_tahsin_id === null && hasTahsinProgressOrPretest) ||
        student.halaqoh_tahsin_id === initialData?.id
      );
    }
    return false;
  });
  const sortedStudents = [...waitingStudents].sort((a, b) => {
    if (kategori === "TAHSIN") {
      const hasSetoranA = a.setoranTahsin && a.setoranTahsin.length > 0;
      const hasSetoranB = b.setoranTahsin && b.setoranTahsin.length > 0;
      if (hasSetoranA && !hasSetoranB) return -1;
      if (!hasSetoranA && hasSetoranB) return 1;
      if (hasSetoranA && hasSetoranB) {
        const halA = Number(
          a.setoranTahsin[0]?.bab || a.setoranTahsin[0]?.halaman || 0,
        );
        const halB = Number(
          b.setoranTahsin[0]?.bab || b.setoranTahsin[0]?.halaman || 0,
        );
        return halA - halB;
      }
      return 0;
    } else {
      const surahA = Number(a.setoranHafalan?.[0]?.no_surah || 0);
      const surahB = Number(b.setoranHafalan?.[0]?.no_surah || 0);
      if (surahA !== surahB) return surahB - surahA; // Juz 30 dari An-Naba (78) ke An-Nas (114)
      return (
        Number(a.setoranHafalan?.[0]?.ayat_akhir || 0) -
        Number(b.setoranHafalan?.[0]?.ayat_akhir || 0)
      );
    }
  });

  const allGrouped = sortedStudents.reduce((acc, student) => {
    let rawKey = "BELUM MULAI";
    if (kategori === "TAHSIN") {
      rawKey =
        student.tahapan_tahsin ||
        student.setoranTahsin?.[0]?.tahapan ||
        student.ujianPretest?.[0]?.tahapan ||
        "🌟 BELUM MULAI / BELUM ADA TAHAPAN";
    } else {
      rawKey = student.setoranHafalan?.[0]?.surah?.nama_surah
        ? `Juz 30 (Qs. ${student.setoranHafalan[0].surah.nama_surah})`
        : student.setoranHafalan?.[0]?.no_surah
        ? `Juz 30 (Surah ke-${student.setoranHafalan[0].no_surah})`
        : "🌟 SISWA BARU (BELUM ADA SETORAN)";
    }
    const key =
      kategori === "TAHSIN" && !rawKey.includes("🌟")
        ? formatEnum(rawKey)
        : rawKey;

    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {});

  const sortedGroupEntries = Object.entries(allGrouped);

  const getInfoPencapaian = (student) => {
    if (kategori === "TAHSIN") {
      const setoran = student.setoranTahsin?.[0];
      const latestTahapan =
        setoran?.tahapan ||
        student.tahapan_tahsin ||
        student.ujianPretest?.[0]?.tahapan ||
        "Tahsin";
      const jilidText = formatEnum(latestTahapan);

      let halText = "Belum ada setoran";
      if (setoran?.bab || setoran?.halaman) {
        halText = `Halaman ${setoran.bab || setoran.halaman}`;
      } else if (setoran?.materi) {
        halText = setoran.materi;
      } else if (student.ujianPretest?.[0]?.tahapan || student.tahapan_tahsin) {
        halText = `Pretest: ${formatEnum(student.ujianPretest?.[0]?.tahapan || student.tahapan_tahsin)}`;
      }
      return { baris1: jilidText, baris2: halText };
    } else {
      const hafalan = student.setoranHafalan?.[0];
      let surahText = "Tahfidz";
      if (hafalan?.surah?.nama_surah)
        surahText = `Qs. ${hafalan.surah.nama_surah}`;
      else if (hafalan?.no_surah) surahText = `Qs. ke-${hafalan.no_surah}`;
      const ayatText = hafalan?.ayat_akhir
        ? `Ayat ${hafalan.ayat_akhir}`
        : "Belum Ada Setoran";
      return { baris1: surahText, baris2: ayatText };
    }
  };

  const handleDelete = async () => {
    try {
      await deleteHalaqoh(initialData.id).unwrap();
      toast.success("Halaqoh berhasil dihapus");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.log("Error hapus Halaqoh : ", error);
      toast.error(error.data?.message || "Gagal menghapus Halaqoh");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full overflow-hidden text-left">
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pb-4">
        <div className="flex flex-col gap-2">
          <Label className="text-sm font-semibold">Nama Halaqoh</Label>
          <Input
            type="text"
            name="nama"
            placeholder="Misal: Abu Bakar Ash Shiddiq"
            defaultValue={initialData?.nama_halaqoh || initialData?.nama}
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Kategori Program</Label>
            <Select
              onValueChange={setKategori}
              defaultValue={initialData?.kategori}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    value="TAHSIN"
                    className="font-medium text-blue-700"
                  >
                    Tahsin Qiraah
                  </SelectItem>
                  <SelectItem
                    value="TAHFIDZ"
                    className="font-medium text-emerald-700"
                  >
                    Tahfidz Quran
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label className="text-sm font-semibold">Guru Pengampu</Label>
            <Select
              onValueChange={setGuruId}
              defaultValue={initialData?.guru?.id || initialData?.guruId}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Pilih Guru..." />
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
        </div>
        {/* Bagian Accordion Pemilihan Siswa */}
        <div className="flex flex-col gap-3 border border-border p-4 rounded-lg bg-neutral-surface/20">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-bold text-neutral-800">
              {kategori === "TAHSIN"
                ? "Kelompokkan Siswa per Jilid / Tahapan"
                : "Kelompokkan Siswa per Kelas"}
            </Label>
            <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary font-bold rounded-full">
              {selectedNis.length} Siswa Terpilih
            </span>
          </div>
          {!kategori ? (
            <div className="text-center py-8 bg-neutral-50 rounded-md border border-dashed text-neutral-500">
              <p className="text-sm font-semibold text-neutral-700">
                Pilih Kategori Program Terlebih Dahulu
              </p>
              <p className="text-xs text-neutral-400 mt-1">
                Daftar siswa akan otomatis dikelompokkan sesuai metode program
              </p>
            </div>
          ) : !isReady ? (
            <div className="flex flex-col gap-3 py-6 w-full animate-pulse">
              <div className="h-10 bg-muted rounded-md w-full" />
              <div className="h-10 bg-muted rounded-md w-full" />
              <div className="h-32 bg-muted rounded-md w-full mt-4" />
            </div>
          ) : sortedGroupEntries.length === 0 ? (
            <p className="text-sm text-neutral-500 py-6 text-center">
              Tidak ada siswa yang menunggu kelompok untuk program{" "}
              {kategori === "TAHFIDZ" ? "Tahfidz" : "Tahsin"}
            </p>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-4 pr-1">
              {sortedGroupEntries.map(([groupName, students]) => (
                <div key={groupName} className="space-y-1.5">
                  {/* 1. SEPARATOR MARKER HEADER */}
                  <Marker variant="separator">
                    <MarkerContent className="font-bold text-xs titlecase text-neutral-700">
                      {groupName} ({students.length} Siswa)
                    </MarkerContent>
                  </Marker>

                  <div className="space-y-1 pl-1">
                    {students.map((student) => {
                      const info = getInfoPencapaian(student);
                      const isSelected = selectedNis.includes(student.nis);

                      return (
                        <label
                          key={student.nis}
                          htmlFor={`chk-${student.nis}`}
                          className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors border ${
                            isSelected
                              ? "bg-primary/5 border-primary/30"
                              : "bg-white hover:bg-neutral-50 border-transparent hover:border-border"
                          }`}
                        >
                          {/* Kiri: Checkbox & Nama Siswa */}
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              id={`chk-${student.nis}`}
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleCheckboxChange(student.nis, checked)
                              }
                            />
                            <div className="flex flex-col text-left">
                              <span className="text-sm font-semibold text-neutral-800">
                                {student.nama}
                              </span>
                              <span className="text-[11px] text-neutral-400 font-medium">
                                NIS: {student.nis} |{" "}
                                {student.riwayatKelas?.[0]?.nama_kelas || "-"}
                              </span>
                            </div>
                          </div>

                          {/* Kanan: Tulisan Pencapaian 2 Baris (Tanpa style badge) */}
                          <div className="flex flex-col text-right">
                            <span className="text-xs font-semibold text-neutral-800">
                              {info.baris1}
                            </span>
                            <span className="text-[11px] text-neutral-500 font-medium">
                              {info.baris2}
                            </span>
                          </div>
                        </label>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <div
        className={cn(
          "shrink-0 pt-3 pb-2 bg-white dark:bg-neutral-900 border-t border-border mt-2 grid gap-3 w-full",
          initialData ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        {/* Tombol Hapus & Alert Dialog (Hanya muncul jika initialData ada / mode Edit) */}
        {initialData && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button" // Wajib type="button" agar tidak memicu onSubmit form!
                variant="destructive"
                className="w-full font-semibold shadow-xs"
                disabled={isDeleting || isAdding || isEditing}
              >
                {isDeleting ? "Menghapus..." : "Hapus Halaqoh"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Apakah anda yakin?</AlertDialogTitle>
                <AlertDialogDescription>
                  Tindakan ini tidak bisa dikembalikan. Ini akan menghapus data
                  halaqoh ini secara permanen dan melepaskan semua siswa dari
                  kelompok halaqoh ini.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Hapus Permanen
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
        {/* Tombol Simpan (Selalu muncul, mengambil 1 kolom penuh jika tambah baru) */}
        <Button
          type="submit"
          className="w-full font-semibold shadow-xs"
          disabled={isAdding || isEditing || isDeleting}
        >
          {isAdding || isEditing ? "Menyimpan..." : "Simpan Halaqoh"}
        </Button>
      </div>
    </form>
  );
}

export default HalaqohForm;
