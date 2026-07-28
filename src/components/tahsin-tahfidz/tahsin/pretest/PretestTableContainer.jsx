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

import PretestTableItem from "./PretestTableItem";
import PretestMobileCardItem from "./PretestMobileCardItem";

const ITEMS_PER_PAGE = 7;

function PretestTableContainer({ students, onRowClick }) {
  const safeStudents = Array.isArray(students) ? students : [];

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(safeStudents.length / ITEMS_PER_PAGE) || 1;
  const paginatedStudents = safeStudents.slice(
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
              <TableCell>Jilid Tahsin</TableCell>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedStudents.map((student) => (
              <PretestTableItem
                profilePhoto={student.profile_photo}
                name={student.nama}
                nis={student.nis}
                waliSiswa={student.nama_wali}
                kelas={student.riwayatKelas?.[0]?.nama_kelas || "-"}
                tahapan={student.tahapan}
                onClick={() => onRowClick(student)}
              />
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 xl:hidden mb-4">
        {paginatedStudents.map((student, index) => (
          <PretestMobileCardItem
            key={index}
            profilePhoto={student.profile_photo}
            name={student.nama}
            nis={student.nis}
            alamat={student.alamat}
            kelas={student.riwayatKelas?.[0]?.nama_kelas || "-"}
            waliSiswa={student.nama_wali}
            tahapan={student.tahapan}
            onClick={() => onRowClick(student)}
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

export default PretestTableContainer;
