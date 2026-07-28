import React from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function WaliProtectedRoute() {
  const isLoggedIn = sessionStorage.getItem("isLoggedIn");
  const role = sessionStorage.getItem("role");

  if (!isLoggedIn || role !== "WALI") {
    return <Navigate to="/wali/login" replace />;
  }

  return <Outlet />;
}
