// FRONT END/src/utils/tahsinProgress.js
//
// Util bersama untuk menurunkan "posisi bacaan / pencapaian / nilai" siswa
// Tahsin dari data setoranTahsin (backend mengurutkan desc & take 1, jadi
// elemen [0] = setoran TERAKHIR) + ujianPretest.
//
// Dipakai oleh: TahsinDetail (Detail Kelompok), HalaqohForm (Manajemen
// Halaqoh), dst. — jangan copy-paste logika ini lagi di komponen lain,
// cukup import dari sini supaya tampilan selalu konsisten.
//
// Konvensi penting:
// - Record setoran hasil pretest ditandai is_placement=true di backend
//   (dibuat otomatis oleh tahsin-service.addPretest sebagai TITIK AWAL,
//   bukan pertemuan nyata; nilai "A+" di record itu hanyalah placeholder).
//   Record placement BOLEH dipakai sebagai posisi bacaan (itu fungsinya),
//   tetapi TIDAK dianggap setoran riil untuk kolom Nilai.

import { formatEnum } from "./formatEnum";

// Label prefix untuk record placement (titik awal dari pretest).
const LABEL_PLACEMENT = "Titik awal (pretest): ";

// Format rentang ayat: hindari "140-140" saat ayat awal = akhir (satu titik).
// 140,140 -> "Ayat 140" | 140,150 -> "Ayat 140-150" | null,null -> ""
export const formatRentangAyat = (awal, akhir) => {
  if (awal == null && akhir == null) return "";
  if (awal != null && akhir != null && Number(awal) === Number(akhir)) {
    return `Ayat ${awal}`;
  }
  return `Ayat ${awal ?? "-"}${akhir != null ? `-${akhir}` : ""}`;
};

// Label surah dari record setoran: "Qs. An-Nisa" (fallback ke nomor surah).
const labelSurah = (setoran) =>
  `Qs. ${setoran.surah?.nama_surah || `Surah ke-${setoran.no_surah}`}`;

// Setoran terakhir apa adanya (boleh record placement pretest).
export const getSetoranTerakhir = (siswa) => siswa?.setoranTahsin?.[0] || null;

// Setoran riil terakhir (record placement pretest Dikecualikan).
// Backend hanya mengirim take:1, jadi jika elemen [0] adalah placement
// berarti memang belum ada setoran pertemuan nyata.
export const getSetoranRiilTerakhir = (siswa) => {
  const setoran = getSetoranTerakhir(siswa);
  return setoran && !setoran.is_placement ? setoran : null;
};

// Tahapan aktif siswa: tahapan_tahsin > setoran terakhir > pretest.
export const getTahapAktif = (siswa) => {
  const setoran = getSetoranTerakhir(siswa);
  return (
    siswa?.tahapan_tahsin ||
    setoran?.tahapan ||
    siswa?.ujianPretest?.[0]?.tahapan ||
    null
  );
};

// Label ketika siswa naik tahapan tapi belum ada setoran di tahapan baru.
const labelAwalTahapBaru = (currentTahap) => {
  if (currentTahap.startsWith("JILID_")) {
    return `Jilid ${currentTahap.split("_")[1] || ""} (Hal. 1)`;
  }
  return `${formatEnum(currentTahap)} (Awal)`;
};

// Apakah setoran terakhir tidak lagi sejalan dengan tahapan aktif?
// (setoran.tahapan null = data lama, anggap sejalan agar posisinya tetap tampil)
const isNaikTahapBelumSetoran = (lastSetoran, currentTahap) =>
  Boolean(
    currentTahap && lastSetoran.tahapan && lastSetoran.tahapan !== currentTahap,
  );

/**
 * Posisi bacaan siswa untuk tabel/detail (TahsinDetail).
 * Mengembalikan { text, isPlacement }.
 *  - Setoran riil berbasis surah  -> "Qs. An-Nisa (Ayat 140)"
 *  - Placement pretest            -> "Titik awal (pretest): Qs. An-Nisa (Ayat 140)"
 *  - Setoran buku Ummi            -> "Jilid 3 (Hal. 42)"
 *  - Naik tahap belum setoran     -> "Jilid 4 (Hal. 1)" / "Gharib (Awal)"
 *  - Pretest tanpa record setoran -> "Pretest: Tilawah Juz 1-5"
 */
