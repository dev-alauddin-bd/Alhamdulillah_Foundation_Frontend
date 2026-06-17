"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle } from "lucide-react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useLoginUserMutation } from "@/redux/features/auth/authApi";
import { setUser } from "@/redux/features/auth/authSlice";
import { toast } from "react-toastify";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser({ email, password }).unwrap();

      dispatch(
        setUser({
          user: res?.data?.user,
          accessToken: res?.data?.accessToken,
        })
      );    
      toast.success(res?.message || t("auth.login.successMessage", { defaultValue: "Login successful" }));
      router.push("/dashboard");
    } catch (err: any) {
      const errMsg = err?.data?.message || t("auth.invalid");
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-md p-8 rounded-3xl border border-border/50 bg-background/80 backdrop-blur-xl shadow-2xl">

        {/* ===== LOGO + LANGUAGE ===== */}
        <div className="mb-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-3">
            {/* LOGO */}
            <div className="h-24 w-24 relative rounded-2xl bg-primary/10 flex items-center justify-center">
              <Image
                src="/logo.png"
                alt="Logo"
                fill
                className="object-contain p-3"
              />
            </div>
          </div>

          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              {t("auth.login.loginTitle", { defaultValue: "Welcome Back" })}
            </h1>
            <p className="text-sm text-foreground/60 mt-1">
              {t("auth.login.loginSubtitle", { defaultValue: "Please enter your details to sign in" })}
            </p>
          </div>
        </div>

        {/* ===== ERROR ===== */}
        {error && (
          <div className="mb-6 p-4 rounded-xl border border-destructive/30 bg-destructive/10 flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* ===== FORM ===== */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label>{t("auth.login.email")}</Label>
            <Input
              type="email"
              placeholder={t("auth.login.emailPlaceholder", { defaultValue: "Type your email" })}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 bg-foreground/5 dark:bg-white/5 border-border/50 focus:border-primary/50 rounded-xl"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("auth.login.password")}</Label>
            <Input
              type="password"
              placeholder={t("auth.login.passwordPlaceholder", { defaultValue: "Type your password" })}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 bg-foreground/5 dark:bg-white/5 border-border/50 focus:border-primary/50 rounded-xl"
              required
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/25"
          >
            {isLoading ? t("auth.login.signingIn", { defaultValue: "Signing in..." }) : t("auth.login.signIn")}
          </Button>
        </form>
        
        <div className="mt-8 text-center text-sm text-foreground/60">
          {t("auth.login.noAccount", { defaultValue: "Don't have an account?" })}{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            {t("auth.login.apply", { defaultValue: "Apply Now" })}
          </Link>
        </div>
      </Card>
    </div>
  );
}