import { createBrowserRouter, Navigate, RouterProvider, useRouteError } from "react-router-dom";
import { lazy, Suspense } from "react";

// global
import MainLayout from "../layout/MainLayout";
import LoginPage from "../pages/auth/LoginPage";
import ProtectedRoute from "./ProtectedRoute.jsx";
import WaliLayout from "../layout/WaliLayout.jsx";
import WaliProtectedRoute from "./WaliProtectedRoute.jsx";

// --- Lazy-loaded pages untuk performa loading lebih cepat ---
const SuperAdminHomepage        = lazy(() => import("../pages/super-admin/Homepage"));
const SuperAdminUserManagement  = lazy(() => import("../pages/super-admin/UserManagement"));
const SuperAdminStudentManagement = lazy(() => import("../pages/super-admin/StudentManagement"));
const BackupManagement          = lazy(() => import("../pages/super-admin/BackupManagement.jsx"));

const DirekturHomepage          = lazy(() => import("../pages/direktur/Homepage.jsx"));
const DirekturHalaqohManagement = lazy(() => import("../pages/direktur/HalaqohManagement.jsx"));
const DirekturPretestManagement = lazy(() => import("../pages/direktur/PretestManagement.jsx"));
const LaporanManagement         = lazy(() => import("../pages/direktur/LaporanManagement.jsx"));
const TahunAjaranManagement     = lazy(() => import("../pages/direktur/TahunAjaranManajemen.jsx"));
const TahsinManagement          = lazy(() => import("../pages/direktur/tahsin/TahsinManagement.jsx"));
const TahsinDetail              = lazy(() => import("../pages/direktur/tahsin/TahsinDetail.jsx"));
const TahsinStudentDetail       = lazy(() => import("../pages/direktur/tahsin/TahsinStudentDetail.jsx"));
const UjianKenaikanManagement   = lazy(() => import("../pages/direktur/tahsin/UjianKenaikanManagement.jsx"));
const TahfidzManagement         = lazy(() => import("../pages/direktur/tahfidz/TahfidzManagement.jsx"));
const TahfidzDetail             = lazy(() => import("../pages/direktur/tahfidz/TahfidzDetail.jsx"));
const TahfidzStudentDetail      = lazy(() => import("../pages/direktur/tahfidz/TahfidzStudentDetail.jsx"));

const GuruHomepage              = lazy(() => import("../pages/guru/Homepage.jsx"));

const WaliLogin                 = lazy(() => import("../pages/wali/WaliLogin.jsx"));
const WaliDashboard             = lazy(() => import("../pages/wali/WaliDashboard.jsx"));

import { ROLES } from "../utils/constant.js";

// Loading fallback component
const PageLoader = () => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-neutral-500 text-sm">Memuat halaman...</p>
    </div>
  </div>
);

const RoleBasedHomepage = () => {
  const currentRole = localStorage.getItem("role");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  // WALI tidak boleh masuk ke beranda admin — redirect ke portal wali.
  // Mencegah crash di halaman admin ketika localStorage role = WALI.
  if (currentRole === "WALI") {
    return <Navigate to="/wali" replace />;
  }

  // Jika tidak login atau role tidak dikenal, lempar ke login admin.
  // (sebelumnya default ke SUPER_ADMIN — celah akses halaman admin).
  if (!isLoggedIn || !Object.values(ROLES).includes(currentRole)) {
    return <Navigate to="/login" replace />;
  }

  if (currentRole === ROLES.DIREKTUR) {
    return <DirekturHomepage />;
  }

  if (currentRole === ROLES.GURU) {
    return <GuruHomepage />;
  }

  return <SuperAdminHomepage />;
};

// Redirect untuk path /wali (sebelumnya tidak terdaftar → error boundary).
// - Sudah login sebagai WALI  → /wali/dashboard
// - Belum login / bukan WALI  → /wali/login
const WaliRedirect = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  if (isLoggedIn && role === "WALI") {
    return <Navigate to="/wali/dashboard" replace />;
  }
  return <Navigate to="/wali/login" replace />;
};

