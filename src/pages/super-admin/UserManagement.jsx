import React, { use } from "react";
import { useState } from "react";

import { usersDummy } from "../../utils/dummies/usersDummy.js";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";

import UserTableContainer from "../../components/user-table/UserTableContainer";

function UserManagement() {
  const [activeRole, setactiveRole] = useState("semua");

  const filteredUser =
    activeRole === "semua"
      ? usersDummy
      : usersDummy.filter((user) => user.role === activeRole);

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="flex w-full gap-5 ">
          <Tabs
            defaultValue="semua"
            onValueChange={(value) => setactiveRole(value)}
            className=""
          >
            <TabsList className="">
              <TabsTrigger value="semua" className="">
                Semua
              </TabsTrigger>
              <TabsTrigger value="super_admin">Super Admin</TabsTrigger>
              <TabsTrigger value="direktur">Direktur</TabsTrigger>
              <TabsTrigger value="muhassin">Muhassin</TabsTrigger>
              <TabsTrigger value="muhaffidz">Muhaffidz</TabsTrigger>
            </TabsList>
          </Tabs>
          <Button>Tambah</Button>
        </div>
        <UserTableContainer users={filteredUser} />
      </div>
    </>
  );
}

export default UserManagement;
