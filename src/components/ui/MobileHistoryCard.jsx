import React from "react";
import { Badge } from "@/components/ui/badge";
import { FaCalendarAlt } from "react-icons/fa"; // Pastikan react-icons/fa sudah di-install
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
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle>{day}</CardTitle>
            <CardDescription>{date}</CardDescription>
          </div>
          <Badge>{badgeText}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          {(title1 || title2) && (
            <div className="flex justify-between w-full">
              {title1 && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-neutral-textmuted">
                    {titleInformation1}
                  </span>
                  <span className="font-semibold text-primary-800">
                    {title1}
                  </span>
                  <span className="font-semibold text-neutral-textmuted">
                    {subtitle1}
                  </span>
                </div>
              )}
              {title2 && (
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-xs text-neutral-textmuted ">
                    {titleInformation2}
                  </span>
                  <span className="font-semibold text-primary-800 ">
                    {title2}
                  </span>
                  <span className="font-semibold text-neutral-textmuted ">
                    {subtitle2}
                  </span>
                </div>
              )}
            </div>
          )}
          <div className="flex items-center gap-3">
            {(score1 || score2) && (
              <div className="flex flex-col">
                <span></span>
                <div className="flex gap-2">
                  {score1 && (
                    <div className="flex flex-col gap-1 items-center">
                      <span className=" text-xs text-neutral-textmuted">
                        {score1.label}
                      </span>
                      <span className="font-bold text-lg">{score1.value}</span>
                    </div>
                  )}
                  {score2 && (
                    <div className="flex flex-col gap-1 items-center">
                      <span className=" text-xs text-neutral-textmuted">
                        {score2.label}
                      </span>
                      <span className="font-bold text-lg">{score2.value}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {description && <p className="w-full h-20 pt-6">{description}</p>}
      </CardContent>
    </Card>
  );
}

// Pastikan menggunakan Named Export seperti pelajaran sebelumnya!
export { MobileHistoryCard };
