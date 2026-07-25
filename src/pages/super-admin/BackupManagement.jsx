import React, { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaDatabase, FaDownload } from "react-icons/fa"; // Ikon database dan panah bawah
import { BASE_API_URL } from "../../store/baseApi";

import { toast } from "sonner";

function BackupManagement() {
  const [isDownloading, setIsDownloading] = useState(false);

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

  return (
    <div className="flex flex-col gap-5 h-full justify-center items-center">
      <Card className=" flex flex-col py-8 px-0">
        <CardHeader className="flex flex-col items-center gap-6 justify-center">
          <FaDatabase size={50} className="text-primary-600" />
          <CardTitle className="text-2xl">Cadangkan Sekarang</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form
            action=""
            onSubmit={handleDownloadBackup}
            className="flex justify-center items-center"
          >
            <Button>Cadangkan Sekarang</Button>
          </form>
          <CardDescription className="text-center w-80">
            Simpan file tersebut ('json') di tempat yang aman sebagai cadangan
            di masa yang akan datang
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}

export default BackupManagement;
