import React, { useState, useRef } from "react";

import { FaDatabase, FaFileUpload } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BASE_API_URL } from "../../store/baseApi";

import { toast } from "sonner";

function BackupManagement() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // file backup terpilih, menunggu konfirmasi
  const fileInputRef = useRef(null);

  const handleDownloadBackup = async (e) => {
    e.preventDefault();
    try {
      setIsDownloading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(`${BASE_API_URL}/backup`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Body fetch hanya bisa dibaca SEKALI — baca JSON hanya di jalur error,
      // jalur sukses langsung blob().
      if (!response.ok) {
        const resData = await response.json().catch(() => ({}));
        throw new Error(resData.message || "Gagal membuat file backup");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download = `backup_db_khu_${new Date().toISOString().split("T")[0]}.json`;

      document.body.appendChild(a);

      a.click();

      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat backup database");
    } finally {
      setIsDownloading(false);
    }
  };

  // Tahap 1: pilih file → validasi JSON di sisi client → tunggu konfirmasi
  const handleFileSelected = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      const fileText = await file.text();
      let parsed;
      try {
        parsed = JSON.parse(fileText);
      } catch {
        toast.error("File bukan JSON yang valid — file rusak atau salah pilih.");
        return;
      }
      if (!parsed || typeof parsed !== "object" || !parsed.data) {
        toast.error("Struktur file backup tidak dikenali.");
        return;
      }
      setSelectedFile(parsed);
      toast.info(
        "File backup siap. Klik Pulihkan Database untuk menimpa data saat ini.",
      );
    } finally {
      if (event.target) event.target.value = null;
    }
  };

  // Tahap 2: konfirmasi → POST /restore (seluruh data ditimpa isi file backup)
  const handleRestore = async () => {
    if (!selectedFile) {
      toast.error("Pilih file backup terlebih dahulu");
      return;
    }
    const confirmed = window.confirm(
      "PERINGATAN: Restore akan MENGGANTI SELURUH DATA SAAT INI dengan isi file backup.\n\n" +
        "Server otomatis menyimpan snapshot kondisi sekarang sebelum menimpa, tetapi proses ini tidak bisa dibatalkan setelah dimulai.\n\nLanjutkan?",
    );
    if (!confirmed) return;

    try {
      setIsRestoring(true);
      const toastId = toast.loading(
        "Sedang memulihkan database dari file backup...",
      );
      const token = localStorage.getItem("token");
      const response = await fetch(`${BASE_API_URL}/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedFile),
      });
      const resData = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(resData.message || "Gagal memulihkan database");
      toast.success(resData.data?.message || "Database berhasil dipulihkan!", {
        id: toastId,
        duration: 8000,
      });
      setSelectedFile(null);
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat restore database");
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full justify-center items-center max-w-4xl mx-auto p-6">
      {/* 1. KARTU BACKUP */}
      <Card className="flex flex-col py-8 px-0 h-full justify-between">
        <CardHeader className="flex flex-col items-center gap-6 justify-center">
          <FaDatabase size={50} className="text-primary-600" />
          <CardTitle className="text-2xl">Cadangkan Sekarang</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 items-center">
          <Button onClick={handleDownloadBackup} disabled={isDownloading}>
            {isDownloading ? "Mengunduh..." : "Cadangkan Sekarang"}
          </Button>
          <CardDescription className="text-center w-80">
            Simpan file backup ('json') di tempat yang aman sebagai cadangan
            di masa depan.
          </CardDescription>
        </CardContent>
      </Card>

      {/* 2. KARTU RESTORE */}
      <Card className="flex flex-col py-8 px-0 h-full justify-between border-dashed border-2 border-primary-500/50">
        <CardHeader className="flex flex-col items-center gap-6 justify-center">
          <FaFileUpload size={50} className="text-amber-600" />
          <CardTitle className="text-2xl">Pulihkan Data (Restore)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6 items-center">
          {/* Input file tersembunyi */}
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileSelected}
            className="hidden"
          />
          <Button
            variant="outline"
            className="border-amber-600 text-amber-700 hover:bg-amber-50"
            disabled={isRestoring}
            onClick={() => fileInputRef.current.click()}
          >
            {selectedFile ? "Ganti File Backup JSON" : "Pilih File Backup JSON"}
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white"
            disabled={isRestoring || !selectedFile}
            onClick={handleRestore}
          >
            {isRestoring ? "Memulihkan..." : "Pulihkan Database"}
          </Button>
          <CardDescription className="text-center w-80">
            Unggah file backup untuk mengganti (menimpa) seluruh data sekolah
            dengan kondisi saat file itu dibuat. Server otomatis menyimpan
            snapshot kondisi terakhir sebelum restore.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export default BackupManagement;
