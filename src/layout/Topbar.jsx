import { useLocation, Link } from "react-router-dom";
import { FaChevronRight, FaHome } from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { useGetHalaqohQuery } from "../store/api/halaqohApi";
import { useGetStudentQuery } from "../store/api/studentsApi";

function Topbar({ onLogoClick, role, title, nama }) {
  const location = useLocation();

  const pathnames = location.pathname
    .split("/")
    .filter((x) => x && x.toLowerCase() !== "beranda");

  const idKelompok = pathnames.find((val) => val.length > 20 && isNaN(val));
  const nisSiswa = pathnames.find(
    (val, idx) =>
      (idx > 0 && !isNaN(val) && val.length >= 5) ||
      (idx === 2 && (pathnames[0] === "tahsin" || pathnames[0] === "tahfidz")),
  );

  const { data: halaqohRes } = useGetHalaqohQuery(idKelompok, {
    skip: !idKelompok,
  });
  const { data: studentRes } = useGetStudentQuery(nisSiswa, {
    skip: !nisSiswa,
  });

  const namaHalaqoh = halaqohRes?.data?.nama_halaqoh || halaqohRes?.data?.nama;
  const namaSiswa = studentRes?.data?.nama;

  const getBreadcrumbLabel = (value, index) => {
    if (value === idKelompok) {
      return namaHalaqoh || "Detail Kelompok";
    }
    if (value === nisSiswa || (!isNaN(value) && value.length >= 5)) {
      return namaSiswa || "Detail Siswa";
    }
    const customMap = {
      tahsin: "Tahsin Qiraah",
      tahfidz: "Tahfidz Quran",
      "manajemen-user": "Manajemen User",
      "manajemen-siswa": "Manajemen Siswa",
      "manajemen-halaqoh": "Manajemen Halaqoh",
      "manajemen-laporan": "Pusat Laporan",
      pretest: "Ujian Placement",
      "ujian-kenaikan": "Ujian Kenaikan Jilid",
      munaqosyah: "Pengajuan Munaqosyah",
      backup: "Pencadangan",
    };
    return (
      customMap[value] ||
      value.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    );
  };

  return (
    <>
      <div className="flex justify-between items-center w-full h-full px-5 shadow xl:shadow-none xl:px-8 xl:pr-10 bg-neutral-bg">
        {/* Tombol menu mobile */}
        <div
          className="flex items-center justify-center lg:hidden cursor-pointer"
          onClick={onLogoClick}
        >
          <GiHamburgerMenu size={22} className="text-neutral-700" />
        </div>
        <div
          className="px-8 justify-center hidden lg:flex xl:hidden cursor-pointer"
          onClick={onLogoClick}
        >
          <img src="src/assets/img/khu.png" alt="Logo" className="h-11" />
        </div>
        {/* Judul Halaman di Atas Breadcrumb */}
        <div className="hidden xl:flex flex-col justify-center py-1">
          <h1 className="text-lg font-bold text-neutral-800 tracking-tight leading-none mb-1.5">
            {title}
          </h1>
          <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-medium">
            <Link
              to="/"
              className="hover:text-primary flex items-center gap-1 text-neutral-600 transition-colors"
            >
              <FaHome className="mb-0.5 text-neutral-400" /> Beranda
            </Link>
            {pathnames.map((value, index) => {
              const last = index === pathnames.length - 1;
              const to = `/${pathnames.slice(0, index + 1).join("/")}`;
              const label = getBreadcrumbLabel(value, index);
              return (
                <div key={to} className="flex items-center space-x-1.5">
                  <FaChevronRight size={9} className="text-neutral-300" />
                  {last ? (
                    <span className="font-semibold text-primary capitalize">
                      {label}
                    </span>
                  ) : (
                    <Link
                      to={to}
                      className="hover:text-primary text-neutral-600 capitalize transition-colors"
                    >
                      {label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        {/* Profil User */}
        <div className="flex items-center gap-4">
          <div className="hidden flex-col gap-0 items-end lg:block">
            <h3 className="text-sm text-right font-semibold text-neutral-800">
              {nama || "Pengguna"}
            </h3>
            <p className="text-[11px] text-right text-neutral-500 font-medium capitalize">
              {role}
            </p>
          </div>
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(nama || "Pengguna")}&background=0D8ABC&color=fff`}
            alt="Avatar"
            className="w-9 h-9 rounded-full border border-border shadow-xs"
          />
        </div>
      </div>
    </>
  );
}

export default Topbar;
