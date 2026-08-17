// FRONT END/src/utils/tahsinCompletion.js
//
// Logika target penyelesaian per tahapan TAHSIN.
// Acuan: requirements/Pemaparan Program Quran SMT 1 TA 2026-2027.docx
//
// UMMI (Jilid 1-6) -> masing-masing 40 halaman; buku Gharib 45 halaman; buku Tajwid 40 halaman.
// Tahap lanjutan (Tilawah/Gharib/Tajwid/Al-Quran) -> berbasis juz Al-Quran.

// Target halaman terakhir untuk tiap tahapan berbasis BUKU (syarat ujian kenaikan).
// Acuan: tabel kurikulum Pemaparan Program Quran TA 2026-2027:
//   Jilid 1-6 dan buku Tajwid berakhir di halaman 40; buku Gharib berakhir di halaman 45.
export const TARGET_BUKU = {
  JILID_1: 40,
  JILID_2: 40,
  JILID_3: 40,
  JILID_4: 40,
  JILID_5: 40,
  JILID_6: 40,
  GHARIB: 45,
  TAJWID: 40,
};

// Nilai default bila tahapan tidak dikenal (kompatibilitas lama).
export const TARGET_HALAMAN_JILID = 40;

// Titik SELESAI Tilawah Juz 1-5 (akhir Juz 5): Surah 4 (An-Nisa) ayat 147.
// Ayat 148+ An-Nisa sudah masuk wilayah Juz 6 (bahan tahap Gharib).
export const TARGET_TILAWAH_JUZ_1_5 = { no_surah: 4, ayat: 147 };

// Pemetaan juz-awal & juz-akhir untuk tahap lanjutan berbasis Al-Quran.
// Dari Pemaparan: Tilawah Juz 1-5, Gharib Juz 6-15, Tajwid Juz 16-25, Al-Quran Juz 26-30.
const JUZ_RANGE = {
  TILAWAH_JUZ_1_5: { awal: 1, akhir: 5 },
  GHARIB: { awal: 6, akhir: 15 },
  TAJWID: { awal: 16, akhir: 25 },
  // ALQURAN dihapus dari jenjang — sekarang TAJWID langsung ke MUNAQOSYAH.
  // Munaqosyah = tahap ujian akhir (tilawah juz 26-30), tanpa gate capaian.
  MUNAQOSYAH: { awal: 26, akhir: 30 },
};

// Pemetaan juz -> surah awal (no_surah) pada juz tersebut.
// Berdasarkan standar pembagian juz Al-Quran (mushaf Utsmani).
const JUZ_TO_SURAH_AWAL = {
  1: 1, // Al-Fatihah
  2: 2, // Al-Baqarah
  3: 2, // Al-Baqarah (ayat 92)
  4: 4, // An-Nisa (ayat 24)
  5: 4, // An-Nisa (ayat 147)
  6: 4, // An-Nisa (ayat 148)
  7: 5, // Al-Maidah (ayat 82)
  8: 6, // Al-An'am (ayat 111)
  9: 7, // Al-A'raf (ayat 47)
  10: 8, // Al-Anfal (ayat 41)
  11: 9, // At-Taubah (ayat 93)
  12: 11, // Hud (ayat 6)
  13: 12, // Yusuf (ayat 53)
  14: 15, // Al-Hijr (ayat 1)
  15: 17, // Al-Isra (ayat 1)
  16: 18, // Al-Kahfi (ayat 75)
  17: 21, // Al-Anbiya (ayat 1)
  18: 23, // Al-Mu'minun (ayat 1)
  19: 25, // Al-Furqan (ayat 21)
  20: 27, // An-Naml (ayat 56)
  21: 29, // Al-Ankabut (ayat 46)
  22: 33, // Al-Ahzab (ayat 31)
  23: 36, // Ya-Sin (ayat 28)
  24: 39, // Az-Zumar (ayat 32)
  25: 41, // Fussilat (ayat 47)
  26: 46, // Al-Ahqaf (ayat 1)
  27: 51, // Adz-Dzariyat (ayat 31)
  28: 58, // Al-Mujadilah (ayat 1)
  29: 67, // Al-Mulk (ayat 1)
  30: 78, // An-Naba (ayat 1)
};

