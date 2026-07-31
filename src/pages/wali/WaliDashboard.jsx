
import { useGetStudentQuery } from "../../store/api/studentsApi";
import { useGetRiwayatTahsinQuery } from "../../store/api/tahsinApi";
import {
  useGetRiwayatHafalanQuery,
  useGetRiwayatMurajaahQuery,
} from "../../store/api/tahfidzApi";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ChartPerkembangan from "../../components/tahsin-tahfidz/ChartPerkembangan";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useState } from "react";
import { MobileHistoryCard } from "../../components/ui/MobileHistoryCard";
import { FaCalendarCheck } from "react-icons/fa";

export default function WaliDashboard() {
  const nis = sessionStorage.getItem("nis");

  const { data: studentRes, isLoading: isLoadingStudent } =
    useGetStudentQuery(nis);
  const { data: riwayatTahsinRes, isLoading: isLoadingTahsin } =
    useGetRiwayatTahsinQuery(nis);
  const { data: riwayatHafalanRes, isLoading: isLoadingHafalan } =
    useGetRiwayatHafalanQuery(nis);
  const { data: riwayatMurajaahRes, isLoading: isLoadingMurajaah } =
    useGetRiwayatMurajaahQuery(nis);

  const ITEMS_PER_PAGE = 7;
  const [currentPageTahsin, setCurrentPageTahsin] = useState(1);
  const [currentPageHafalan, setCurrentPageHafalan] = useState(1);
  const [currentPageMurajaah, setCurrentPageMurajaah] = useState(1);

  if (
    isLoadingStudent ||
    isLoadingTahsin ||
    isLoadingHafalan ||
    isLoadingMurajaah
  ) {
    return <p className="text-center mt-10">Memuat profil dan riwayat...</p>;
  }

  const student = studentRes?.data;
  const riwayatTahsinList = riwayatTahsinRes?.data?.history || [];
  const tahsinSummary = riwayatTahsinRes?.data?.summary;
  
  const riwayatHafalanList = riwayatHafalanRes?.data?.history?.hafalan_baru || [];
  const tahfidzSummary = riwayatHafalanRes?.data?.history?.summary;
  
  const riwayatMurajaahList = riwayatMurajaahRes?.data?.history?.murajaah_baru || [];

  const paginatedTahsin = riwayatTahsinList.slice(
    (currentPageTahsin - 1) * ITEMS_PER_PAGE,
    currentPageTahsin * ITEMS_PER_PAGE
  );

  const paginatedHafalan = riwayatHafalanList.slice(
    (currentPageHafalan - 1) * ITEMS_PER_PAGE,
    currentPageHafalan * ITEMS_PER_PAGE
  );

  const paginatedMurajaah = riwayatMurajaahList.slice(
    (currentPageMurajaah - 1) * ITEMS_PER_PAGE,
    currentPageMurajaah * ITEMS_PER_PAGE
  );

  const renderPagination = (page, total, setPage) => {
    const totalPages = Math.ceil(total / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
      if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (page <= 3) return [1, 2, 3, 4, "...", totalPages];
      if (page >= totalPages - 2) return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      return [1, "...", page - 1, page, page + 1, "...", totalPages];
    };

    return (
      <Pagination className="mt-6 mb-2">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
          {getPageNumbers().map((p, index) =>
            p === "..." ? (
              <PaginationItem key={`ellipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={p}>
                <PaginationLink href="#" isActive={p === page} onClick={(e) => { e.preventDefault(); setPage(p); }}>
                  {p}
                </PaginationLink>
              </PaginationItem>
            )
          )}
          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => { e.preventDefault(); if (page < totalPages) setPage(page + 1); }}
              className={page === totalPages ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const prepareChartDataTahsin = (list) => {
    return [...(list || [])].reverse().map((item, idx) => {
      const gradeMap = {
        "A+": 98,
        A: 90,
        "B+": 85,
        B: 80,
        "B-": 75,
        "C+": 70,
        C: 65,
        "C-": 60,
        D: 50,
      };
      const gradeVal = item.nilai_tahsin;
      const numScore = gradeMap[gradeVal] || 75;
      const dateVal = item.timestamp || item.tanggal;
      const dateStr = dateVal
        ? new Date(dateVal).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          })
        : `P-${idx + 1}`;
      return { date: dateStr, score: numScore, nilai: gradeVal };
    });
  };

  const prepareChartDataHafalan = (list) => {
    return [...(list || [])].reverse().map((item, idx) => {
      const dateVal = item.timestamp || item.tanggal;
      const dateStr = dateVal
        ? new Date(dateVal).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
          })
        : `P-${idx + 1}`;
      return {
        date: dateStr,
        ayat: Number(item.ayat_akhir) || Number(item.jumlah_ayat) || (idx + 1) * 5,
      };
    });
  };

  const chartDataTahsin = prepareChartDataTahsin(riwayatTahsinList);
  const chartDataHafalan = prepareChartDataHafalan(riwayatHafalanList);

  return (
    <div className="flex flex-col gap-6 max-w-7xl mx-auto p-4 md:p-6">
      {/* Profil Singkat */}
      <Card className="shadow-sm">
        <CardContent className="flex flex-col md:flex-row items-center gap-6 p-6 text-center md:text-left">
          <Avatar className="h-24 w-24 border-4 border-primary-100">
            <AvatarImage src={student?.profile_photo} />
            <AvatarFallback className="text-3xl bg-blue-100 text-blue-700">
              {student?.nama?.charAt(0) || "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-2 items-center md:items-start">
            <CardTitle className="font-bold text-2xl">
              {student?.nama}
            </CardTitle>
            <CardDescription className="text-base">
              NIS: {student?.nis} | {student?.riwayatKelas?.[0]?.nama_kelas}
            </CardDescription>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
              <Badge className="px-3 py-1.5 font-medium">
                Tahsin: {student?.halaqoh_tahsin?.nama || "Belum ada kelompok"}
              </Badge>
              <Badge className="px-3 py-1.5 font-medium bg-emerald-600 hover:bg-emerald-700">
                Tahfidz:{" "}
                {student?.halaqoh_tahfidz?.nama || "Belum ada kelompok"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs Utama */}
      <Tabs defaultValue="tahsin" className="w-full">
        <TabsList className="grid w-full grid-cols-2 h-auto min-h-12 p-1">
          <TabsTrigger value="tahsin" className="h-10 text-sm md:text-base">Tahsin Qiraah</TabsTrigger>
          <TabsTrigger value="tahfidz" className="h-10 text-sm md:text-base">Tahfidz Quran</TabsTrigger>
        </TabsList>

        {/* --- KONTEN TAHSIN --- */}
        <TabsContent value="tahsin" className="flex flex-col gap-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <Card>
                <CardContent className="flex flex-col justify-between h-full p-6">
                  <div className="flex justify-between items-start">
                    <CardDescription className="font-medium text-xs md:text-sm">TOTAL PERTEMUAN</CardDescription>
                    <div className="p-3 md:p-4 w-fit rounded-xl bg-primary-600">
                      <FaCalendarCheck className="text-neutral-white text-lg md:text-xl" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <CardTitle className="text-3xl md:text-4xl font-bold">
                      {tahsinSummary?.total_pertemuan || 0}
                    </CardTitle>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col justify-between h-full p-6">
                  <div className="flex justify-between items-start">
                    <CardDescription className="font-medium text-xs md:text-sm">RATA RATA NILAI</CardDescription>
                    <div className="p-3 md:p-4 w-fit rounded-xl bg-primary-600">
                      <FaCalendarCheck className="text-neutral-white text-lg md:text-xl" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <CardTitle className="text-3xl md:text-4xl font-bold">
                      {tahsinSummary?.rata_rata || "-"}
                    </CardTitle>
                  </div>
                </CardContent>
              </Card>
          </div>

          <div className="w-full h-full min-h-[300px]">
            <ChartPerkembangan
              data={chartDataTahsin}
              title="Grafik Nilai Tahsin"
              desc="Perkembangan nilai tahsin ananda"
              dataKey="score"
              label="Skor Perkembangan"
            />
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Detail Riwayat Tahsin</CardTitle>
            </CardHeader>
            <CardContent>
              <Table className="hidden lg:table">
                <TableHeader>
                  <TableRow>
                    <TableHead>HARI / TANGGAL</TableHead>
                    <TableHead>HAFALAN PENDEK</TableHead>
                    <TableHead>LAPORAN BACAAN</TableHead>
                    <TableHead>NILAI</TableHead>
                    <TableHead>STATUS</TableHead>
                    <TableHead>KETERANGAN</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {riwayatTahsinList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-5">
                        Belum ada riwayat setoran tahsin
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTahsin.map((riwayat, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold uppercase text-xs md:text-sm">
                              {new Date(riwayat.timestamp).toLocaleDateString("id-ID", { weekday: "long" })}
                            </span>
                            <span className="text-neutral-textmuted text-xs md:text-sm">
                              {new Date(riwayat.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-xs md:text-sm">
                              {riwayat.hafalan_surah?.surah || "-"}
                            </span>
                            <span className="text-neutral-textmuted text-xs md:text-sm">
                              {riwayat.hafalan_surah?.ayat_awal || "-"} -
                              {riwayat.hafalan_surah?.ayat_akhir || "-"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col gap-2">
                            {riwayat.laporan_bacaan?.jilid !== null && riwayat.laporan_bacaan?.jilid !== undefined && (
                              <div className="flex flex-col">
                                <span className="font-bold text-primary-600 text-xs md:text-sm">
                                  {riwayat.laporan_bacaan.jilid === 0
                                    ? riwayat.tahapan === "GHARIB" ? "GHARIB" : riwayat.tahapan === "TAJWID" ? "TAJWID" : "BUKU"
                                    : `JILID ${riwayat.laporan_bacaan.jilid}`}
                                </span>
                                <span className="text-neutral-textmuted text-xs md:text-sm">
                                  Hal {riwayat.laporan_bacaan.bab || "-"}
                                </span>
                              </div>
                            )}
                            {riwayat.laporan_bacaan?.surah && (
                              <div className="flex flex-col">
                                <span className="font-bold text-emerald-600 text-xs md:text-sm">
                                  {riwayat.laporan_bacaan.surah}
                                </span>
                                <span className="text-neutral-textmuted text-xs md:text-sm">
                                  Ayat {riwayat.laporan_bacaan.ayat_awal || "-"} - {riwayat.laporan_bacaan.ayat_akhir || "-"}
                                </span>
                              </div>
                            )}
                            {(riwayat.laporan_bacaan?.jilid === null || riwayat.laporan_bacaan?.jilid === undefined) && !riwayat.laporan_bacaan?.surah && (
                              <div className="flex flex-col">
                                <span className="font-bold text-primary-600 text-xs md:text-sm">
                                  {riwayat.laporan_bacaan?.jilid_surah
                                    ? (!isNaN(riwayat.laporan_bacaan.jilid_surah)
                                        ? `JILID ${riwayat.laporan_bacaan.jilid_surah}`
                                        : riwayat.laporan_bacaan.jilid_surah)
                                    : "-"}
                                </span>
                                <span className="text-neutral-textmuted text-xs md:text-sm">
                                  {riwayat.laporan_bacaan?.ayat || "-"}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-bold text-base md:text-lg">
                          {riwayat.nilai_tahsin || "-"}
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-primary-600">
                            {riwayat.status_kelanjutan === "MENGULANG"
                              ? "TIDAK LULUS"
                              : riwayat.status_kelanjutan || ""}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs md:text-sm max-w-50 truncate">
                          {riwayat.keterangan || "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="flex flex-col lg:hidden mt-4 gap-6">
                {paginatedTahsin.map((riwayat, i) => (
                  <MobileHistoryCard
                    key={i}
                    day={new Date(riwayat.timestamp).toLocaleDateString("id-ID", { weekday: "long" })}
                    date={new Date(riwayat.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                    titleInformation1={"Setoran"}
                    title1={
                      riwayat.laporan_bacaan?.jilid !== null && riwayat.laporan_bacaan?.jilid !== undefined
                        ? (riwayat.laporan_bacaan.jilid === 0
                            ? (riwayat.tahapan === "GHARIB" ? "Gharib" : riwayat.tahapan === "TAJWID" ? "Tajwid" : "Buku")
                            : `Jilid ${riwayat.laporan_bacaan.jilid}`)
                        : (riwayat.laporan_bacaan?.surah 
                            ? riwayat.laporan_bacaan.surah 
                            : riwayat.laporan_bacaan.jilid_surah || "-")
                    }
                    subtitle1={
                      riwayat.laporan_bacaan?.jilid !== null && riwayat.laporan_bacaan?.jilid !== undefined
                        ? `Hal ${riwayat.laporan_bacaan.bab || "-"}`
                        : (riwayat.laporan_bacaan?.surah
                            ? `Ayat ${riwayat.laporan_bacaan.ayat_awal || "-"} - ${riwayat.laporan_bacaan.ayat_akhir || "-"}`
                            : riwayat.laporan_bacaan?.ayat)
                    }
                    titleInformation2={"Hafalan Pendek"}
                    title2={riwayat.hafalan_surah?.surah || "-"}
                    subtitle2={`${riwayat.hafalan_surah?.ayat_awal} - ${riwayat.hafalan_surah?.ayat_akhir}`}
                    badgeText={riwayat.nilai_tahsin}
                    description={riwayat.keterangan}
                  />
                ))}
              </div>
              {renderPagination(currentPageTahsin, riwayatTahsinList.length, setCurrentPageTahsin)}
            </CardContent>
          </Card>
        </TabsContent>

        {/* --- KONTEN TAHFIDZ --- */}
        <TabsContent value="tahfidz" className="flex flex-col gap-6 py-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
             <Card>
                <CardContent className="flex flex-col justify-between h-full p-6">
                  <div className="flex justify-between items-start">
                    <CardDescription className="font-medium text-xs md:text-sm">TOTAL HAFALAN</CardDescription>
                    <div className="p-3 md:p-4 w-fit rounded-xl bg-primary-600">
                      <FaCalendarCheck className="text-neutral-white text-lg md:text-xl" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <CardTitle className="text-3xl md:text-4xl font-bold">
                      {tahfidzSummary?.total_hafalan || 0}
                    </CardTitle>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex flex-col justify-between h-full p-6">
                  <div className="flex justify-between items-start">
                    <CardDescription className="font-medium text-xs md:text-sm">RATA RATA KELANCARAN</CardDescription>
                    <div className="p-3 md:p-4 w-fit rounded-xl bg-primary-600">
                      <FaCalendarCheck className="text-neutral-white text-lg md:text-xl" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1 mt-2">
                    <CardTitle className="text-3xl md:text-4xl font-bold">
                      {tahfidzSummary?.rata_rata_kelancaran || "-"}
                    </CardTitle>
                  </div>
                </CardContent>
              </Card>
          </div>

          <div className="w-full h-full min-h-[300px]">
             <ChartPerkembangan
                data={chartDataHafalan}
                title="Grafik Hafalan Tahfidz"
                desc="Pergerakan jumlah ayat akhir yang dihafalkan siswa"
                dataKey="ayat"
                label="Capai Ayat Akhir"
              />
          </div>

          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle>Detail Riwayat Tahfidz</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Nested Tabs untuk Hafalan & Murajaah */}
              <Tabs defaultValue="hafalan" className="w-full py-2">
                <TabsList className="grid w-full grid-cols-2 h-auto min-h-12 p-1 mb-4">
                  <TabsTrigger value="hafalan" className="h-10 text-sm">Riwayat Hafalan</TabsTrigger>
                  <TabsTrigger value="murajaah" className="h-10 text-sm">Riwayat Murajaah</TabsTrigger>
                </TabsList>
                
                <TabsContent value="hafalan">
                  <Table className="hidden lg:table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>HARI / TANGGAL</TableHead>
                          <TableHead>SURAH / AYAT</TableHead>
                          <TableHead>NILAI BACAAN</TableHead>
                          <TableHead>NILAI HAFALAN</TableHead>
                          <TableHead>PREDIKAT</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {riwayatHafalanList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-5">
                              Belum ada riwayat setoran hafalan baru
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedHafalan.map((riwayat, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold uppercase text-xs md:text-sm">
                                    {new Date(riwayat.tanggal || riwayat.timestamp).toLocaleDateString("id-ID", { weekday: "long" })}
                                  </span>
                                  <span className="text-neutral-textmuted text-xs md:text-sm">
                                    {new Date(riwayat.tanggal || riwayat.timestamp).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium text-xs md:text-sm">
                                    {riwayat.surah?.nama_surah || "-"}
                                  </span>
                                  <span className="text-neutral-textmuted text-xs md:text-sm">
                                    {riwayat.ayat_awal || "-"} -{" "}
                                    {riwayat.ayat_akhir || "-"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="font-bold text-base md:text-lg">
                                {riwayat.nilai_bacaan || riwayat.nilai || "0"}
                              </TableCell>
                              <TableCell className="font-bold text-base md:text-lg">
                                {riwayat.nilai_hafalan || riwayat.nilai || "0"}
                              </TableCell>
                              <TableCell>
                                <Badge className="text-xs">{riwayat.predikat || riwayat.nilai || "-"}</Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                  </Table>
                  <div className="flex flex-col lg:hidden mt-4 gap-6">
                    {paginatedHafalan.map((riwayat, i) => (
                       <MobileHistoryCard
                          key={i}
                          day={new Date(riwayat.tanggal || riwayat.timestamp).toLocaleDateString("id-ID", { weekday: "long" })}
                          date={new Date(riwayat.tanggal || riwayat.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                          titleInformation1={"Hafalan Baru"}
                          title1={riwayat.surah?.nama_surah || "-"}
                          subtitle1={`Ayat: ${riwayat.ayat_awal || "-"} - ${riwayat.ayat_akhir || "-"}`}
                          score1={{
                            label: "Bacaan",
                            value: riwayat.nilai_bacaan || riwayat.nilai || "0",
                          }}
                          score2={{
                            label: "Hafalan",
                            value: riwayat.nilai_hafalan || riwayat.nilai || "0",
                          }}
                          badgeText={riwayat.predikat || riwayat.nilai}
                        />
                    ))}
                  </div>
                  {renderPagination(currentPageHafalan, riwayatHafalanList.length, setCurrentPageHafalan)}
                </TabsContent>

                <TabsContent value="murajaah">
                  <Table className="hidden lg:table">
                      <TableHeader>
                        <TableRow>
                          <TableHead>HARI / TANGGAL</TableHead>
                          <TableHead>SURAH / AYAT</TableHead>
                          <TableHead>NILAI BACAAN</TableHead>
                          <TableHead>NILAI HAFALAN</TableHead>
                          <TableHead>PREDIKAT</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {riwayatMurajaahList.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-5">
                              Belum ada riwayat murajaah
                            </TableCell>
                          </TableRow>
                        ) : (
                          paginatedMurajaah.map((murajaah, i) => (
                            <TableRow key={i}>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-semibold uppercase text-xs md:text-sm">
                                    {new Date(murajaah.tanggal || murajaah.timestamp).toLocaleDateString("id-ID", { weekday: "long" })}
                                  </span>
                                  <span className="text-neutral-textmuted text-xs md:text-sm">
                                    {new Date(murajaah.tanggal || murajaah.timestamp).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <span className="font-medium text-xs md:text-sm">
                                    {murajaah.surah?.nama_surah || "-"}
                                  </span>
                                  <span className="text-neutral-textmuted text-xs md:text-sm">
                                    {murajaah.ayat_awal || "-"} -{" "}
                                    {murajaah.ayat_akhir || "-"}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="font-bold text-base md:text-lg">
                                {murajaah.nilai_bacaan || murajaah.nilai || "0"}
                              </TableCell>
                              <TableCell className="font-bold text-base md:text-lg">
                                {murajaah.nilai_hafalan || murajaah.nilai || "0"}
                              </TableCell>
                              <TableCell>
                                <Badge className="text-xs">{murajaah.predikat || murajaah.nilai || "-"}</Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                  </Table>
                  <div className="flex flex-col lg:hidden mt-4 gap-6">
                    {paginatedMurajaah.map((murajaah, i) => (
                       <MobileHistoryCard
                          key={i}
                          day={new Date(murajaah.tanggal || murajaah.timestamp).toLocaleDateString("id-ID", { weekday: "long" })}
                          date={new Date(murajaah.tanggal || murajaah.timestamp).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                          titleInformation1={"Murajaah Baru"}
                          title1={murajaah.surah?.nama_surah || "-"}
                          subtitle1={`Ayat: ${murajaah.ayat_awal || "-"} - ${murajaah.ayat_akhir || "-"}`}
                          score1={{
                            label: "Bacaan",
                            value: murajaah.nilai_bacaan || murajaah.nilai || "0",
                          }}
                          score2={{
                            label: "Hafalan",
                            value: murajaah.nilai_hafalan || murajaah.nilai || "0",
                          }}
                          badgeText={murajaah.predikat || murajaah.nilai}
                        />
                    ))}
                  </div>
                  {renderPagination(currentPageMurajaah, riwayatMurajaahList.length, setCurrentPageMurajaah)}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
