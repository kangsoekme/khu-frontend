import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { ROLES } from "../utils/constant";
import { ROLES_NAMES } from "../utils/constant";
import { Outlet } from "react-router-dom";

function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const currentRole = ROLES.SUPER_ADMIN;
  const roleName = ROLES_NAMES[currentRole];

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-12 gap-0 h-dvh xl:grid-cols-6 xl:grid-rows-10 2xl:grid-rows-12">
        <div className="hidden xl:grid xl:grid-rows-10 2xl:grid-rows-12 h-screen shadow-sidebar z-30">
          {/* logo native desktop */}
          <div className="hidden xl:flex xl:items-center xl:px-8 xl:pl-10">
            <img
              src="src/assets/img/khu.png"
              alt=""
              srcset=""
              className="xl:h-9 2xl:h-11"
            />
          </div>
          {/* sidebar native desktop */}
          <div className="row-span-11 col-start-1 row-start-2 hidden xl:block xl:p-8 xl:pl-10 ">
            <Sidebar role={currentRole} />
          </div>
        </div>

        {/* main content */}
        <div className="col-span-5 row-span-11 col-start-1 row-start-2 overflow-y-auto xl:col-start-2 px-5 py-8 xl:px-8 xl:py-8">
          {isSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/30 z-40 xl-hidden"
              onClick={closeSidebar}
            />
          )}

          {/* responsive mobile sidebar */}
          <div className="grid grid-rows-12 grid-cols-1">
            <div
              className={` bg-neutral-bg fixed flex flex-col shadow-sidebar top-0 left-0 h-full w-50 px-8 pl-6 z-50 xl:hidden transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
              <div className=" flex items-center  h-[calc(100vh/12)] shrink-0">
                <img
                  src="src/assets/img/khu.png"
                  alt=""
                  srcset=""
                  className="h-8 xl:h-9 2xl:h-11"
                />
              </div>
              <div className="flex-1 min-h-0 overflow-y-auto ">
                <Sidebar role={currentRole} />
              </div>
            </div>
          </div>
          <h1 className="text-xl xl:hidden font-semibold">
            Homepage Dashboard
          </h1>
          <br className="xl:hidden" />
          <Outlet />
        </div>
        {/* topbar */}
        <div className="bg-neutral-bg col-span-5 row-start-1 flex items-center justify-end xl:col-start-2">
          <Topbar onLogoClick={toggleSidebar} role={roleName} />
        </div>
      </div>
    </>
  );
}

export default MainLayout;
