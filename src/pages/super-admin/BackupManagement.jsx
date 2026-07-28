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
  const fileInputRef = useRef(null);

  const handleDownloadBackup = async (e) => {
    e.preventDefault();
    try {
      setIsDownloading(true);

      const token = sessionStorage.getItem("token");

      const response = await fetch(`${BASE_API_URL}/backup`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Gagal mengunduh file backup");
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
      toast.error("Terjadi kesalahan saat backup database");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleRestoreUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    try {
      setIsRestoring(true);
      const toastId = toast.loading(
        "Sedang memulihkan database dari file backup...",
      );
      // Baca isi file JSON yang dipilih user
      const fileText = await file.text();
      const token = sessionStorage.getItem("token");
      const response = await fetch(`${BASE_API_URL}/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: fileText, // Kirim JSON langsung
      });
      const resData = await response.json();
      if (!response.ok)
        throw new Error(resData.errors || "Gagal memulihkan database");
      toast.success("Database berhasil dipulihkan ke kondisi backup!", {
        id: toastId,
      });
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat restore database");
    } finally {
      setIsRestoring(false);
      if (event.target) event.target.value = null; // Reset input file
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full justify-center items-center max-w-4xl mx-auto p-6">
      {/* 1. KARTU BACKUP (LAMA) */}
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
            Simpan file tersebut ('json') di tempat yang aman sebagai cadangan
            di masa depan.
          </CardDescription>
        </CardContent>
      </Card>
      {/* 2. 💡 KARTU RESTORE (BARU) */}
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
            onChange={handleRestoreUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            className="border-amber-600 text-amber-700 hover:bg-amber-50"
            disabled={isRestoring}
            onClick={() => fileInputRef.current.click()}
          >
            {isRestoring ? "Memulihkan..." : "Pilih File Backup JSON"}
          </Button>
          <CardDescription className="text-center w-80">
            Unggah file backup ('json') yang pernah Anda unduh sebelumnya untuk
            mengembalikan seluruh data sekolah.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export default BackupManagement;