// Pemetaan juz -> surah akhir (no_surah) pada juz tersebut.
const JUZ_TO_SURAH_AKHIR = {
  1: 2,
  2: 3,
  3: 4,
  4: 5,
  5: 6,
  6: 6,
  7: 7,
  8: 10,
  9: 13,
  10: 11,
  11: 12,
  12: 14,
  13: 15,
  14: 16,
  15: 18,
  16: 20,
  17: 22,
  18: 24,
  19: 27,
  20: 27,
  21: 32,
  22: 35,
  23: 38,
  24: 41,
  25: 45,
  26: 51,
  27: 57,
  28: 66,
  29: 77,
  30: 114,
};

// Kategori bacaan untuk sebuah tahapan.
export const TAHAPAN_KATEGORI = {
  // Tahapan berbasis BUKU UMMI (jilid + halaman)
  BUKU: ["JILID_1", "JILID_2", "JILID_3", "JILID_4", "JILID_5", "JILID_6"],
  // Tahapan berbasis Al-QURAN (surah + ayat)
  QURAN: ["MUNAQOSYAH"],
  // Tahapan GANDA -> bisa buku Gharib/Tajwid DAN Al-Quran
  GANDA: ["GHARIB", "TAJWID"],
  // Tilawah Juz 1-5 dianggap tahap Al-Quran murni (membaca Al-Quran)
  QURAN_TILAWAH: ["TILAWAH_JUZ_1_5"],
};

// Helper: cek kategori tahapan
export const getKategoriTahapan = (tahapan) => {
  if (!tahapan) return "BUKU";
  if (TAHAPAN_KATEGORI.BUKU.includes(tahapan)) return "BUKU";
  if (TAHAPAN_KATEGORI.GANDA.includes(tahapan)) return "GANDA";
  if (TAHAPAN_KATEGORI.QURAN_TILAWAH.includes(tahapan)) return "QURAN";
  if (TAHAPAN_KATEGORI.QURAN.includes(tahapan)) return "QURAN";
  return "BUKU";
};

// Urutan tahapan TAHSIN untuk menentukan target ujian kenaikan berikutnya.
// Catatan: ALQURAN dihapus — setelah TAJWID langsung ke MUNAQOSYAH (ujian akhir).
export const URUTAN_TAHAPAN = [
  "JILID_1",
  "JILID_2",
  "JILID_3",
  "JILID_4",
  "JILID_5",
  "JILID_6",
  "TILAWAH_JUZ_1_5",
  "GHARIB",
  "TAJWID",
  "MUNAQOSYAH",
];

// Dapatkan tahapan berikutnya (untuk ujian kenaikan).
export const getTahapanBerikutnya = (tahapanSaatIni) => {
  const idx = URUTAN_TAHAPAN.indexOf(tahapanSaatIni);
  if (idx === -1 || idx >= URUTAN_TAHAPAN.length - 1) return null;
  return URUTAN_TAHAPAN[idx + 1];
};

/**
 * Cek apakah setoran terakhir menandakan tahapan UMMI saat ini SUDAH SELESAI.
 * - Tahapan BUKU (Jilid 1-6): selesai jika bab/halaman terakhir >= 40 (lihat TARGET_BUKU).
 * - Tahapan GANDA (Gharib/Tajwid): selesai jika halaman buku >= target (Gharib 45, Tajwid 40).
 * - Tahapan QURAN / GANDA (surah/ayat): selesai jika surah terakhir >= surah
 *   akhir dari juz akhir rentang tahapan, ATAU mencapai juz akhir rentang.
 *
 * @param {Object} lastRiwayat - riwayat setoran terakhir (history[0]).
 *   Struktur: { tahapan, laporan_bacaan: { jilid, bab, surah, no_surah, ayat_akhir } }
 * @returns {{ selesai: boolean, target: string, capaian: string }}
 */
