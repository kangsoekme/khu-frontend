import React, { use } from "react";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Checkbox } from "@/components/ui/checkbox";

import UserTableItem from "./UserTableItem";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import UserMobileCardItem from "./UserMobileCardItem";

const ITEMS_PER_PAGE = 7;

function UserTableContainer({
  users,
  onRowClick,
  selectedUsers = [],
  onSelectAll,
  onSelectRow,
  currentPage,
  totalPages,
  onPageChange,
}) {
  const paginatedUsers = users;

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) onPageChange(page);
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
            <TableRow className="">
              <TableHead className="w-12">
                <Checkbox
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
                  onCheckedChange={onSelectAll}
                />
              </TableHead>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((user) => {
              return (
                <UserTableItem
                  key={user.id}
                  profilePhoto={user.profile_photo}
                  name={user.nama}
                  email={user.email}
                  noTelp={user.no_telp}
                  role={user.role}
                  isSelected={selectedUsers.includes(user.id)}
                  onToggleSelect={() => onSelectRow(user.id)}
                  onClick={() => onRowClick(user)}
                />
              );
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col gap-4 xl:hidden mb-4">
        {selectedUsers.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 bg-neutral-800 text-white rounded-lg shadow-md">
            <span className="text-sm font-semibold">{selectedUsers.length} Terpilih</span>
            <button 
              onClick={() => onSelectAll(selectedUsers.length !== users.length)} 
              className="text-sm font-medium underline underline-offset-2 hover:text-blue-300"
            >
              {selectedUsers.length === users.length ? "Batal Semua" : "Pilih Semua"}
            </button>
          </div>
        )}

        {paginatedUsers.map((user) => (
          <UserMobileCardItem
            key={user.id}
            profilePhoto={user.profile_photo}
            name={user.nama}
            email={user.email}
            noTelp={user.no_telp}
            role={user.role}
            onClick={() => onRowClick(user)}
            isSelected={selectedUsers.includes(user.id)}
            isSelectionMode={selectedUsers.length > 0}
            onToggleSelect={() => onSelectRow(user.id)}
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
              <PaginationItem key={`ellipsis-${index}`}>
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
                  ? "pointer-event-none opacity-50"
                  : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}

export default UserTableContainer;
