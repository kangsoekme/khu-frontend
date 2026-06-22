import { BsGrid1X2Fill } from "react-icons/bs";
import { ROLES } from "../utils/constant.js";
import { FiUsers } from "react-icons/fi";
import { PiStudentBold } from "react-icons/pi";
import { FaBookQuran, FaBoxesPacking } from "react-icons/fa6";
import { LiaQuranSolid } from "react-icons/lia";
import { RiLogoutBoxFill } from "react-icons/ri";
import { MdGroups } from "react-icons/md";

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
  path: "/tahfiz",
  icon: FaBookQuran,
};

const MENU_BACKUP = {
  label: "Pencadangan",
  path: "/backup",
  icon: FaBoxesPacking,
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
    MENU_BACKUP,
  ],
  [ROLES.DIREKTUR]: [
    MENU_BERANDA,
    MENU_MANAJEMEN_HALAQOH,
    MENU_TAHSIN,
    MENU_TAHFIDZ,
  ],
  [ROLES.MUHASSIN]: [MENU_BERANDA, MENU_TAHSIN],
  [ROLES.MUHAFFIDZ]: [MENU_BERANDA, MENU_TAHFIDZ],
};

export function getSidebarMenuByRole(role) {
  return SIDEBAR_CONFIG[role] ?? [];
}
