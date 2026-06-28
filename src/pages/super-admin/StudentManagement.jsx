import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentTableContainer from "../../components/student-table/StudentTableContainer";

import { studentsDummy } from "../../utils/dummies/studentsDummy";

function StudentManagement() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex w-full gap-5">
        <Tabs defaultValue="semua">
          <TabsList>
            <TabsTrigger value="semua">Semua</TabsTrigger>
            <TabsTrigger value="Kelas">Kelas</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <StudentTableContainer students={studentsDummy} />
    </div>
  );
}

export default StudentManagement;
