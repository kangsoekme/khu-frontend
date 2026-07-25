import React from "react";

import { cn } from "@/lib/utils";

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { LuUsers } from "react-icons/lu";
import { TbSchool } from "react-icons/tb";
import { MdGroups } from "react-icons/md";

function TotalCard({ className, summary }) {
  const totalGuru = summary?.guru?.total || 0;
  const totalSiswa = summary?.siswa?.total || 0;
  const siswaLaki = summary?.siswa?.laki_laki || 0;
  const siswaPerempuan = summary?.siswa?.perempuan || 0;

  const halaqohTahsin = summary?.halaqoh?.tahsin || 0;
  const halaqohTahfidz = summary?.halaqoh?.tahfidz || 0;

  return (
    <>
      <div className={cn("grid xl:grid-cols-4 gap-5", className)}>
        <Card className="flex flex-col justify-between xl:col-span-2">
          <CardContent>
            <div className="p-4 bg-primary-600 w-fit rounded-xl">
              <LuUsers className="text-xl text-neutral-white" />
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle className="font-bold text-4xl">{totalGuru}</CardTitle>
            <CardDescription className="text-lg">TOTAL GURU</CardDescription>
            <CardDescription className="text-sm">
              Pengajar Aktif
            </CardDescription>
          </CardHeader>
        </Card>
        <Card className="flex flex-col justify-between xl:col-span-2">
          <CardContent>
            <div className="p-4 bg-primary-600 w-fit rounded-xl">
              <TbSchool className="text-xl text-neutral-white" />
            </div>
          </CardContent>
          <CardHeader>
            <CardTitle className="font-bold text-4xl">{totalSiswa}</CardTitle>
            <CardDescription className="text-lg">TOTAL SISWA</CardDescription>
            <CardDescription className="text-sm">
              {siswaLaki} Laki Laki - {siswaPerempuan} Perempuan
            </CardDescription>
          </CardHeader>
        </Card>

        {/* {summary?.halaqoh && (
          <Card className="flex flex-col justify-between">
            <CardContent>
              <div className="p-4 bg-primary-600 w-fit rounded-xl">
                <MdGroups className="text-xl text-neutral-white" />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle className="font-bold text-3xl">
                {halaqohTahsin}
              </CardTitle>
              <CardDescription className="text-base font-medium">
                Kelompok Tahsin
              </CardDescription>
              <CardDescription className="text-xs">
                Halaqoh Aktif
              </CardDescription>
            </CardHeader>
          </Card>
        )}

        {summary?.halaqoh && (
          <Card className="flex flex-col justify-between">
            <CardContent>
              <div className="p-4 bg-primary-600 w-fit rounded-xl">
                <MdGroups className="text-xl text-neutral-white" />
              </div>
            </CardContent>
            <CardHeader>
              <CardTitle className="font-bold text-3xl">
                {halaqohTahfidz}
              </CardTitle>
              <CardDescription className="text-base font-medium">
                Kelompok Tahfidz
              </CardDescription>
              <CardDescription className="text-xs">
                Halaqoh Aktif
              </CardDescription>
            </CardHeader>
          </Card>
        )} */}
      </div>
    </>
  );
}

export default TotalCard;