export const getPosisiBacaan = (siswa, { emptyLabel = "Belum Memulai" } = {}) => {
  const currentTahap = getTahapAktif(siswa);
  const lastSetoran = getSetoranTerakhir(siswa);

  if (!lastSetoran) {
    if (currentTahap) {
      return { text: `Pretest: ${formatEnum(currentTahap)}`, isPlacement: false };
    }
    return { text: emptyLabel, isPlacement: false };
  }

  const isPlacement = Boolean(lastSetoran.is_placement);
  const prefix = isPlacement ? LABEL_PLACEMENT : "";

  if (isNaikTahapBelumSetoran(lastSetoran, currentTahap)) {
    return { text: labelAwalTahapBaru(currentTahap), isPlacement: false };
  }

  // Setoran berbasis surah (Tilawah Juz 1-5, dst.)
  if (lastSetoran.surah || lastSetoran.no_surah) {
    const ayat = formatRentangAyat(lastSetoran.ayat_awal, lastSetoran.ayat_akhir);
    return {
      text: `${prefix}${labelSurah(lastSetoran)}${ayat ? ` (${ayat})` : ""}`,
      isPlacement,
    };
  }

  // Setoran berbasis buku Ummi (jilid + bab/halaman)
  if (lastSetoran.jilid > 0 || lastSetoran.bab || lastSetoran.halaman) {
    return {
      text: `${prefix}Jilid ${lastSetoran.jilid} (Hal. ${
        lastSetoran.bab || lastSetoran.halaman || "-"
      })`,
      isPlacement,
    };
  }

  // Fallback terakhir: materi / nama tahapan
  return {
    text: `${prefix}${
      lastSetoran.materi || formatEnum(lastSetoran.tahapan) || emptyLabel
    }`,
    isPlacement,
  };
};

/**
 * Pencapaian ringkas satu baris untuk daftar siswa di form Halaqoh
 * (baris 2 — baris 1 sudah menampilkan nama tahapan, jadi tanpa prefix jilid).
 *  - Setoran riil berbasis surah  -> "Qs. An-Nisa (Ayat 140)"
 *  - Placement pretest            -> "Titik awal (pretest): Qs. An-Nisa (Ayat 140)"
 *  - Setoran buku Ummi            -> "Halaman 42"
 *  - Naik tahap belum setoran     -> "Jilid 4 (Hal. 1)" / "Gharib (Awal)"
 *  - Tidak ada data sama sekali   -> "Belum ada setoran"
 */
export const getPencapaianRingkas = (
  siswa,
  { emptyLabel = "Belum ada setoran" } = {},
) => {
  const currentTahap = getTahapAktif(siswa);
  const lastSetoran = getSetoranTerakhir(siswa);

  if (!lastSetoran) {
    if (currentTahap) return `Pretest: ${formatEnum(currentTahap)}`;
    return emptyLabel;
  }

  const prefix = lastSetoran.is_placement ? LABEL_PLACEMENT : "";

  if (isNaikTahapBelumSetoran(lastSetoran, currentTahap)) {
    return labelAwalTahapBaru(currentTahap);
  }

  // Setoran berbasis surah (Tilawah Juz 1-5, dst.) — dahulu tidak ditangani
  // sehingga salah tampil "Belum ada setoran" (bug inkonsistensi UI).
  if (lastSetoran.surah || lastSetoran.no_surah) {
    const ayat = formatRentangAyat(lastSetoran.ayat_awal, lastSetoran.ayat_akhir);
    return `${prefix}${labelSurah(lastSetoran)}${ayat ? ` (${ayat})` : ""}`;
  }

  if (lastSetoran.bab || lastSetoran.halaman) {
    return `${prefix}Halaman ${lastSetoran.bab || lastSetoran.halaman}`;
  }

  if (lastSetoran.materi) {
    return `${prefix}${lastSetoran.materi}`;
  }

  return emptyLabel;
};

/**
 * Nilai setoran riil terakhir. Record placement pretest TIDAK dianggap
 * penilaian (nilai "A+" di record placement hanyalah placeholder backend),
 * jadi selama belum ada setoran pertemuan nyata -> "-".
 */
export const getNilaiTahsin = (siswa) => {
  const setoranRiil = getSetoranRiilTerakhir(siswa);
  return setoranRiil?.nilai || "-";
};