export const cekPenyelesaianTahapan = (lastRiwayat, pretestPlacement) => {
  if (!lastRiwayat && !pretestPlacement) {
    return { selesai: false, target: "-", capaian: "Belum ada setoran" };
  }

  const tahapan = lastRiwayat?.tahapan || pretestPlacement?.tahapan;
  const kategori = getKategoriTahapan(tahapan);
  const laporan = lastRiwayat?.laporan_bacaan || lastRiwayat || pretestPlacement || {};

  // --- Tahapan BUKU UMMI (Jilid 1-6) ---
  if (kategori === "BUKU") {
    const targetHal = TARGET_BUKU[tahapan] || TARGET_HALAMAN_JILID;
    const halaman = Number(laporan.bab) || Number(laporan.halaman) || 0;
    const selesai = halaman >= targetHal;
    return {
      selesai,
      target: `Halaman ${targetHal}`,
      capaian: `Halaman ${halaman || 0}`,
    };
  }

  // --- Tahapan GANDA (Gharib / Tajwid) ---
  // Syarat ujian kenaikan: HANYA target halaman buku tercapai
  // (Gharib = 45, Tajwid = 40 sesuai kurikulum).
  // Bacaan Al-Quran (rentang juz) bersifat opsional / informatif saja.
  if (kategori === "GANDA") {
    const targetHal = TARGET_BUKU[tahapan] || TARGET_HALAMAN_JILID;
    const halaman = Number(laporan.bab) || Number(laporan.halaman) || 0;
    const noSurah = Number(laporan.no_surah) || 0;

    const bukuSelesai = halaman >= targetHal;

    return {
      selesai: bukuSelesai,
      target: `Buku Halaman ${targetHal}`,
      capaian: `Buku Hal ${halaman || 0}${noSurah > 0 ? ` / Qr Surah ${noSurah}` : ""}`,
    };
  }

  // --- Tahapan berbasis Al-Quran murni (QURAN / TILAWAH) ---
  const range = JUZ_RANGE[tahapan] || JUZ_RANGE.MUNAQOSYAH;
  const noSurah = Number(laporan.no_surah) || 0;
  let surahAkhirRentang = JUZ_TO_SURAH_AKHIR[range.akhir] || 114;
  let selesai = false;

  if (tahapan === "TILAWAH_JUZ_1_5") {
    surahAkhirRentang = TARGET_TILAWAH_JUZ_1_5.no_surah;
    const ayatAkhir = Number(laporan.ayat_akhir) || 0;
    // Selesai jika sudah lewat Surah 4, ATAU di Surah 4 tapi ayatnya sdh sampai 147
    selesai =
      noSurah > TARGET_TILAWAH_JUZ_1_5.no_surah ||
      (noSurah === TARGET_TILAWAH_JUZ_1_5.no_surah &&
        ayatAkhir >= TARGET_TILAWAH_JUZ_1_5.ayat);
  } else if (tahapan === "MUNAQOSYAH") {
    // BUG-01 fix: Munaqosyah = tahap ujian akhir (tilawah juz 26-30).
    // Target Surah No. 51 (Al-Ahqaf, akhir Juz 26-30) — BUKAN 114 (An-Nas)
    // yang dihasilkan oleh JUZ_TO_SURAH_AKHIR[30].
    // Selain itu, karena Munaqosyah tidak punya gate setoran (ujian final),
    // selalu dianggap selesai (bolehAjukan di-handle di cekKelengkapanPengajuan).
    surahAkhirRentang = 51;
    selesai = true;
  } else {
    // BUG-01 fix (defensive): override ke 51 untuk tahap Quran juz 26-30,
    // agar tidak pernah men-target Surah 114 (An-Nas) yang mustahil dicapai.
    if (range.akhir === 30) surahAkhirRentang = 51;
    selesai = noSurah > 0 && noSurah >= surahAkhirRentang;
  }

  return {
    selesai,
    target: tahapan === "TILAWAH_JUZ_1_5" ? `Juz 1-5 (s/d Surah 4 Ayat 147)` : `Juz ${range.awal}-${range.akhir} (s/d Surah No. ${surahAkhirRentang})`,
    capaian: tahapan === "TILAWAH_JUZ_1_5" && noSurah === 4 ? `Surah 4 Ayat ${Number(laporan.ayat_akhir) || "-"}` : `Surah No. ${noSurah || "-"}`,
  };
};

/**
 * Validasi titik placement pretest (P1: placement = TITIK AWAL bacaan).
 * Titik placement tidak boleh berada di titik selesai tahapan (atau melewatinya),
 * karena itu membuat siswa instan "selesai tahapan" tanpa satu setoran riil pun
 * dan langsung boleh mengajukan ujian kenaikan.
 *
 * Aturan (satu sumber kebenaran — memakai cekPenyelesaianTahapan):
 * - BUKU/GANDA: halaman < TARGET_BUKU (Jilid/Tajwid maks 39, Gharib maks 44).
 * - TILAWAH_JUZ_1_5: maks Surah 4 (An-Nisa) ayat 146; surah 5+ ditolak.
 * - MUNAQOSYAH: selalu ditolak — tahap ujian akhir dimasuki via ujian kenaikan.
 *
 * @param {string} tahapan - tahapan placement yang dipilih.
 * @param {Object} titik - { halaman, no_surah, ayat_akhir } posisi bacaan santri.
 * @returns {{ valid: boolean, pesan: string }}
 */
