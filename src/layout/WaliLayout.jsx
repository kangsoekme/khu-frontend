import Topbar from "./Topbar";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../store/api/authApi.js";

function WaliLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  const getPageTitle = (pathname) => {
    return "Portal Wali Santri";
  };

  const pageTitle = getPageTitle(location.pathname);
  const currentRole = localStorage.getItem("role") || "WALI";
  const rawName = localStorage.getItem("nama") || "Wali Santri";
  const currentName = rawName.split(" ").slice(0, 2).join(" ");

  const handleLogout = async () => {
    // SEC-6: panggil endpoint logout agar token dicabut di server
    try {
      await logout();
    } catch (e) {
      // abaikan error — tetap bersihkan lokal
    }
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    localStorage.removeItem("nama");
    localStorage.removeItem("nis");
    navigate("/login");
  };

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* topbar */}
        <div className="bg-neutral-bg h-[calc(100vh/12)] flex items-center shadow-sm relative z-20">
          <div className="px-4 xl:px-8 w-full flex justify-between items-center">
            <div className="flex items-center gap-4">
              <img
                src="/khu.png"
                alt="Logo"
                className="h-8 xl:h-10"
              />
              <h1 className="text-lg xl:text-xl font-bold text-primary-800 hidden md:block">
                {pageTitle}
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{currentName}</p>
                <p className="text-xs text-neutral-textmuted">Wali Santri</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-50 text-red-600 px-4 py-2 rounded-md text-sm font-medium hover:bg-red-100 transition-colors cursor-pointer"
              >
                Keluar
              </button>
            </div>
          </div>
        </div>

        {/* main content */}
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-8">
          <Outlet />
        </div>
      </div>
    </>
  );
}

export default WaliLayout;
