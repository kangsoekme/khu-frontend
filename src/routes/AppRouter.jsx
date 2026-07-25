import { createBrowserRouter, RouterProvider } from "react-router-dom";
// global
import MainLayout from "../layout/MainLayout";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute.jsx";

// super admin
import SuperAdminHomepage from "../pages/super-admin/Homepage";
import SuperAdminUserManagement from "../pages/super-admin/UserManagement";
import SuperAdminStudentManagement from "../pages/super-admin/StudentManagement";

// direktur
import DirekturHomepage from "../pages/direktur/Homepage.jsx";
import DirekturHalaqohManagement from "../pages/direktur/HalaqohManagement.jsx";
import DirekturPretestManagement from "../pages/direktur/PretestManagement.jsx";

// guru
import GuruHomepage from "../pages/guru/Homepage.jsx";

// tahsin tabs
import TahsinManagement from "../pages/direktur/tahsin/TahsinManagement.jsx";

import { ROLES } from "../utils/constant.js";
import TahsinDetail from "../pages/direktur/tahsin/TahsinDetail.jsx";
import TahfidzManagement from "../pages/direktur/tahfidz/TahfidzManagement.jsx";
import TahfidzDetail from "../pages/direktur/tahfidz/TahfidzDetail.jsx";
import TahsinStudentDetail from "../pages/direktur/tahsin/TahsinStudentDetail.jsx";
import TahfidzStudentDetail from "../pages/direktur/tahfidz/TahfidzStudentDetail.jsx";
import UjianKenaikanManagement from "../pages/direktur/tahsin/UjianKenaikanManagement.jsx";
import BackupManagement from "../pages/super-admin/BackupManagement.jsx";
import LaporanManagement from "../pages/direktur/LaporanManagement.jsx";

const RoleBasedHomepage = () => {
  const currentRole = localStorage.getItem("role") || ROLES.SUPER_ADMIN;

  if (currentRole === ROLES.DIREKTUR) {
    return <DirekturHomepage />;
  }

  if (currentRole === ROLES.GURU) {
    return <GuruHomepage />;
  }

  return <SuperAdminHomepage />;
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [
          { index: true, element: <RoleBasedHomepage /> },
          { path: "beranda", element: <RoleBasedHomepage /> },
        ],
      },
      {
        path: "/manajemen-user",
        element: <MainLayout />,
        children: [
          { index: true, element: <SuperAdminUserManagement /> },
          { path: "manajemen-user", element: <SuperAdminUserManagement /> },
        ],
      },
      {
        path: "/manajemen-siswa",
        element: <MainLayout />,
        children: [
          { index: true, element: <SuperAdminStudentManagement /> },
          { path: "manajemen-siswa", element: <SuperAdminStudentManagement /> },
        ],
      },

      {
        path: "/backup",
        element: <MainLayout />,
        children: [{ index: true, element: <BackupManagement /> }],
      },

      {
        path: "/laporan",
        element: <MainLayout />,
        children: [{ index: true, element: <LaporanManagement /> }],
      },

      {
        path: "/tahsin",
        element: <MainLayout />,
        children: [
          { index: true, element: <TahsinManagement /> },
          { path: "tahsin", element: <TahsinManagement /> },
          { path: "ujian-kenaikan", element: <UjianKenaikanManagement /> },
          { path: ":id", element: <TahsinDetail /> },
          { path: ":id/:nis", element: <TahsinStudentDetail /> },
        ],
      },
      {
        path: "/tahfidz",
        element: <MainLayout />,
        children: [
          { index: true, element: <TahfidzManagement /> },
          { path: "tahfidz", element: <TahfidzManagement /> },
          { path: ":id", element: <TahfidzDetail /> },
          { path: ":id/:nis", element: <TahfidzStudentDetail /> },
        ],
      },

      {
        path: "/manajemen-halaqoh",
        element: <MainLayout />,
        children: [
          { index: true, element: <DirekturHalaqohManagement /> },
          { path: "manajemen-halaqoh", element: <DirekturHalaqohManagement /> },
        ],
      },

      {
        path: "/pretest",
        element: <MainLayout />,
        children: [
          { index: true, element: <DirekturPretestManagement /> },
          { path: "pretest", element: <DirekturPretestManagement /> },
        ],
      },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
