import { GiHamburgerMenu } from "react-icons/gi";

function Topbar({ onLogoClick, role }) {
  return (
    <>
      <div className="flex justify-between w-full h-full px-5  shadow xl:shadow-none xl:px-8 xl:pr-10">
        <div
          className="flex items-center justify-center lg:hidden"
          onClick={onLogoClick}
        >
          <img src="src/assets/img/khu.png" alt="" srcset="" className="h-7" />
        </div>
        <div
          className="px-8 justify-center hidden lg:flex xl:hidden"
          onClick={onLogoClick}
        >
          <img src="src/assets/img/khu.png" alt="" srcset="" className="h-11" />
        </div>
        <div className="hidden xl:flex xl:items-center">
          <h1 className="xl:text-xl 2xl:text-2xl font-semibold">
            Homepage Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-5">
          <div className="hidden flex-col gap-0 items-end lg:block">
            <h3 className="text-base sm font-semibold">Ahmad Fulan</h3>
            <p className="text-xs text-right">{role}</p>
          </div>
          <img
            src="https://ui-avatars.com/api/?name=John+Doe"
            alt=""
            srcset=""
            className="w-10 rounded-full"
          />
        </div>
      </div>
    </>
  );
}

export default Topbar;
