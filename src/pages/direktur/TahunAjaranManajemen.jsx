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
import { FaCalendarCheck, FaExclamationTriangle } from "react-icons/fa";

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
    if (
      !confirm(
        "PERHATIAN: Transisi Semester akan mengosongkan kelompok halaqoh seluruh siswa agar siap dikelompokkan ulang untuk semester baru, serta mengarsipkan kelas sebelumnya. Lanjutkan?",
      )
    ) {
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
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Tambah Tahun Ajaran</CardTitle>
            <CardDescription>Buat periode akademik baru</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div>
                <Label>Tahun Ajaran (Contoh: 2026/2027)</Label>
                <Input
                  value={tahun}
                  onChange={(e) => setTahun(e.target.value)}
                  placeholder="2026/2027"
                  required
                />
              </div>
              <div>
                <Label>Semester</Label>
                <Select value={semester} onValueChange={setSemester}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GANJIL">Ganjil</SelectItem>
                    <SelectItem value="GENAP">Genap</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" disabled={isCreating}>
                Simpan Periode
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
                  tahunList.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-bold">
                        {item.tahun || item.nama_tahun}
                      </TableCell>
                      <TableCell>{item.semester}</TableCell>
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
                  ))
                )}
              </TableBody>
            </Table>
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
            <CardDescription className="text-amber-700">
              Gunakan fitur ini saat memasuki semester baru atau kenaikan kelas.
              Fitur ini akan menyetel ulang (mereset) halaqoh siswa agar Anda
              dapat mengelompokkan ulang mereka menggunakan fitur{" "}
              <b>Similar Progress</b>.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-64">
            <Label className="text-amber-900 font-semibold mb-1 block">
              Pilih Tahun Ajaran Baru
            </Label>
            <Select value={selectedTahunId} onValueChange={setSelectedTahunId}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="Pilih Periode Tujuan..." />
              </SelectTrigger>
              <SelectContent>
                {tahunList.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.tahun || t.nama_tahun} - {t.semester}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            onClick={handleTransisi}
            disabled={isTransisi}
            className="bg-amber-600 hover:bg-amber-700 text-white font-bold"
          >
            {isTransisi
              ? "Memproses Transisi..."
              : "⚡ Mulai Transisi Semester"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
