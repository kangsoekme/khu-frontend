import React from "react";

import {
  Table,
  TableBody,
  TableCell,
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

import PretestTableItem from "../pretest/PretestTableItem";
import PretestMobileCardItem from "../pretest/PretestMobileCardItem";

const ITEMS_PER_PAGE = 7;

function UjianTableContainer({ dataPengajuan, onRowClick }) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(dataPengajuan.length / ITEMS_PER_PAGE);

  const paginatedStudents = dataPengajuan.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 3) return [1, 2, 3, 4, "...", totalPages];
    if (currentPage >= totalPages - 2) {
      return [
        1,
        "...",
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }
    return [
      1,
      "...",
      currentPage - 1,
      currentPage,
      currentPage + 1,
      "...",
      totalPages,
    ];
  };

  return (
    <div className="w-full">
      <div className="hidden xl:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableCell>Siswa</TableCell>
              <TableCell>Kelas</TableCell>
              <TableCell>Target Jilid</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((pengajuan) => (
              <PretestTableItem
                key={pengajuan.id}
                profilePhoto={pengajuan.siswa.profile_photo}
                name={pengajuan.siswa.nama}
                nis={pengajuan.siswa.nis}
                waliSiswa={pengajuan.guru.nama}
                kelas={pengajuan.siswa.riwayatKelas?.[0]?.nama_kelas || "-"}
                onClick={() => onRowClick(pengajuan.siswa)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 xl:hidden mb-4">
        {paginatedStudents.map((pengajuan, index) => (
          <PretestMobileCardItem
            key={index}
            key={pengajuan.id}
            profilePhoto={pengajuan.siswa.profile_photo}
            name={pengajuan.siswa.nama}
            nis={pengajuan.siswa.nis}
            waliSiswa={pengajuan.guru.nama}
            kelas={pengajuan.siswa.riwayatKelas?.[0]?.nama_kelas || "-"}
            onClick={() => onRowClick(pengajuan.siswa)}
          />
        ))}
      </div>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goToPage(currentPage - 1);
              }}
            />
          </PaginationItem>
          {getPageNumbers().map((page, index) =>
            page === "..." ? (
              <PaginationItem key={`elipsis-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            ) : (
              <PaginationItem key={page}>
                <PaginationLink
                  href="#"
                  isActive={page === currentPage}
                  onClick={(e) => {
                    e.preventDefault();
                    goToPage(page);
                  }}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ),
          )}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                goToPage(currentPage + 1);
              }}
              className={
                currentPage === totalPages
                  ? "pointer-events-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default UjianTableContainer;
