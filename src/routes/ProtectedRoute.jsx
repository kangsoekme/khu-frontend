import React from "react";
import { Navigate, Outlet } from "react-router-dom";

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

  return <Outlet />;
}
