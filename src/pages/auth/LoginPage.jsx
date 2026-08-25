import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/login/LoginForm.jsx";

import {
  useLoginMutation,
  useLoginWaliMutation,
} from "../../store/api/authApi.js";

import { toast } from "sonner";

// Halaman login satuan "form pintar" — satu form untuk seluruh role.
// Deteksi di frontend: identifier mengandung "@" → endpoint pengelola
// (email + password → "/"), selain itu dianggap NIS → endpoint wali
// (NIS + tanggal lahir → "/wali/dashboard"). Backend tetap 2 endpoint.
export default function LoginPage() {
  const [loginApi, { isLoading: isLoadingStaff }] = useLoginMutation();
  const [loginWaliApi, { isLoading: isLoadingWali }] = useLoginWaliMutation();

  const navigate = useNavigate();

  const isLoading = isLoadingStaff || isLoadingWali;

  const saveSession = (data, { nis = null } = {}) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("role", data.role);
    localStorage.setItem("nama", data.nama);
    localStorage.setItem("isLoggedIn", "true");

    const expiresAt = Date.now() + 12 * 60 * 60 * 1000;
    localStorage.setItem("session_expires_at", expiresAt.toString());

    if (nis) {
      localStorage.setItem("nis", nis);
    } else {
      // Bersihkan nis basi dari sesi wali sebelumnya di browser yang sama.
      localStorage.removeItem("nis");
    }
  };

  const handleSubmit = async ({ identifier, secret }) => {
    const isStaff = identifier.includes("@");

    try {
      if (isStaff) {
        const response = await loginApi({
          email: identifier,
          password: secret,
        }).unwrap();

        saveSession(response.data);

        toast.success("Login sukses, Selamat Datang..");

        navigate("/");
      } else {
        const response = await loginWaliApi({
          nis: identifier,
          password: secret,
        }).unwrap();

        saveSession(response.data, { nis: response.data.nis });

        toast.success("Login sukses, Selamat Datang..");
        navigate("/wali/dashboard");
      }
    } catch (error) {
      console.log("Error login : ", error);

      // RTK Query error: { status, data: { message } } — akses via error.data?.message.
      // Fallback menyesuaikan mode yang terdeteksi agar tetap spesifik.
      const fallback = isStaff
        ? "Email atau password salah"
        : "NIS atau Tanggal Lahir salah";
      toast.error(error.data?.message || fallback);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10 relative">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
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
