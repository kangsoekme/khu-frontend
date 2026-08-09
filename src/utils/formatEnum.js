// FRONT END/src/utils/formatEnum.js

export const formatEnum = (val) => {
  if (!val) return "-";

  const map = {
    // Tahapan Tahsin & Tahfidz
    JILID_1: "Jilid 1",
    JILID_2: "Jilid 2",
    JILID_3: "Jilid 3",
    JILID_4: "Jilid 4",
    JILID_5: "Jilid 5",
    JILID_6: "Jilid 6",
    TILAWAH_JUZ_1_5: "Tilawah Juz 1-5",
    GHARIB: "Gharib",
    TAJWID: "Tajwid",
    MUNAQOSYAH: "Munaqosyah",

    // Predikat Penilaian
    MUMTAZ: "Mumtaz",
    JAYYID_JIDDAN: "Jayyid Jiddan",
    JAYYID: "Jayyid",
    MAQBUL: "Maqbul",
    DHAIF: "Dhaif",

    // Role & Jenis Kelamin
    SUPER_ADMIN: "Super Admin",
    DIREKTUR: "Direktur",
    GURU: "Guru",
    LAKI_LAKI: "Laki-laki",
    PEREMPUAN: "Perempuan",

    // Status
    TAHSIN: "Tahsin Qiraah",
    TAHFIDZ: "Tahfidz Quran",
    LULUS: "Lulus",
    TIDAK_LULUS: "Tidak Lulus",
    LANJUT: "Lanjut",
    MENGULANG: "Mengulang",
  };

  // 💡 Kunci perbaikan: Tambahkan .toLowerCase() sebelum title case
  return (
    map[val] ||
    val
      .toString()
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase())
  );
};

export const formatTitleGuru = (nama, jenisKelamin) => {
  if (!nama) return "-";
  if (jenisKelamin === "PEREMPUAN") return `Al-Ustadzah ${nama}`;
  return `Al-Ustadz ${nama}`;
};
