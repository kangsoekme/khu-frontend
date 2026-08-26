import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export function LoginForm({
  className,
  onSubmit,
  isLoading = false,
  ...props
}) {
  const [identifier, setIdentifier] = useState("");
  const [showSecret, setShowSecret] = useState(false);

  const trimmed = identifier.trim();
  const isStaff = trimmed.includes("@");
  const isWali = trimmed.length > 0 && !isStaff && /^\d+$/.test(trimmed);
  const isUnknown = trimmed.length > 0 && !isStaff && !isWali;

  // Label field rahasia adaptif sesuai hasil deteksi identifier.

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    onSubmit({
      identifier: (formData.get("identifier") || "").trim(),
      secret: (formData.get("secret") || "").trim(),
    });
  };

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

              <form onSubmit={handleSubmit} autoComplete="off">
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="identifier">Email</FieldLabel>
                    <Input
                      id="identifier"
                      name="identifier"
                      type="text"
                      autoComplete="off"
                      placeholder="Contoh: guru@khu.sch.id atau 2019012"
                      required
                      disabled={isLoading}
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                    />
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="secret">Password</FieldLabel>
                    <Input
                      id="secret"
                      name="secret"
                      autoComplete="new-password"
                      type={showSecret ? "text" : "password"}
                      placeholder={secretPlaceholder}
                      required
                      disabled={isLoading}
                    />
                  </Field>
                  <div className="flex items-center gap-3 w-full justify-end">
                    <Checkbox
                      id="show-secret"
                      checked={showSecret}
                      onCheckedChange={(checked) => setShowSecret(checked)}
                    />
                    <Label>Tampilkan</Label>
                  </div>
                  <Field>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={isLoading}
                    >
                      {isLoading ? "Memproses..." : "Masuk"}
                    </Button>
                  </Field>
                </FieldGroup>
              </form>
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
