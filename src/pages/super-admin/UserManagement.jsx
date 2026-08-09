import { toast } from "sonner";
import { useDeleteBulkUsersMutation } from "../../store/api/usersApi.js";

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Button } from "@/components/ui/button";

import UserTableContainer from "../../components/user-table/UserTableContainer";
import { SearchInput } from "../../components/ui/SearchInput.jsx";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

// BUG-04 fix: import AlertDialog family — sebelumnya dipakai di JSX (baris 140+)
// tapi tidak di-import, menyebabkan crash "Element type is invalid" saat
// bulk-select mengisi selectedUsers (selectedUsers.length > 0).
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import UserForm from "../../components/student-user/UserForm.jsx";

import { FaPlus } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";

import { useGetUsersQuery } from "../../store/api/usersApi.js";

function UserManagement() {
  const [activeRole, setactiveRole] = useState("semua");
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [selectedUsers, setSelectedUsers] = useState([]);
  const [deleteBulk, { isLoading: isDeletingBulk }] =
    useDeleteBulkUsersMutation();

  const {
    data: usersData,
    isLoading,
    isError,
  } = useGetUsersQuery({
    page: currentPage,
    limit: 7,
    search,
    // FE-1: kirim role ke server agar filter berfungsi bersama pagination
    role: activeRole === "semua" ? "" : activeRole,
  });

  const users = usersData?.data || [];
  const totalPages = usersData?.meta?.totalPages || 1;

  // FE-1: filter kini dilakukan di server, jadi tidak perlu filter client-side
  const filteredUser = users;

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Gagal mengambil data dari server
      </div>
    );
  }

  const roleFilter = activeRole === "semua" ? "" : activeRole;

  // Query untuk mendapatkan seluruh daftar ID user sesuai filter role & search (tanpa batas halaman)
  const { data: allUsersData } = useGetUsersQuery({
    limit: 10000,
    search,
    role: roleFilter,
  });
  const allMatchingUserIds = (allUsersData?.data || []).map((u) => u.id);
  const totalMatchingCount = usersData?.meta?.totalData || allMatchingUserIds.length;

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(allMatchingUserIds);
    } else {
      setSelectedUsers([]);
    }
  };
  const handleSelectRow = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };
  const handleBulkDelete = async () => {
    try {
      await deleteBulk(selectedUsers).unwrap();
      toast.success(`${selectedUsers.length} user berhasil dihapus`);
      setSelectedUsers([]); // reset setelah berhasil
    } catch (error) {
      toast.error(error.data?.message || "Gagal menghapus user");
    }
  };

  return (
    <>
      <div className="flex flex-col gap-5 animate-in fade-in duration-500">
        <div className="flex w-full gap-5">
          <SearchInput
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari nama / email / no. telp..."
          />

          {selectedUsers.length > 0 && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="destructive"
                  disabled={isDeletingBulk}
                >
                  {isDeletingBulk
                    ? "Menghapus..."
                    : `Hapus (${selectedUsers.length})`}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Konfirmasi Hapus Massal</AlertDialogTitle>
                  <AlertDialogDescription>
                    Apakah Anda yakin ingin menghapus {selectedUsers.length} data user terpilih? Tindakan ini tidak dapat dibatalkan.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batal</AlertDialogCancel>
                  <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700 text-white">
                    Ya, Hapus Data
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <Button onClick={() => setOpen(true)}>
            <span className="hidden xl:block">Tambah User</span>
            <FaPlus className="xl:hidden" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <FaFilter />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={activeRole}
                onValueChange={(value) => {
                  setactiveRole(value);
                  setCurrentPage(1); // FE-1: reset ke halaman 1 saat ganti filter role
                }}
              >
                <DropdownMenuRadioItem value="semua">
                  Semua
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="SUPER_ADMIN">
                  Super Admin
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="DIREKTUR">
                  Direktur
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="GURU">Guru</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {isLoading ? (
          <p className="text-center py-10 text-neutral-500">Memuat data user...</p>
        ) : isError ? (
          <p className="text-center py-10 text-red-500">Gagal memuat data. Silakan coba lagi nanti.</p>
        ) : (
          <UserTableContainer
            users={filteredUser}
            onRowClick={handleRowClick}
            selectedUsers={selectedUsers}
            onSelectAll={handleSelectAll}
            onSelectRow={handleSelectRow}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
            totalMatchingCount={totalMatchingCount}
          />
        )}

        {/* add user */}
        {isDesktop && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-130 max-h-[90vh] flex flex-col overflow-hidden">
              <DialogHeader className="shrink-0">
                <DialogTitle>Tambah User</DialogTitle>
                <DialogDescription>
                  Tambah data user untuk kebutuhan komputasi
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-hidden flex flex-col">
                <UserForm onSuccess={() => setOpen(false)} />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {!isDesktop && (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent className="max-h-[90vh] flex flex-col">
              <DrawerHeader className="text-left shrink-0">
                <DrawerTitle>Tambah User</DrawerTitle>
                <DrawerDescription>
                  Tambah data user untuk kebutuhan komputasi
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 flex-1 overflow-hidden flex flex-col pb-3">
                <UserForm onSuccess={() => setOpen(false)} />
              </div>
            </DrawerContent>
          </Drawer>
        )}

        {/* edit user */}
        {isDesktop && (
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-130 max-h-[90vh] flex flex-col overflow-hidden">
              <DialogHeader className="shrink-0">
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Tambah data user untuk kebutuhan komputasi
                </DialogDescription>
              </DialogHeader>
              <div className="flex-1 overflow-hidden flex flex-col">
                <UserForm
                  isEdit={true}
                  initialData={selectedUser}
                  onSuccess={() => setOpenEdit(false)}
                />
              </div>
            </DialogContent>
          </Dialog>
        )}

        {!isDesktop && (
          <Drawer open={openEdit} onOpenChange={setOpenEdit}>
            <DrawerContent className="max-h-[90vh] flex flex-col">
              <DrawerHeader className="text-left shrink-0">
                <DrawerTitle>Edit User</DrawerTitle>
                <DrawerDescription>
                  Tambah data user untuk kebutuhan komputasi
                </DrawerDescription>
              </DrawerHeader>
              <div className="px-4 flex-1 overflow-hidden flex flex-col pb-3">
                <UserForm
                  initialData={selectedUser}
                  isEdit={true}
                  onSuccess={() => setOpenEdit(false)}
                />
              </div>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </>
  );
}

export default UserManagement;
