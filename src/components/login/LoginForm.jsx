import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Login satuan: satu halaman untuk seluruh role.
// - Tab "Pengelola"  : SUPER_ADMIN / DIREKTUR / GURU → email + password
// - Tab "Wali Santri": WALI → NIS anak + tanggal lahir (DDMMYYYY)
// Tab dikontrol dari parent (LoginPage) agar bisa disinkronkan dengan ?tab= di URL.
export function LoginForm({
  className,
  tab,
  onTabChange,
  onSubmitStaff,
  onSubmitWali,
  isLoadingStaff = false,
  isLoadingWali = false,
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showTanggalLahir, setShowTanggalLahir] = useState(false);

  return (
    <div
      className={cn("flex flex-col justify-between gap-6", className)}
      {...props}
    >
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="p-6 md:p-8">
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Selamat Datang Kembali</h1>
                <p className="text-balance text-muted-foreground">
                  Masuk ke akun KHU Quranic Program Anda
                </p>
              </div>

              <Tabs value={tab} onValueChange={onTabChange}>
                <TabsList className="w-full">
                  <TabsTrigger value="pengelola">Pengelola</TabsTrigger>
                  <TabsTrigger value="wali">Wali Santri</TabsTrigger>
                </TabsList>

                {/* Tab Pengelola: Super Admin / Direktur / Guru (email + password) */}
                <TabsContent value="pengelola" className="mt-4">
                  <form onSubmit={onSubmitStaff} autoComplete="off">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="off"
                          placeholder="m@example.com"
                          required
                          disabled={isLoadingStaff}
                        />
                      </Field>
                      <Field>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="password">Password</FieldLabel>
                        </div>
                        <Input
                          id="password"
                          name="password"
                          autoComplete="new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="********"
                          required
                          disabled={isLoadingStaff}
                        />
                      </Field>
                      <div className="flex items-center gap-3 w-full justify-end">
                        <Checkbox
                          id="show-password"
                          checked={showPassword}
                          onCheckedChange={(checked) => setShowPassword(checked)}
                        />
                        <Label>Tampilkan Password</Label>
                      </div>
                      <Field>
                        <Button type="submit" disabled={isLoadingStaff}>
                          {isLoadingStaff ? "Memproses..." : "Masuk"}
                        </Button>
                      </Field>
                    </FieldGroup>
                  </form>
                </TabsContent>

                {/* Tab Wali Santri: NIS anak + tanggal lahir (DDMMYYYY) */}
                <TabsContent value="wali" className="mt-4">
                  <form onSubmit={onSubmitWali} autoComplete="off">
                    <FieldGroup>
                      <Field>
                        <FieldLabel htmlFor="nis">NIS Siswa</FieldLabel>
                        <Input
                          id="nis"
                          name="nis"
                          type="text"
                          placeholder="Masukkan NIS anak Anda"
                          required
                          disabled={isLoadingWali}
                        />
                      </Field>
                      <Field>
                        <div className="flex items-center">
                          <FieldLabel htmlFor="tanggal-lahir">
                            Tanggal Lahir (DDMMYYYY)
                          </FieldLabel>
                        </div>
                        <Input
                          id="tanggal-lahir"
                          name="password"
                          type={showTanggalLahir ? "text" : "password"}
                          placeholder="Contoh: 17082015"
                          required
                          disabled={isLoadingWali}
                        />
                      </Field>
                      <div className="flex items-center gap-3 w-full justify-end">
                        <Checkbox
                          id="show-tanggal-lahir"
                          checked={showTanggalLahir}
                          onCheckedChange={(checked) =>
                            setShowTanggalLahir(checked)
                          }
                        />
                        <Label>Tampilkan Tanggal</Label>
                      </div>
                      <Field>
                        <Button type="submit" disabled={isLoadingWali}>
                          {isLoadingWali ? "Memproses..." : "Masuk"}
                        </Button>
                      </Field>
                    </FieldGroup>
                  </form>
                </TabsContent>
              </Tabs>
            </FieldGroup>
          </div>
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
  );
}
