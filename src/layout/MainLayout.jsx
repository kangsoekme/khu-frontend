import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useState } from "react";
import { ROLES } from "../utils/constant";
import { ROLES_NAMES } from "../utils/constant";

function MainLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const currentRole = ROLES.MUHASSIN;
  const roleName = ROLES_NAMES[currentRole];

  return (
    <>
      <div className="grid grid-cols-4 grid-rows-12 gap-0 h-screen xl:grid-cols-5 xl:grid-rows-10 2xl:grid-rows-12">
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
        <div className="col-span-4 row-span-11 col-start-1 row-start-2  relative overflow-hidden xl:col-start-2 pl-8 pr-10 py-8">
          {/* responsive mobile sidebar */}
          <div
            className={`bg-neutral-bg absolute shadow-sidebar top-0 left-0  h-full w-25 z-50 xl:hidden transition-transform duration-200 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          >
            <Sidebar role={currentRole} />
          </div>
        </div>
        {/* topbar */}
        <div className="bg-neutral-bg col-span-4 row-start-1 flex items-center justify-end xl:col-start-2">
          <Topbar onLogoClick={toggleSidebar} role={roleName} />
        </div>
      </div>
    </>
  );
}

export default MainLayout;
