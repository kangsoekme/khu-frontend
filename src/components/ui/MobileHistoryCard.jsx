import React from "react";
import { Badge } from "@/components/ui/badge";
import { FaCalendarAlt } from "react-icons/fa";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

function MobileHistoryCard({
  date, // Tanggal (misal: 24 Juli 2026)
  day, // Hari (misal: Senin)
  titleInformation1,
  titleInformation2,
  title1, // Judul utama (misal: Nama Surah)
  subtitle1, // Subjudul (misal: Ayat 1-10)
  title2, // Judul utama (misal: Nama Surah)
  subtitle2, // Subjudul (misal: Ayat 1-10)
  score1, // Objek nilai pertama { label: "Nilai Bacaan", value: 90 }
  score2, // Objek nilai kedua { label: "Nilai Hafalan", value: 85 } (Opsional)
  badgeText, // Teks predikat (misal: MUMTAZ)
  description,
  showActions = false, // Menampilkan menu 3 titik
  onEdit, // Fungsi edit
  onDelete, // Fungsi hapus
}) {
  return (
    <Card className="flex flex-col shadow-sm border-neutral-200 overflow-hidden">
      <CardHeader className="bg-neutral-50 border-b pb-4">
        <div className="flex items-start justify-between">
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <FaCalendarAlt className="text-primary-500 text-sm" />
              <CardTitle className="text-base text-neutral-800">{day}</CardTitle>
            </div>
            <CardDescription className="font-medium text-xs text-neutral-500">
              {date}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            {badgeText && (
              <Badge className="bg-primary-100 text-primary-700 hover:bg-primary-200 border-none font-bold">
                {badgeText}
              </Badge>
            )}
            {showActions && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <FaEllipsisV className="text-neutral-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={onEdit} className="cursor-pointer">
                    <FaEdit className="mr-2 text-primary-600" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-700">
                    <FaTrash className="mr-2" /> Hapus
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col gap-4 pt-5 pb-5">
        <div className="flex flex-col gap-4">
          {(title1 || title2) && (
            <div className="flex flex-col gap-3">
              {title1 && (
                <div className="flex flex-col p-3 rounded-lg bg-blue-50/50 border border-blue-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-500 mb-1">
                    {titleInformation1}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-blue-900 text-sm">{title1}</span>
                    <span className="font-medium text-blue-700 text-xs">{subtitle1}</span>
                  </div>
                </div>
              )}
              {title2 && (
                <div className="flex flex-col p-3 rounded-lg bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500 mb-1">
                    {titleInformation2}
                  </span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-bold text-emerald-900 text-sm">{title2}</span>
                    <span className="font-medium text-emerald-700 text-xs">{subtitle2}</span>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {(score1 || score2) && (
            <div className="flex gap-4 mt-2">
              {score1 && (
                <div className="flex flex-col gap-1 items-center bg-neutral-50 rounded-lg p-3 flex-1 border">
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider text-center">
                    {score1.label}
                  </span>
                  <span className="font-extrabold text-xl text-neutral-800">{score1.value}</span>
                </div>
              )}
              {score2 && (
                <div className="flex flex-col gap-1 items-center bg-neutral-50 rounded-lg p-3 flex-1 border">
                  <span className="text-[10px] font-semibold text-neutral-500 uppercase tracking-wider text-center">
                    {score2.label}
                  </span>
                  <span className="font-extrabold text-xl text-neutral-800">{score2.value}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {description && (
          <>
            <Separator className="my-1" />
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-neutral-800 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500"></span> Catatan
              </span>
              <p className="text-sm text-neutral-600 bg-neutral-50 p-3 rounded-md italic leading-relaxed">
                "{description}"
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Pastikan menggunakan Named Export seperti pelajaran sebelumnya!
export { MobileHistoryCard };
