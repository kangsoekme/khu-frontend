import { useState } from "react";
import { SearchInput } from "../../../components/ui/SearchInput";

import { useNavigate, useParams } from "react-router-dom";
import { useGetHalaqohQuery } from "../../../store/api/halaqohApi";
import { formatEnum } from "../../../utils/formatEnum";
import {
  getNilaiTahsin,
  getPosisiBacaan,
  getTahapAktif,
} from "../../../utils/tahsinProgress";

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
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import MobileItemCard from "../../../components/ui/MobileItemCard";

function TahsinDetail() {
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

  // Posisi bacaan, tahapan aktif & nilai memakai util bersama tahsinProgress
  // (menangani setoran surah/Tilawah + record placement pretest is_placement).
  const renderSiswa = (siswa) => {
    const { text: posisi } = getPosisiBacaan(siswa);
    const nilai = getNilaiTahsin(siswa);
    const statusTahap = formatEnum(getTahapAktif(siswa) || "BELUM MULAI");
    return { posisi, nilai, statusTahap };
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full gap-5">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari siswa di kelas Tahsin ini..."
        />
      </div>

      <Table className="hidden lg:table">
        <TableHeader className="bg-neutral-surface">
          <TableRow>
            <TableHead className="w-75">Siswa</TableHead>
            <TableHead className="">Kelas</TableHead>
            <TableHead className="">Posisi Bacaan</TableHead>
            <TableHead className="">Nilai</TableHead>
            <TableHead className="">Tahap / Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredSiswa.length === 0 ? (
            <TableCell colSpan={5}>Belum ada siswa disini</TableCell>
          ) : (
            filteredSiswa.map((siswa) => {
              const { posisi, nilai, statusTahap } = renderSiswa(siswa);

              return (
                <TableRow
                  key={siswa.nis}
                  onClick={() => navigate(`/tahsin/${id}/${siswa.nis}`)}
                >
                  <TableCell>
                    <Item>
                      <ItemMedia>
                        <Avatar>
                          <AvatarImage
                            src={siswa.avatar}
                            className="grayscale"
                          />
                          <AvatarFallback>
                            {siswa.nama?.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle>{siswa.nama}</ItemTitle>
                        <ItemDescription>{siswa.nis}</ItemDescription>
                      </ItemContent>
                    </Item>
                  </TableCell>
                  <TableCell>
                    {siswa.riwayatKelas?.[0]?.nama_kelas || "-"}
                  </TableCell>
                  <TableCell>{posisi}</TableCell>
                  <TableCell className="font-semibold">{nilai}</TableCell>
                  <TableCell className="font-medium text-primary-600">
                    {statusTahap}
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="flex flex-col gap-2 lg:hidden">
        {filteredSiswa.length === 0 ? (
          <p className="text-center text-sm text-neutral-400">
            Belum ada siswa disini
          </p>
        ) : (
          filteredSiswa.map((siswa) => {
            const { posisi, statusTahap } = renderSiswa(siswa);

            return (
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
                statusText={`${statusTahap} | ${posisi}`}
                onClick={() => navigate(`/tahsin/${id}/${siswa.nis}`)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default TahsinDetail;
