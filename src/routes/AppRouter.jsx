// super admin
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SuperAdminHomepage from "../pages/super-admin/Homepage";
import MainLayout from "../layout/MainLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      { index: true, element: <SuperAdminHomepage /> },
      { path: "beranda", element: <SuperAdminHomepage /> },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