const GlobalErrorBoundary = () => {
  const error = useRouteError();
  console.error("Route error:", error);

  if (error && error.message && error.message.toLowerCase().includes("fetch dynamically imported module")) {
    window.location.reload();
    return <p className="text-center p-10">Menerapkan pembaruan sistem...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Terjadi Kesalahan</h2>
        <p className="text-gray-600 mb-6">{error?.message || "Terjadi kesalahan sistem."}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
        >
          Muat Ulang Halaman
        </button>
      </div>
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <GlobalErrorBoundary />
  },
  {
    path: "/wali",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WaliRedirect />
      </Suspense>
    ),
    errorElement: <GlobalErrorBoundary />
  },
  {
    path: "/wali/login",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WaliLogin />
      </Suspense>
    ),
    errorElement: <GlobalErrorBoundary />
  },
  {
    element: <WaliProtectedRoute />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: "/wali/dashboard",
        element: <WaliLayout />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<PageLoader />}>
                <WaliDashboard />
              </Suspense>
            ),
          },
        ],
      },
    ],
  },
  // Catch-all untuk path wali tidak dikenal (mis. /wali/abc, /wali/foo/bar).
  // Sebelumnya route seperti itu jatuh ke GlobalErrorBoundary. Sekarang
  // diarahkan kembali ke halaman wali yang valid via WaliRedirect.
  {
    path: "/wali/*",
    element: (
      <Suspense fallback={<PageLoader />}>
        <WaliRedirect />
      </Suspense>
    ),
    errorElement: <GlobalErrorBoundary />
  },
  {
    element: <ProtectedRoute />,
    errorElement: <GlobalErrorBoundary />,
    children: [
      {
        path: "/",
        element: <MainLayout />,
        children: [{ index: true, element: <RoleBasedHomepage /> }],
      },
      {
        path: "/beranda",
        element: <MainLayout />,
        children: [{ index: true, element: <RoleBasedHomepage /> }],
      },
      {
        path: "/manajemen-user",
        element: <MainLayout />,
        children: [{ index: true, element: <Suspense fallback={<PageLoader />}><SuperAdminUserManagement /></Suspense> }],
      },
      {
        path: "/manajemen-siswa",
        element: <MainLayout />,
        children: [{ index: true, element: <Suspense fallback={<PageLoader />}><SuperAdminStudentManagement /></Suspense> }],
      },
      {
        path: "/backup",
        element: <MainLayout />,
        children: [{ index: true, element: <Suspense fallback={<PageLoader />}><BackupManagement /></Suspense> }],
      },
      {
        path: "/laporan",
        element: <MainLayout />,
        children: [{ index: true, element: <Suspense fallback={<PageLoader />}><LaporanManagement /></Suspense> }],
      },
      {
        path: "/tahsin",
        element: <MainLayout />,
        children: [
          { index: true, element: <Suspense fallback={<PageLoader />}><TahsinManagement /></Suspense> },
          { path: "ujian-kenaikan", element: <Suspense fallback={<PageLoader />}><UjianKenaikanManagement /></Suspense> },
          { path: ":id", element: <Suspense fallback={<PageLoader />}><TahsinDetail /></Suspense> },
          { path: ":id/:nis", element: <Suspense fallback={<PageLoader />}><TahsinStudentDetail /></Suspense> },
        ],
      },
      {
        path: "/tahfidz",
        element: <MainLayout />,
        children: [
          { index: true, element: <Suspense fallback={<PageLoader />}><TahfidzManagement /></Suspense> },
          { path: ":id", element: <Suspense fallback={<PageLoader />}><TahfidzDetail /></Suspense> },
          { path: ":id/:nis", element: <Suspense fallback={<PageLoader />}><TahfidzStudentDetail /></Suspense> },
        ],
      },
      {
        path: "/manajemen-halaqoh",
        element: <MainLayout />,
        children: [{ index: true, element: <Suspense fallback={<PageLoader />}><DirekturHalaqohManagement /></Suspense> }],
      },
      {
        path: "/pretest",
        element: <MainLayout />,
        children: [{ index: true, element: <Suspense fallback={<PageLoader />}><DirekturPretestManagement /></Suspense> }],
      },
      {
        path: "/tahun-ajaran",
        element: <MainLayout />,
        children: [{ index: true, element: <Suspense fallback={<PageLoader />}><TahunAjaranManagement /></Suspense> }],
      },
    ],
  },
]);

function AppRouter() {
  return <RouterProvider router={router} />;
}

export default AppRouter;
