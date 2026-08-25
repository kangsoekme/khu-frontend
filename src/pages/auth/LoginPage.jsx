import { useNavigate, useSearchParams } from "react-router-dom";
import { LoginForm } from "../../components/login/LoginForm.jsx";

import {
  useLoginMutation,
  useLoginWaliMutation,
} from "../../store/api/authApi.js";

import { toast } from "sonner";

// Halaman login satuan untuk seluruh role:
// - Pengelola (SUPER_ADMIN / DIREKTUR / GURU) → email + password → "/"
// - Wali Santri (WALI) → NIS + tanggal lahir → "/wali/dashboard"
// Tab aktif tercermin di URL (?tab=wali) agar link lama /wali/login
// yang di-redirect ke sini tetap mendarat di tab yang benar.
export default function LoginPage() {
  const [loginApi, { isLoading: isLoadingStaff }] = useLoginMutation();
  const [loginWaliApi, { isLoading: isLoadingWali }] = useLoginWaliMutation();

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") === "wali" ? "wali" : "pengelola";

  const handleTabChange = (value) => {
    setSearchParams(value === "wali" ? { tab: "wali" } : {}, { replace: true });
  };

  const handleSubmitStaff = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await loginApi({ email, password }).unwrap();

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("role", response.data.role);
      localStorage.setItem("nama", response.data.nama);

      localStorage.setItem("isLoggedIn", "true");

      const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
      localStorage.setItem("session_expires_at", expiresAt.toString());

      toast.success("Login sukses, Selamat Datang..");

      navigate("/");
    } catch (error) {
      console.log("Error login : ", error);

      // RTK Query error: { status, data: { message } } — akses via error.data?.message.
      // Semua error login (password salah 401, rate-limited 429) ditampilkan via toast.
      const serverMessage = error.data?.message || "Email atau password salah";
      toast.error(serverMessage);
    }
  };

  const handleSubmitWali = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const nis = formData.get("nis");
    const password = formData.get("password");

    try {
      const response = await loginWaliApi({ nis, password }).unwrap();

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("nama", response.data.nama);
      localStorage.setItem("nis", response.data.nis);
      localStorage.setItem("isLoggedIn", "true");

      const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
      localStorage.setItem("session_expires_at", expiresAt.toString());

      toast.success("Login sukses, Selamat Datang..");
      navigate("/wali/dashboard");
    } catch (error) {
      console.log("Error login : ", error);
      toast.error(error.data?.message || "NIS atau Tanggal Lahir salah");
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 relative">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm
          tab={tab}
          onTabChange={handleTabChange}
          onSubmitStaff={handleSubmitStaff}
          onSubmitWali={handleSubmitWali}
          isLoadingStaff={isLoadingStaff}
          isLoadingWali={isLoadingWali}
        />
      </div>
      <div className="absolute bottom-8 w-full flex justify-center">
        <img
          src="/khu.png"
          alt="Khoiru Ummah"
          className="h-8 w-auto opacity-70 hover:opacity-100 transition-opacity"
        />
      </div>
    </div>
  );
}
