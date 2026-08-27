import React, { useState, useRef } from "react";

import { FaDatabase, FaFileUpload, FaLock } from "react-icons/fa";
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

const BACKUP_FORMAT_V2 = "KHU-BACKUP-V2";

function BackupManagement() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [backupPass, setBackupPass] = useState("");
  const [restorePass, setRestorePass] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // file backup terpilih, menunggu konfirmasi
  const fileInputRef = useRef(null);

  const handleDownloadBackup = async (e) => {
    e.preventDefault();
    if (backupPass.trim().length < 8) {
      toast.error(
        "Passphrase minimal 8 karakter — dipakai untuk mengenkripsi file backup.",
      );
      return;
    }
    try {
      setIsDownloading(true);

      const token = localStorage.getItem("token");

      const response = await fetch(
        `${BASE_API_URL}/backup?passphrase=${encodeURIComponent(backupPass.trim())}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const resData = await response.json().catch(() => ({}));
      if (!response.ok) {
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
      toast.success(
        "Backup terenkripsi berhasil diunduh. CATAT passphrase-nya — tanpa passphrase file ini tidak bisa dipulihkan!",
        { duration: 8000 },
      );
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat backup database");
    } finally {
      setIsDownloading(false);
    }
  };

  // Tahap 1: pilih file → validasi JSON + deteksi format → tunggu konfirmasi
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
        parsed.format === BACKUP_FORMAT_V2
          ? "File backup terenkripsi terdeteksi. Isi passphrase lalu klik Pulihkan."
          : "File backup format LAMA terdeteksi (tanpa enkripsi, tanpa password akun).",
        { duration: 6000 },
      );
    } finally {
      if (event.target) event.target.value = null;
    }
  };

  // Tahap 2: konfirmasi berat → POST /restore
  const handleRestore = async () => {
    if (!selectedFile) {
      toast.error("Pilih file backup terlebih dahulu");
      return;
    }
    const isEncrypted = selectedFile.format === BACKUP_FORMAT_V2;
    if (isEncrypted && restorePass.trim().length < 8) {
      toast.error("Isi passphrase file backup (minimal 8 karakter).");
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
        body: JSON.stringify({
          passphrase: restorePass.trim(),
          backup: selectedFile,
        }),
      });
      const resData = await response.json().catch(() => ({}));
      if (!response.ok)
        throw new Error(resData.message || "Gagal memulihkan database");
      toast.success(resData.data?.message || "Database berhasil dipulihkan!", {
        id: toastId,
        duration: 8000,
      });
      setSelectedFile(null);
      setRestorePass("");
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
        <CardContent className="flex flex-col gap-4 items-center">
          <div className="w-80 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-700 flex items-center gap-1.5">
              <FaLock className="text-primary-600" /> Passphrase Enkripsi
              (min. 8 karakter)
            </label>
            <input
              type="password"
              value={backupPass}
              onChange={(e) => setBackupPass(e.target.value)}
              placeholder="Buat passphrase untuk file backup"
              className="h-9 w-full px-3 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <Button onClick={handleDownloadBackup} disabled={isDownloading}>
            {isDownloading ? "Mengunduh..." : "Cadangkan Sekarang"}
          </Button>
          <CardDescription className="text-center w-80">
            File backup dienkripsi (AES-256) beserta data akun — simpan file
            DAN passphrase-nya di tempat yang aman. Tanpa passphrase, file
            tidak bisa dipulihkan.
          </CardDescription>
        </CardContent>
      </Card>

      {/* 2. KARTU RESTORE */}
      <Card className="flex flex-col py-8 px-0 h-full justify-between border-dashed border-2 border-amber-500/60">
        <CardHeader className="flex flex-col items-center gap-6 justify-center">
          <FaFileUpload size={50} className="text-amber-600" />
          <CardTitle className="text-2xl">Pulihkan Data (Restore)</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 items-center">
          {/* Input file tersembunyi */}
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            onChange={handleFileSelected}
            className="hidden"
          />
          <div className="w-80 flex flex-col gap-1.5">
            <label className="text-xs font-medium text-neutral-700 flex items-center gap-1.5">
              <FaLock className="text-amber-600" /> Passphrase File Backup
            </label>
            <input
              type="password"
              value={restorePass}
              onChange={(e) => setRestorePass(e.target.value)}
              placeholder="Passphrase saat file dibackup"
              className="h-9 w-full px-3 border border-neutral-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>
          <Button
            variant="outline"
            className="border-amber-600 text-amber-700 hover:bg-amber-50"
            disabled={isRestoring}
            onClick={() => fileInputRef.current.click()}
          >
            {selectedFile
              ? "Ganti File Backup JSON"
              : "Pilih File Backup JSON"}
          </Button>
          <Button
            className="bg-amber-600 hover:bg-amber-700 text-white"
            disabled={isRestoring || !selectedFile}
            onClick={handleRestore}
          >
            {isRestoring ? "Memulihkan..." : "Pulihkan Database"}
          </Button>
          <CardDescription className="text-center w-80">
            Seluruh data saat ini akan diganti dengan isi file backup. Server
            otomatis menyimpan snapshot kondisi terakhir sebelum restore.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export default BackupManagement;