export const validasiTitikPlacement = (tahapan, titik = {}) => {
  if (!tahapan) {
    return { valid: false, pesan: "Pilih tahapan placement terlebih dahulu" };
  }

  if (tahapan === "MUNAQOSYAH") {
    return {
      valid: false,
      pesan:
        "Munaqosyah adalah tahap ujian akhir — dimasuki melalui ujian kenaikan, bukan placement pretest",
    };
  }

  const status = cekPenyelesaianTahapan({
    tahapan,
    laporan_bacaan: {
      bab: titik.halaman ?? null,
      no_surah: titik.no_surah ?? null,
      ayat_akhir: titik.ayat_akhir ?? null,
    },
  });

  if (status.selesai) {
    return {
      valid: false,
      pesan: `Placement adalah titik awal bacaan, sedangkan posisi santri (${status.capaian}) sudah setara titik selesai tahapan (target: ${status.target}). Tempatkan santri langsung di tahapan berikutnya.`,
    };
  }

  return { valid: true, pesan: "" };
};

/**
 * Hitung status kelengkapan pengajuan ujian kenaikan.
 * Pengajuan HANYA boleh diajukan jika tahapan saat ini sudah selesai (Halaman >= target buku, atau Surah Akhir).
 *
 * @param {Array} riwayatList - array history setoran (desc by timestamp).
 * @param {string} tahapanSaatIni - siswa.tahapan_tahsin.
 * @param {Object} pretestPlacement - data placement pretest siswa.
 * @returns {{ bolehAjukan: boolean, alasan: string, detail: Object }}
 */
export const cekKelengkapanPengajuan = (riwayatList, tahapanSaatIni, pretestPlacement) => {
  // Munaqosyah = tahap ujian akhir. Tombol Ajukan Ujian selalu aktif
  // (tidak ada gate capaian / syarat setoran).
  if (tahapanSaatIni === "MUNAQOSYAH") {
    return {
      bolehAjukan: true,
      alasan: "Tahap Munaqosyah — siap diajukan ujian akhir (tanpa syarat setoran).",
      detail: { selesai: true, target: "Ujian Akhir Munaqosyah", capaian: "Siap ujian" },
    };
  }

  const riwayatTahapanIni = (riwayatList || []).filter(
    (r) => r.tahapan === tahapanSaatIni,
  );

  // BUG-02 part A fix: jangan fallback ke record tahap LAMA (riwayatList?.[0])
  // saat tahap baru belum punya setoran. Fallback ke pretestPlacement (titik
  // awal tahap) atau null agar status capaian tidak menampilkan capaian lama.
  const lastRiwayat = riwayatTahapanIni[0] || pretestPlacement || null;
  const status = cekPenyelesaianTahapan(lastRiwayat, pretestPlacement);

  // P3 hardening: placement pretest hanyalah TITIK AWAL, bukan capaian riil.
  // Tombol pengajuan minimal mensyaratkan satu setoran riil (non-placement) di
  // tahapan berjalan — mengunci celah placement di/lewat titik selesai tahapan
  // (termasuk data lama yang sudah ternoda sebelum validasi diterapkan).
  const adaSetoranRiil = riwayatTahapanIni.some((r) => !r.is_placement);

  if (status.selesai && adaSetoranRiil) {
    return {
      bolehAjukan: true,
      alasan: `Tahapan ${tahapanSaatIni?.replace(/_/g, " ")} sudah selesai (${status.capaian}). Siap diajukan ujian kenaikan.`,
      detail: status,
    };
  }

  if (status.selesai && !adaSetoranRiil) {
    return {
      bolehAjukan: false,
      alasan: `Placement pretest hanya titik awal — capaian ${status.capaian} belum didukung setoran riil di tahapan ini. Lakukan setoran hingga target ${status.target} sebelum mengajukan ujian.`,
      detail: status,
    };
  }

  return {
    bolehAjukan: false,
    alasan: `Tahapan belum selesai. Capaian: ${status.capaian} dari target ${status.target}. Selesaikan dahulu sebelum mengajukan ujian.`,
    detail: status,
  };
};
