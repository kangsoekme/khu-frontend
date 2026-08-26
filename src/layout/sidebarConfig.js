import { BsGrid1X2Fill } from "react-icons/bs";
import { ROLES } from "../utils/constant.js";
import { FiUsers } from "react-icons/fi";
import { PiStudentBold } from "react-icons/pi";
import { FaBookQuran, FaBoxesPacking } from "react-icons/fa6";
import { LiaQuranSolid } from "react-icons/lia";
import { RiLogoutBoxFill } from "react-icons/ri";
import { MdGroups } from "react-icons/md";
import { CgInsertBeforeR } from "react-icons/cg";
import { HiOutlineDocumentReport } from "react-icons/hi";

import { FaCalendarAlt } from "react-icons/fa";

const MENU_BERANDA = {
  label: "Beranda",
  path: "/beranda",
  icon: BsGrid1X2Fill,
};

const MENU_MANAJEMEN_USER = {
  label: "Manajemen User",
  path: "/manajemen-user",
  icon: FiUsers,
};

const MENU_MANAJEMEN_SISWA = {
  label: "Manajemen Siswa",
  path: "/manajemen-siswa",
  icon: PiStudentBold,
};

const MENU_MANAJEMEN_HALAQOH = {
  label: "Manajemen Halaqoh",
  path: "/manajemen-halaqoh",
  icon: MdGroups,
};

const MENU_TAHSIN = {
  label: "Tahsin Qiraah",
  path: "/tahsin",
  icon: LiaQuranSolid,
};

const MENU_TAHFIDZ = {
  label: "Tahfidz Quran",
  path: "/tahfidz",
  icon: FaBookQuran,
};

const MENU_UJIAN_PRETEST = {
  label: "Ujian Pretest",
  path: "/pretest",
  icon: CgInsertBeforeR,
};

const MENU_UJIAN_KENAIKAN = {
  label: "Ujian Kenaikan",
  path: "/tahsin/ujian-kenaikan",
  icon: CgInsertBeforeR,
};

const MENU_BACKUP = {
  label: "Pencadangan",
  path: "/backup",
  icon: FaBoxesPacking,
};

const MENU_LAPORAN = {
  label: "Pusat Laporan",
  path: "/laporan",
  icon: HiOutlineDocumentReport,
};

const MENU_TAHUN_AJARAN = {
  label: "Tahun Ajaran",
  path: "/tahun-ajaran",
  icon: FaCalendarAlt,
};

export const LOGOUT_MENU_ITEM = {
  label: "Logout",
  icon: RiLogoutBoxFill,
};

export const SIDEBAR_CONFIG = {
  [ROLES.SUPER_ADMIN]: [
    MENU_BERANDA,
    MENU_MANAJEMEN_SISWA,
    MENU_MANAJEMEN_USER,
    MENU_TAHSIN,
    MENU_TAHFIDZ,
    MENU_LAPORAN,
    MENU_BACKUP,
    MENU_TAHUN_AJARAN,
  ],
  [ROLES.DIREKTUR]: [
    MENU_BERANDA,
    MENU_MANAJEMEN_HALAQOH,
    MENU_TAHSIN,
    MENU_TAHFIDZ,
    MENU_UJIAN_PRETEST,
    MENU_UJIAN_KENAIKAN,
    MENU_LAPORAN,
  ],
  [ROLES.GURU]: [MENU_BERANDA, MENU_TAHSIN, MENU_TAHFIDZ],
};

export function getSidebarMenuByRole(role) {
  return SIDEBAR_CONFIG[role] ?? [];
}
