"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  useGetAllTahunAkademikQuery,
  useCreateTahunAkademikMutation,
  useActivateTahunAkademikMutation,
  useTriggerTransisiSemesterMutation,
} from "../../store/api/tahunAkademikApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FaExclamationTriangle } from "react-icons/fa";
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

export default function TahunAjaranManagement() {
  const { data: listRes, isLoading } = useGetAllTahunAkademikQuery();
  const [createTahun, { isLoading: isCreating }] =
    useCreateTahunAkademikMutation();
  const [activateTahun] = useActivateTahunAkademikMutation();
  const [triggerTransisi, { isLoading: isTransisi }] =
    useTriggerTransisiSemesterMutation();

  const [tahun, setTahun] = useState("");
  const [semester, setSemester] = useState("GANJIL");
  const [selectedTahunId, setSelectedTahunId] = useState("");

  const tahunList = listRes?.data || [];

  // Helper untuk memisahkan tahun (mis: 2026/2027) & semester (mis: GANJIL) dari nama_tahun jika field terpisah belum ada
  const parseTahunAkademik = (item) => {
    let tahun = item.tahun || "";
    let semester = item.semester || "";

    if (!tahun && item.nama_tahun) {
      const parts = item.nama_tahun.trim().split(/\s+/);
      tahun = parts[0] || item.nama_tahun;
      if (!semester && parts.length > 1) {
        semester = parts.slice(1).join(" ");
      }
    }

    return {
      tahun: tahun || item.nama_tahun || "-",
      semester: semester || "-",
      namaLengkap: item.nama_tahun || `${tahun} ${semester}`.trim(),
    };
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        nama_tahun: `${tahun} ${semester}`,
        is_active: false,
      };

      await createTahun(payload).unwrap();
      toast.success("Tahun Akademik berhasil ditambahkan");
      setTahun("");
    } catch (err) {
      toast.error(err?.data?.message || "Gagal menambahkan tahun akademik");
    }
  };

  const handleActivate = async (id) => {
    try {
      await activateTahun(id).unwrap();
      toast.success("Tahun Akademik diaktifkan!");
    } catch (error) {
      toast.error("Gagal mengaktifkan tahun akademik");
    }
  };

  const handleTransisi = async () => {
    if (!selectedTahunId) {
      toast.error("Pilih tahun akademik tujuan terlebih dahulu!");
      return;
    }
    try {
      // 💡 PERBAIKAN: Gunakan key "tahun_tujuan_id" sesuai permintaan Joi backend
      await triggerTransisi({ tahun_tujuan_id: selectedTahunId }).unwrap();

      toast.success(
        "🎉 Transisi Semester berhasil! Seluruh siswa siap untuk pembagian kelompok baru.",
      );
    } catch (err) {
      toast.error(err?.data?.message || "Gagal melakukan transisi semester");
    }
  };

  return (
    <div className="flex flex-col gap-6 ">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Form Tambah Tahun */}
        <Card className="md:col-span-1 border-blue-200 bg-blue-50/30">
          <CardHeader>
            <CardTitle className="text-lg text-blue-900">
              Tambah Tahun Ajaran
            </CardTitle>
            <CardDescription className="text-blue-700">
              Buat periode akademik baru sebelum melakukan transisi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-3">
                <Label>Tahun Ajaran (Contoh: 2026/2027)</Label>
                <Input
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  placeholder="2026/2027"
                  className="bg-white"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Label>Semester</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger className="bg-white w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GANJIL">Ganjil</SelectItem>
                    <SelectItem value="GENAP">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Simpan Periode Baru
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Tabel Tahun Akademik */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Daftar Tahun Akademik</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Mobile View: Minimalist Cards */}
            <div className="flex flex-col gap-3 md:hidden">
              {isLoading ? (
                <div className="text-center py-4 text-sm text-neutral-500">
                  Memuat data...
                </div>
              ) : tahunList.length === 0 ? (
                <div className="text-center py-4 text-sm text-neutral-500">
                  Belum ada data
                </div>
              ) : (
                tahunList.map((item) => {
                  const { tahun, semester } = parseTahunAkademik(item);
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3.5 rounded-lg border bg-white shadow-xs gap-3"
                    >
                      <div className="flex flex-col gap-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm text-neutral-900">
                            {tahun}
                          </span>
                          {item.is_active ? (
                            <Badge className="bg-emerald-600 text-[10px] px-2 py-0.5 shrink-0">
                              Aktif
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[10px] px-2 py-0.5 shrink-0">
                              Tidak Aktif
                            </Badge>
                          )}
                        </div>
                        <span className="text-xs text-neutral-500 font-medium">
                          Semester {semester}
                        </span>
                      </div>

                      {!item.is_active && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleActivate(item.id)}
                          className="text-xs h-8 px-3 shrink-0"
                        >
                          Aktifkan
                        </Button>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop View: Table */}
            <div className="hidden md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Semester</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Memuat data...
                      </TableCell>
                    </TableRow>
                  ) : tahunList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4">
                        Belum ada data
                      </TableCell>
                    </TableRow>
                  ) : (
                    tahunList.map((item) => {
                      const { tahun, semester } = parseTahunAkademik(item);
                      return (
                        <TableRow key={item.id}>
                          <TableCell className="font-bold">{tahun}</TableCell>
                          <TableCell>{semester}</TableCell>
                          <TableCell>
                            {item.is_active ? (
                              <Badge className="bg-emerald-600">Aktif</Badge>
                            ) : (
                              <Badge variant="outline">Tidak Aktif</Badge>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {!item.is_active && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleActivate(item.id)}
                              >
                                Aktifkan
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zona Transisi Semester */}
      <Card className="border-amber-300 bg-amber-50/40">
        <CardHeader className="flex flex-row items-center gap-3">
          <FaExclamationTriangle className="text-amber-600 text-2xl" />
          <div>
            <CardTitle className="text-lg text-amber-900">
              Transisi Semester / Pergantian Tahun Ajaran
            </CardTitle>
            <CardDescription className="text-amber-700 text-xs sm:text-sm mt-1">
              Jalankan fitur ini untuk memindahkan siswa ke tahun akademik baru.
              Fitur ini akan menyetel ulang halaqoh, menaikkan kelas siswa, dan{" "}
              <b>menghapus permanen (drop) data siswa kelas 6</b> agar database
              Anda tetap bersih.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-64 flex flex-col gap-3">
            <Label className="text-amber-900 font-semibold mb-1 block">
              Pilih Tahun Ajaran Baru
            </Label>
            <Select value={selectedTahunId} onValueChange={setSelectedTahunId}>
              <SelectTrigger className="bg-white w-full">
                <SelectValue placeholder="Pilih Periode Tujuan..." />
              </SelectTrigger>
              <SelectContent>
                {tahunList.map((t) => {
                  const { tahun, semester, namaLengkap } = parseTahunAkademik(t);
                  return (
                    <SelectItem key={t.id} value={t.id}>
                      {semester !== "-" ? `${tahun} - ${semester}` : namaLengkap}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                disabled={isTransisi}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
              >
                {isTransisi
                  ? "Memproses Transisi..."
                  : "⚡ Mulai Transisi Semester"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Peringatan Transisi Semester!</AlertDialogTitle>
                <AlertDialogDescription>
                  {selectedTahunId ? (
                    <>
                      PERHATIAN: Transisi Semester akan mengosongkan kelompok
                      halaqoh seluruh siswa serta{" "}
                      <b>MENGHAPUS PERMANEN (drop) seluruh data siswa kelas 6</b>.
                      Tindakan ini tidak dapat dibatalkan. Lanjutkan?
                    </>
                  ) : (
                    <>
                      Anda belum memilih tahun akademik tujuan. Silakan pilih
                      periode pada dropdown di atas sebelum melakukan transisi.
                    </>
                  )}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Batal</AlertDialogCancel>
                <AlertDialogAction
                  onClick={selectedTahunId ? handleTransisi : undefined}
                  className={
                    selectedTahunId
                      ? "bg-amber-600 hover:bg-amber-700 text-white font-bold"
                      : "opacity-50 cursor-not-allowed"
                  }
                >
                  {selectedTahunId ? "Lanjutkan Transisi" : "Pilih Tahun Dulu"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
