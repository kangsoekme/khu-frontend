import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { FaCalendarCheck } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useGetStudentQuery } from "../../../store/api/studentsApi";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useMediaQuery } from "@/hooks/use-media-query";
import ChartPerkembangan from "../../../components/tahsin-tahfidz/ChartPerkembangan";
import {
  useGetRiwayatHafalanQuery,
  useGetRiwayatMurajaahQuery,
} from "../../../store/api/tahfidzApi";
import TahfidzAssessmentForm from "../../../components/tahsin-tahfidz/tahfidz/TahfidzAssessmentForm";
import MurajaahAssessmentForm from "../../../components/tahsin-tahfidz/tahfidz/MurajaahAssessmentForm";

import { BASE_API_URL } from "../../../store/baseApi";
import { toast } from "sonner";
import { FaDownload } from "react-icons/fa";

import { MobileHistoryCard } from "../../../components/ui/MobileHistoryCard";

function TahfidzStudentDetail() {
  const { nis } = useParams();
  const currentRole = sessionStorage.getItem("role");

  const [openHafalan, setOpenHafalan] = useState(false);
  const [openMurajaah, setOpenMurajaah] = useState(false);
  const [activeTab, setActiveTab] = useState("hafalan");

  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: studentRes, isLoading: isLoadingStudent } =
    useGetStudentQuery(nis);
  const { data: riwayatRes, isLoading: isLoadingRiwayat } =
    useGetRiwayatHafalanQuery(nis);
  const { data: murajaahRes, isLoading: isLoadingMurajaah } =
    useGetRiwayatMurajaahQuery(nis);

  if (isLoadingStudent || isLoadingRiwayat || isLoadingMurajaah) {
    return <p>Memuat profil dan riwayat siswa</p>;
  }

  const student = studentRes?.data;
  const riwayatList = riwayatRes?.data?.history?.hafalan_baru || [];
  const murajaahList = murajaahRes?.data?.history?.murajaah_baru || [];

  const chartData = [...(riwayatList || [])]
    .slice(0, 7)
    .reverse()
    .map((item, idx) => {
      const dateVal = item.timestamp || item.tanggal;
    const dateStr = dateVal
      ? new Date(dateVal).toLocaleDateString("id-ID", {
          day: "2-digit",
          month: "short",
        })
      : `P-${idx + 1}`;
    return {
      date: dateStr,
      ayat:
        Number(item.ayat_akhir) || Number(item.jumlah_ayat) || (idx + 1) * 5,
    };
  });

  const summary = riwayatRes?.data?.history?.summary;

  return (
    <div key={nis} className="flex flex-col gap-5">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-2 flex flex-col gap-5 h-full">
          <Card className="col-span-2 row-span-2">
            <CardContent className="flex items-center gap-5">
              <Avatar className="h-24 w-24">
                <AvatarImage src={student?.profile_photo} />
                <AvatarFallback className="text-3xl bg-blue-100 text-blue-700">
                  {student?.nama?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-2">
                <CardTitle className="font-bold text-2xl">
                  {student?.nama}
                </CardTitle>
                <CardDescription>
                  {student?.nis} | {student?.riwayatKelas?.[0]?.nama_kelas}
                </CardDescription>
                <Badge className=" px-4 py-3">
                  {student?.halaqoh_tahfidz?.nama || "Belum ada kelompok"}
                </Badge>
              </div>
            </CardContent>
          </Card>
          <div className="flex flex-col gap-3">
            {currentRole === "GURU" && (
              <div className="flex gap-3">
                <Button
                  onClick={() => setOpenHafalan(true)}
                  className="flex-1 h-12 flex "
                >
                  <FaCalendarCheck className="text-2xl" /> Tambah Penilaian
                </Button>
                <Button
                  onClick={() => setOpenMurajaah(true)}
                  className="flex-1 h-12 flex "
                >
                  <FaCalendarCheck className="text-2xl" /> Tambah Murajaah
                </Button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-5 flex-1">
            <Card className="row-span-3">
              <CardContent className="flex flex-col justify-between h-full">
                <div className="flex justify-end">
                  <div className="p-4 w-fit rounded-xl bg-primary-600">
                    <FaCalendarCheck className="text-neutral-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-4xl font-bold">
                    {summary?.total_hafalan || 0}
                  </CardTitle>
                  <CardDescription>TOTAL HAFALAN</CardDescription>
                </div>
              </CardContent>
            </Card>
            <Card className="row-span-3">
              <CardContent className="flex flex-col justify-between h-full">
                <div className="flex justify-end">
                  <div className="p-4 w-fit rounded-xl bg-primary-600">
                    <FaCalendarCheck className="text-neutral-white" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <CardTitle className="text-4xl font-bold">
                    {summary?.rata_rata_kelancaran || "-"}
                  </CardTitle>
                  <CardDescription>RATA RATA NILAI</CardDescription>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="xl:col-span-3 w-full h-full min-h-100">
          <ChartPerkembangan
            className="h-full"
            data={chartData}
            title="Grafik Hafalan Tahfidz"
            desc="Pergerakan jumlah ayat akhir yang dihafalkan siswa"
            dataKey="ayat"
            label="Capai Ayat Akhir"
          />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Detail Riwayat Tahfidz</CardTitle>
        </CardHeader>
        <CardContent>
          {/* hafalanbaru */}

          <Tabs defaultValue="hafalan" className="w-full py-5">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="hafalan">Riwayat Hafalan</TabsTrigger>
              <TabsTrigger value="murajaah">Riwayat Murajaah</TabsTrigger>
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
                  {riwayatList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-5">
                        Belum ada riwayat setoran tahsin
                      </TableCell>
                    </TableRow>
                  ) : (
                    riwayatList.map((riwayat) => (
                      <TableRow>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold uppercase">
                              {new Date(riwayat.timestamp).toLocaleDateString(
                                "id-ID",
                                { weekday: "long" },
                              )}
                            </span>
                            <span className="text-neutral-textmuted">
                              {new Date(riwayat.timestamp).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {riwayat.surah?.nama_surah || "-"}
                            </span>
                            <span className="text-neutral-textmuted">
                              {riwayat.ayat_awal || "-"} -{" "}
                              {riwayat.ayat_akhir || "-"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="font-bold text-lg">
                          {riwayat.nilai_bacaan || "0"}
                        </TableCell>
                        <TableCell className="font-bold text-lg">
                          {riwayat.nilai_hafalan || "0"}
                        </TableCell>
                        <TableCell className="">
                          <Badge className="text">{riwayat.predikat}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              <div className="flex flex-col lg:hidden mt-4 gap-6">
                {riwayatList.length === 0 ? (
                  <p className="text-center text-sm text-neutral-400">
                    Belum ada riwayat setoran
                  </p>
                ) : (
                  riwayatList.map((riwayat, index) => (
                    <MobileHistoryCard
                      key={index}
                      day={new Date(riwayat.timestamp).toLocaleDateString(
                        "id-ID",
                        {
                          weekday: "long",
                        },
                      )}
                      date={new Date(riwayat.timestamp).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        },
                      )}
                      titleInformation1={"Hafalan Baru"}
                      title1={riwayat.surah?.nama_surah || "-"}
                      subtitle1={`Ayat: ${riwayat.ayat_awal || "-"} - ${riwayat.ayat_akhir || "-"}`}
                      score1={{
                        label: "Bacaan",
                        value: riwayat.nilai_bacaan || "0",
                      }}
                      score2={{
                        label: "Hafalan",
                        value: riwayat.nilai_hafalan || "0",
                      }}
                      badgeText={riwayat.predikat}
                    />
                  ))
                )}
              </div>
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
                  {murajaahList.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-5">
                        Belum ada murajaah setoran tahsin
                      </TableCell>
                    </TableRow>
                  ) : (
                    murajaahList.map((murajaah) => (
                      <TableRow>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-semibold uppercase">
                              {new Date(murajaah.timestamp).toLocaleDateString(
                                "id-ID",
                                { weekday: "long" },
                              )}
                            </span>
                            <span className="text-neutral-textmuted">
                              {new Date(murajaah.timestamp).toLocaleDateString(
                                "id-ID",
                                {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                },
                              )}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">
                              {murajaah.surah?.nama_surah || "-"}
                            </span>
                            <span className="text-neutral-textmuted">
                              {murajaah.ayat_awal || "-"} -{" "}
                              {murajaah.ayat_akhir || "-"}
                            </span>
                          </div>
                        </TableCell>

                        <TableCell className="font-bold text-lg">
                          {murajaah.nilai_bacaan || "0"}
                        </TableCell>
                        <TableCell className="font-bold text-lg">
                          {murajaah.nilai_hafalan || "0"}
                        </TableCell>
                        <TableCell className="">
                          <Badge className="text">{murajaah.predikat}</Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
              <div className="flex flex-col lg:hidden mt-4">
                {murajaahList.length === 0 ? (
                  <p className="text-center text-sm text-neutral-400">
                    Belum ada murajaah setoran
                  </p>
                ) : (
                  murajaahList.map((murajaah, index) => (
                    <MobileHistoryCard
                      key={index}
                      day={new Date(murajaah.timestamp).toLocaleDateString(
                        "id-ID",
                        { weekday: "long" },
                      )}
                      date={new Date(murajaah.timestamp).toLocaleDateString(
                        "id-ID",
                        { day: "numeric", month: "long", year: "numeric" },
                      )}
                      titleInformation1={"Murajaah Baru"}
                      title1={murajaah.surah?.nama_surah || "-"}
                      subtitle1={`Ayat: ${murajaah.ayat_awal || "-"} - ${murajaah.ayat_akhir || "-"}`}
                      score1={{
                        label: "Bacaan",
                        value: murajaah.nilai_bacaan || "0",
                      }}
                      score2={{
                        label: "Hafalan",
                        value: murajaah.nilai_hafalan || "0",
                      }}
                      badgeText={murajaah.predikat}
                    />
                  ))
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {isDesktop ? (
        <Dialog open={openHafalan} onOpenChange={setOpenHafalan}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Setoran Hafalan</DialogTitle>
            </DialogHeader>
            <div>
              <TahfidzAssessmentForm
                nis={nis}
                halaqohId={student?.halaqoh_tahfidz?.id}
                lastRiwayat={riwayatList[0]}
                onSuccess={() => setOpenHafalan(false)}
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={openHafalan} onOpenChange={setOpenHafalan}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Tambah Setorah Hafalan</DrawerTitle>
            </DrawerHeader>
            <TahfidzAssessmentForm
              nis={nis}
              halaqohId={student?.halaqoh_tahfidz?.id}
              lastRiwayat={riwayatList[0]}
              onSuccess={() => setOpenHafalan(false)}
            />
          </DrawerContent>
        </Drawer>
      )}

      {isDesktop ? (
        <Dialog open={openMurajaah} onOpenChange={setOpenMurajaah}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Setoran Murajaah</DialogTitle>
            </DialogHeader>
            <MurajaahAssessmentForm
              nis={nis}
              halaqohId={student?.halaqoh_tahfidz?.id}
              lastRiwayat={murajaahList[0]}
              onSuccess={() => setOpenMurajaah(false)}
            />
          </DialogContent>
        </Dialog>
      ) : (
        <Drawer open={openMurajaah} onOpenChange={setOpenMurajaah}>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Tambah Setorah Murajaah</DrawerTitle>
            </DrawerHeader>
            <MurajaahAssessmentForm
              nis={nis}
              halaqohId={student?.halaqoh_tahfidz?.id}
              lastRiwayat={murajaahList[0]}
              onSuccess={() => setOpenMurajaah(false)}
            />
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}

export default TahfidzStudentDetail;
