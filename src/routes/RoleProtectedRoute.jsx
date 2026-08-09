import { Navigate, Outlet } from "react-router-dom";

export default function RoleProtectedRoute({ allowedRoles }) {
  const role = localStorage.getItem("role");
  
  if (!allowedRoles.includes(role)) {
    return <Navigate to="/beranda" replace />;
  }
  
  return <Outlet />;
}
