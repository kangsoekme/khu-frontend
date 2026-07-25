import React, { useState } from "react";
import { useGetStudentsQuery } from "../../store/api/studentsApi";
import {
  useGetAllHalaqohQuery,
  useDeleteHalaqohMutation,
} from "../../store/api/halaqohApi";
import HalaqohForm from "../../components/halaqoh/HalaqohForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Badge } from "@/components/ui/badge";

function HalaqohManagement() {
  const { data: studentObj, isLoading: isStudentLoading } =
    useGetStudentsQuery();
  const { data: halaqohObj, isLoading: isHalaqohLoading } =
    useGetAllHalaqohQuery();
  const [deleteHalaqoh] = useDeleteHalaqohMutation();

  const [openForm, setOpenForm] = useState(false);
  const [selectedHalaqoh, setSelectedHalaqoh] = useState(null);

  const [activeTab, setActiveTab] = useState("TAHSIN");

  if (isStudentLoading || isHalaqohLoading) return <p>Memuat data..</p>;

  const allStudents = studentObj?.data || [];
  const allHalaqoh = halaqohObj?.data || [];

  const waitingStudent = allStudents.filter((student) => {
    if (activeTab === "TAHSIN") {
      return (
        student.tahapan_tahsin !== null && student.halaqoh_tahsin_id === null
      );
    } else {
      return student.halaqoh_tahfidz_id === null;
    }
  });

  const groupedStudents = waitingStudent.reduce((acc, student) => {
    const key =
      activeTab === "TAHSIN"
        ? student.tahapan_tahsin
        : student.riwayatKelas?.[0]?.nama_kelas || "Belum ada kelas";

    if (!acc[key]) acc[key] = [];
    acc[key].push(student);
    return acc;
  }, {});

  const handleAddClick = () => {
    setSelectedHalaqoh(null);
    setOpenForm(true);
  };

  const handleEditClick = (halaqoh) => {
    setSelectedHalaqoh(halaqoh);
    setOpenForm(true);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-end gap-5">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          defaultValue="TAHSIN"
          className="p-0-"
        >
          <TabsList>
            <TabsTrigger value="TAHSIN">Tahsin Qiraah</TabsTrigger>
            <TabsTrigger value="TAHFIDZ">Tahfidz Quran</TabsTrigger>
          </TabsList>
        </Tabs>
        <Button onClick={handleAddClick}>
          <FaPlus className="mr-2" /> Buat Halaqoh
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        {/* daftar siswa belum ada halaqoh */}
        <Card className="mx-auto w-full ">
          <CardHeader>
            <CardTitle className="text-lg font-medium">
              Daftar siswa belum memiliki halaqoh
            </CardTitle>
          </CardHeader>
          <CardContent className=" flex flex-col gap-3">
            {Object.keys(groupedStudents).length === 0 ? (
              <p className="text-center py-4 text-neutral-textmuted">
                Semua siswa sudah memiliki halaqoh
              </p>
            ) : (
              Object.keys(groupedStudents).map((jilid) => (
                <div className="flex flex-col gap-5" key={jilid}>
                  <h3 className="font-bold">
                    {jilid} ({groupedStudents[jilid].length} Siswa)
                  </h3>
                  {groupedStudents[jilid].map((siswa) => (
                    <Item key={siswa.nis} variant="outline-">
                      <ItemContent>
                        <ItemTitle>{siswa.nama}</ItemTitle>
                        <ItemDescription>
                          {siswa.nis} |{" "}
                          {siswa.riwayatKelas?.[0]?.nama_kelas || "-"}
                        </ItemDescription>
                      </ItemContent>
                    </Item>
                  ))}
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="mx-auto w-full">
          <CardHeader>
            <CardTitle className="font-medium text-lg">
              Daftar Halaqoh Aktif
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {allHalaqoh.map((halaqoh) => (
              <Item
                key={halaqoh.id}
                onClick={() => handleEditClick(halaqoh)}
                variant="outline"
              >
                <ItemContent className="w-full">
                  <div className="flex justify-between items-start w-full">
                    <div className="">
                      <ItemTitle>{halaqoh.nama_halaqoh}</ItemTitle>
                      <ItemDescription>
                        {halaqoh.guru?.nama} | {halaqoh.siswa?.length || 0}{" "}
                        Siswa
                      </ItemDescription>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant={
                          halaqoh.kategori === "TAHSIN"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {halaqoh.kategori}
                      </Badge>
                    </div>
                  </div>
                </ItemContent>
              </Item>
            ))}
          </CardContent>
        </Card>

        <Dialog open={openForm} onOpenChange={setOpenForm}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {selectedHalaqoh ? "Edit Halaqoh" : "Buat Halaqoh Baru"}
              </DialogTitle>
            </DialogHeader>

            <HalaqohForm
              initialData={selectedHalaqoh}
              studentsList={waitingStudent}
              onSuccess={() => setOpenForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}

export default HalaqohManagement;
