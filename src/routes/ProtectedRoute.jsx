import { Navigate, Outlet } from "react-router-dom";
import { ROLES } from "../utils/constant";

export default function ProtectedRoute() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // WALI-2: cegah wali mengakses route admin (menyebabkan error boundary crash)
  // Wali hanya boleh mengakses portal /wali/*, bukan / (admin)
  if (role === "WALI") {
    return <Navigate to="/wali" replace />;
  }

  // Cegah role tidak dikenal/kosong mengakses halaman admin.
  // (sebelumnya RoleBasedHomepage default ke SUPER_ADMIN — celah akses).
  if (!Object.values(ROLES).includes(role)) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
