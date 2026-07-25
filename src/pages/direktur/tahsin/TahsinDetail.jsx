import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetHalaqohQuery } from "../../../store/api/halaqohApi";

import { Button } from "@/components/ui/button";
import { FaArrowLeft } from "react-icons/fa";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MobileItemCard from "../../../components/ui/MobileItemCard";

import { exportToExcel } from "../../../utils/exportExcel";

function TahsinDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { data: responseData, isLoading } = useGetHalaqohQuery(id);

  if (isLoading) return <p>Memuat data Halaqoh...</p>;

  const halaqoh = responseData?.data;

  return (
    <div className="flex flex-col gap-5">
      <Table className="hidden lg:table">
        <TableHeader className="bg-neutral-surface">
          <TableRow>
            <TableHead className="w-75">Siswa</TableHead>
            <TableHead className="">Kelas</TableHead>
            <TableHead className="">Posisi Bacaan</TableHead>
            <TableHead className="">Nilai</TableHead>
            <TableHead className="">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {halaqoh?.siswa?.length === 0 ? (
            <TableCell colSpan={5}>Belum ada siswa disini</TableCell>
          ) : (
            halaqoh?.siswa?.map((siswa) => (
              <TableRow
                key={siswa.nis}
                onClick={() => navigate(`/tahsin/${id}/${siswa.nis}`)}
              >
                <TableCell>
                  <Item>
                    <ItemMedia>
                      <Avatar>
                        <AvatarImage src={siswa.avatar} className="grayscale" />
                        <AvatarFallback>{siswa.nama.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </ItemMedia>
                    <ItemContent>
                      <ItemTitle>{siswa.nama}</ItemTitle>
                      <ItemDescription>{siswa.nis}</ItemDescription>
                    </ItemContent>
                  </Item>
                </TableCell>
                <TableCell>{siswa.riwayatKelas?.[0]?.nama_kelas}</TableCell>
                <TableCell>Belum Memulai</TableCell>
                <TableCell>A+</TableCell>
                <TableCell>LANJUT</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-2 lg:hidden">
        {halaqoh?.siswa?.length === 0 ? (
          <p className="text-center text-sm text-neutral-400">
            Belum ada siswa disini
          </p>
        ) : (
          halaqoh?.siswa?.map((siswa) => (
            <MobileItemCard
              key={siswa.nis}
              avatar={siswa.avatar}
              title={siswa.nama}
              subtitle={
                <>
                  <span className="font-semibold mr-1">Kelas:</span>
                  {siswa?.riwayatKelas?.[0]?.nama_kelas || "-"}
                </>
              }
              statusText="Belum Mulai"
              badgeText="A+"
              onClick={() =>
                navigate(`/direktur/tahsin/${siswa.id || siswa.nis}`)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TahsinDetail;
