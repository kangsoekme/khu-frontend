import React, { use } from "react";
import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

import UserTableContainer from "../../components/user-table/UserTableContainer";
import { SearchInput } from "../../components/ui/SearchInput.jsx";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";

import { ScrollArea } from "@/components/ui/scroll-area";

import UserForm from "../../components/student-user/UserForm.jsx";

import { FaPlus } from "react-icons/fa6";
import { FaFilter } from "react-icons/fa";
import { ChevronDownIcon } from "lucide-react";

import { useGetUsersQuery } from "../../store/api/usersApi.js";

function UserManagement() {
  const [activeRole, setactiveRole] = useState("semua");
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: usersData, isLoading, isError } = useGetUsersQuery();

  const users = usersData?.data || [];

  const filteredUser =
    activeRole === "semua"
      ? users
      : users.filter((user) => user.role === activeRole);

  if (isLoading) {
    return <div className="p-10 text-center">Sedang mengambil data users</div>;
  }

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

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex w-full gap-5">
          <SearchInput />
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
        <UserTableContainer users={filteredUser} onRowClick={handleRowClick} />

        {/* add user */}
        {isDesktop && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger
              render={<Button variant="outline">Edit Profile</Button>}
            />
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
            <DrawerTrigger
              render={<Button variant="outline">Edit Profile</Button>}
            />
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Tambah User</DrawerTitle>
                <DrawerDescription>
                  Tambah data user untuk kebutuhan komputasi
                </DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="h-100">
                <UserForm className="p-4" onSuccess={() => setOpen(false)} />
              </ScrollArea>
            </DrawerContent>
          </Drawer>
        )}

        {/* edit user */}
        {isDesktop && (
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger
              render={<Button variant="outline">Edit Profile</Button>}
            />
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
            <DrawerTrigger
              render={<Button variant="outline">Edit Profile</Button>}
            />
            <DrawerContent>
              <DrawerHeader className="text-left">
                <DrawerTitle>Edit User</DrawerTitle>
                <DrawerDescription>
                  Tambah data user untuk kebutuhan komputasi
                </DrawerDescription>
              </DrawerHeader>
              <ScrollArea className="h-100">
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
