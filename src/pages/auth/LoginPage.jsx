import { useNavigate } from "react-router-dom";
import { LoginForm } from "../../components/login/LoginForm.jsx";
import { useState } from "react";

import { AlertCircleIcon } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useLoginMutation } from "../../store/api/authApi.js";

export default function LoginPage() {
  const [errorMsg, setErrorMsg] = useState("");

  const [loginApi, { isLoading }] = useLoginMutation();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const response = await loginApi({ email, password }).unwrap();

      localStorage.setItem("token", response.data.token);

      localStorage.setItem("role", response.data.role);
      localStorage.setItem("nama", response.data.nama);

      localStorage.setItem("isLoggedIn", "true");

      navigate("/");
    } catch (error) {
      console.log("Error login : ", error);

      const serverMessage = error.data?.message || "Email atau password salah";
      setErrorMsg(serverMessage);
    }
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        {errorMsg && (
          <Alert variant="destructive" className="max-w-md">
            <AlertCircleIcon />
            <AlertTitle>Login Failed</AlertTitle>
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        <LoginForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
}
