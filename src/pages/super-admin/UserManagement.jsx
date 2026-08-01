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
  } = useGetUsersQuery({ page: currentPage, limit: 7, search });

  const users = usersData?.data || [];
  const totalPages = usersData?.meta?.totalPages || 1;

  const roleFiltered =
    activeRole === "semua"
      ? users
      : users.filter((user) => user.role === activeRole);

  const filteredUser = roleFiltered;

  if (isError) {
    return (
      <div className="p-10 text-center text-red-500">
        Gagal mengambil data dari server
      </div>
    );
  }

  const handleRowClick = (user) => {
    setSelectedUser(user);
    setOpenEdit(true);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(filteredUser.map((u) => u.id));
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
            <Button
              variant="destructive"
              onClick={handleBulkDelete}
              disabled={isDeletingBulk}
            >
              {isDeletingBulk
                ? "Menghapus..."
                : `Hapus (${selectedUsers.length})`}
            </Button>
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
                onValueChange={(value) => setactiveRole(value)}
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
          />
        )}

        {/* add user */}
        {isDesktop && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-130">
              <DialogHeader>
                <DialogTitle>Tambah User</DialogTitle>
                <DialogDescription>
                  Tambah data user untuk kebutuhan komputasi
                </DialogDescription>
              </DialogHeader>
              <UserForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        )}

        {!isDesktop && (
          <Drawer open={open} onOpenChange={setOpen}>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Tambah User</DrawerTitle>
                <DrawerDescription>
                  Tambah data user untuk kebutuhan komputasi
                </DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="flex-1 overflow-y-auto">
                <UserForm className="p-4" onSuccess={() => setOpen(false)} />
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        )}

        {/* edit user */}
        {isDesktop && (
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogContent className="sm:max-w-130">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
                <DialogDescription>
                  Tambah data user untuk kebutuhan komputasi
                </DialogDescription>
              </DialogHeader>
              <UserForm
                isEdit={true}
                initialData={selectedUser}
                onSuccess={() => setOpenEdit(false)}
              />
            </DialogContent>
          </Dialog>
        )}

        {!isDesktop && (
          <Drawer open={openEdit} onOpenChange={setOpenEdit}>
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Edit User</DrawerTitle>
                <DrawerDescription>
                  Tambah data user untuk kebutuhan komputasi
                </DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="flex-1 overflow-y-auto">
                <UserForm
                  className="p-4"
                  initialData={selectedUser}
                  isEdit={true}
                  onSuccess={() => setOpenEdit(false)}
                />
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        )}
      </div>
    </>
  );
}

export default UserManagement;
