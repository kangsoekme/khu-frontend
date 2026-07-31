import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useLoginWaliMutation } from "../../store/api/authApi.js";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export default function WaliLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginWaliApi, { isLoading }] = useLoginWaliMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
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
        <div className={cn("flex flex-col justify-between gap-6")}>
          <Card className="overflow-hidden p-0">
            <CardContent className="grid p-0 md:grid-cols-2">
              <form className="p-6 md:p-8" onSubmit={handleSubmit}>
                <FieldGroup>
                  <div className="flex flex-col items-center gap-2 text-center">
                    <h1 className="text-2xl font-bold">Portal Wali Santri</h1>
                    <p className="text-balance text-muted-foreground">
                      Masuk untuk melihat perkembangan Ananda
                    </p>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="nis">NIS Siswa</FieldLabel>
                    <Input
                      id="nis"
                      name="nis"
                      type="text"
                      placeholder="Masukkan NIS anak Anda"
                      required
                      disabled={isLoading}
                    />
                  </Field>
                  <Field>
                    <div className="flex items-center">
                      <FieldLabel htmlFor="password">
                        Tanggal Lahir (DDMMYYYY)
                      </FieldLabel>
                    </div>
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Contoh: 17082015"
                      required
                      disabled={isLoading}
                    />
                  </Field>
                  <div className="flex items-center gap-3 w-full justify-end">
                    <Checkbox
                      id="show-password"
                      checked={showPassword}
                      onCheckedChange={(checked) => setShowPassword(checked)}
                    />
                    <Label>Tampilkan Tanggal</Label>
                  </div>
                  <Field>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Memproses..." : "Masuk"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
              <div className="relative hidden bg-muted md:block">
                <img
                  src="/khu-gedung.jpeg"
                  alt="Image"
                  className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale opacity-60"
                />
              </div>
            </CardContent>
          </Card>
        </div>
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
