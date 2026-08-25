import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function WaliProtectedRoute() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  if (!isLoggedIn || role !== "WALI") {
    // Login satuan: wali mendarat di tab "Wali Santri" halaman /login.
    return <Navigate to="/login?tab=wali" replace />;
  }

  return <Outlet />;
}
