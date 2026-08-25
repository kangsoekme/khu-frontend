import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function WaliProtectedRoute() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const role = localStorage.getItem("role");

  if (!isLoggedIn || role !== "WALI") {
    // Login satuan (form pintar): wali cukup isi NIS + tanggal lahir di /login.
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
