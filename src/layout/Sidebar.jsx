import { FaHome } from "react-icons/fa";
import { getSidebarMenuByRole, LOGOUT_MENU_ITEM } from "./sidebarConfig";
import { NavLink } from "react-router-dom";

function Sidebar({ role, onLogout }) {
  const menuItems = getSidebarMenuByRole(role);

  const backupItem = menuItems.find(
    (item) =>
      item.label.toLowerCase() === "pencadangan" ||
      item.path.includes("pencadangan"),
  );

  const mainMenuItems = menuItems.filter((item) => item !== backupItem);

  const LogoutIcon = LOGOUT_MENU_ITEM.icon;

  return (
    <>
      {
        <div className="p-4 flex flex-col justify-between h-full xl:p-0">
          <nav className="flex flex-col gap-9 xl:items-start xl:gap-5">
            {mainMenuItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={`group flex flex-col gap-2 items-center h-17 justify-center rounded-sm xl:flex-row xl:gap-4 xl:h-10`}
                >
                  <Icon className="font-normal text-neutral-textmuted xl:text-base" />
                  <span className="text-xs text-center xl:text-base">
                    {item.label}
                  </span>
                </NavLink>
              );
            })}
          </nav>
          <div className="flex flex-col gap-9 xl:items-start xl:gap-5">
            {backupItem && (
              <NavLink
                to={backupItem.path}
                className={`group flex flex-col gap-2 items-center h-17 justify-center rounded-sm xl:flex-row xl:gap-4 xl:h-10`}
              >
                <backupItem.icon className="font-normal text-neutral-textmuted xl:text-base" />
                <span className="text-xs text-center xl:text-base">
                  {backupItem.label}
                </span>
              </NavLink>
            )}

            <button
              onClick={onLogout}
              className="group flex flex-col gap-2 items-center h-17 justify-center rounded-sm xl:flex-row xl:gap-4 xl:h-10"
            >
              <LOGOUT_MENU_ITEM.icon className="font-normal text-neutral-textmuted xl:text-base" />
              <span className="text-xs text-center xl:text-base">
                {LOGOUT_MENU_ITEM.label}
              </span>
            </button>
          </div>
        </div>
      }
    </>
  );
}

export default Sidebar;
