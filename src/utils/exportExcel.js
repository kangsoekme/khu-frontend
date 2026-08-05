import * as XLSX from "xlsx";

export const exportToExcel = (data, namaFile, namaSheet = "Data") => {
  const worksheet = XLSX.utils.json_to_sheet(data);

  const workbook = XLSX.utils.book_new();

  XLSX.utils.book_append_sheet(workbook, worksheet, namaSheet);

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${namaFile}.xlsx`;
  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

// Template import siswa.
// Urutan kolom & format WAJIB sesuai backend (siswa-service.js importSiswaExcelSync):
//   kolom 1 NIS, 2 Nama, 3 Jenis Kelamin (L/P), 4 Tanggal Lahir (YYYY-MM-DD),
//   5 Alamat, 6 Nama Wali, 7 No. Telp, 8 Kelas (format romawi-huruf cth I-A),
//   9 Profile Photo (opsional, URL).
// Baris contoh sengaja diisi agar user tahu format yang benar.
export const downloadStudentTemplate = () => {
  const headers = [
    "NIS",
    "Nama",
    "Jenis Kelamin (L/P)",
    "Tanggal Lahir (YYYY-MM-DD)",
    "Alamat",
    "Nama Wali",
    "No. Telp",
    "Kelas",
    "Profile Photo (Opsional)",
  ];

  const contohData = [
    [
      "1234567890",
      "Ahmad Fulan",
      "L",
      "2015-08-17",
      "Jl. Contoh No. 1, Surabaya",
      "Budi Santoso",
      "081234567890",
      "I-A",
      "",
    ],
    [
      "0987654321",
      "Aisyah Putri",
      "P",
      "2016-01-20",
      "Jl. Melati No. 5, Sidoarjo",
      "Siti Aminah",
      "081298765432",
      "II-B",
      "",
    ],
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...contohData]);

  // Lebar kolom agar header terbaca jelas (tidak terpotong).
  worksheet["!cols"] = [
    { wch: 14 },
    { wch: 20 },
    { wch: 18 },
    { wch: 22 },
    { wch: 28 },
    { wch: 18 },
    { wch: 14 },
    { wch: 10 },
    { wch: 22 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Template Siswa");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "Template_Import_Siswa.xlsx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
