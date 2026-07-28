import React, { useState } from "react";
import { SearchInput } from "../../../components/ui/SearchInput";

import { Link, useNavigate, useParams } from "react-router-dom";
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

function TahfidzDetail() {
  const [search, setSearch] = useState("");
  const { id } = useParams();

  const navigate = useNavigate();

  const { data: responseData, isLoading } = useGetHalaqohQuery(id);

  if (isLoading) return <p>Memuat data Halaqoh...</p>;

  const halaqoh = responseData?.data;

  const siswaList = halaqoh?.siswa || [];
  const filteredSiswa = siswaList.filter((s) => {
    const keyword = search.toLowerCase();
    return (
      s.nama?.toLowerCase().includes(keyword) ||
      s.nis?.toLowerCase().includes(keyword)
    );
  });

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full gap-5">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari siswa di kelas Tahfidz ini..."
        />
      </div>

      <Table className="hidden lg:table">
        <TableHeader className="bg-neutral-surface">
          <TableRow>
            <TableHead className="w-75">Siswa</TableHead>
            <TableHead className="">Kelas</TableHead>
            <TableHead className="">Posisi Hafalan</TableHead>
            <TableHead className="">Kategori</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSiswa.length === 0 ? (
            <TableCell colSpan={5}>Belum ada siswa disini</TableCell>
          ) : (
            filteredSiswa.map((siswa) => (
              <TableRow
                key={siswa.nis}
                onClick={() => navigate(`/tahfidz/${id}/${siswa.nis}`)}
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
                <TableCell>
                  {siswa?.setoranHafalan?.[0]
                    ? `${siswa.setoranHafalan[0].surah?.nama_surah || "Surah " + siswa.setoranHafalan[0].no_surah} (${siswa.setoranHafalan[0].ayat_awal}-${siswa.setoranHafalan[0].ayat_akhir})`
                    : "Belum Memulai"}
                </TableCell>
                <TableCell>
                  {siswa?.setoranHafalan?.[0]?.predikat || "-"}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-3 lg:hidden">
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
              statusText={
                siswa?.setoranHafalan?.[0]
                  ? `${siswa.setoranHafalan[0].surah?.nama_surah || "Surah " + siswa.setoranHafalan[0].no_surah} (${siswa.setoranHafalan[0].ayat_awal}-${siswa.setoranHafalan[0].ayat_akhir})`
                  : "Belum Memulai"
              }
              badgeText={siswa?.setoranHafalan?.[0]?.predikat || "-"}
              onClick={() =>
                navigate(`/direktur/tahfidz/${siswa.id || siswa.nis}`)
              }
            />
          ))
        )}
      </div>
    </div>
  );
}

export default TahfidzDetail;
