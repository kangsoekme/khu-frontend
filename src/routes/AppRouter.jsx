// super admin
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SuperAdminHomepage from "../pages/super-admin/Homepage";
import MainLayout from "../layout/MainLayout";
import SuperAdminUserManagement from "../pages/super-admin/UserManagement";
import SuperAdminStudentManagement from "../pages/super-admin/StudentManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <SuperAdminHomepage /> },
      { path: "beranda", element: <SuperAdminHomepage /> },
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
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
