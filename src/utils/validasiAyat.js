// Validasi rentang ayat terhadap jumlah ayat surah terpilih.
// Dipakai bersama oleh form tahsin (pretest & setoran harian) dan tahfidz
// agar batas ayat konsisten dengan data tabel surah (jumlah_ayat).

// Fallback jika surah tidak dikenali: jumlah ayat terbanyak (QS Al-Baqarah)
const MAX_AYAT_FALLBACK = 286;

export const getMaxAyat = (surahObj) => surahObj?.jumlah_ayat || MAX_AYAT_FALLBACK;

/**
 * Validasi ayat awal/akhir terhadap jumlah ayat surah.
 * Untuk nilai tunggal (mis. "ayat terakhir dibaca"), panggil dengan awal = akhir.
 *
 * @param {Object|null} surahObj - objek surah (punya nama_surah & jumlah_ayat)
 * @param {number} awal
 * @param {number} akhir
 * @returns {{ valid: boolean, pesan: string }}
 */
export const validasiAyatSurah = (surahObj, awal, akhir) => {
  if (isNaN(awal) || isNaN(akhir) || awal < 1 || akhir < 1) {
    return {
      valid: false,
      pesan: "Ayat awal dan akhir harus diisi dengan angka valid",
    };
  }

  const maxAyat = getMaxAyat(surahObj);
  if (awal > maxAyat || akhir > maxAyat) {
    return {
      valid: false,
      pesan: `Ayat melebihi jumlah ayat QS ${surahObj?.nama_surah || ""} (${maxAyat} ayat)`,
    };
  }

  if (awal > akhir) {
    return {
      valid: false,
      pesan: "Ayat awal tidak boleh lebih besar dari ayat akhir",
    };
  }

  return { valid: true, pesan: "" };
};
