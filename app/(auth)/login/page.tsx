"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AlertCircle, Lock, Languages } from "lucide-react";
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
      toast.success(res?.message);

      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.data?.message || t("auth.invalid"));
      toast.error(err?.data?.message || t("auth.invalid"));
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
              {t("auth.login.loginTitle")}
            </h1>
            <p className="text-sm text-foreground/60 mt-1">
              {t("auth.login.loginSubtitle")}
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
              placeholder="Type your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          <div className="space-y-1.5">
            <Label>{t("auth.login.password")}</Label>
            <Input
              type="password"
              placeholder="Type your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl"
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl font-semibold bg-gradient-to-r from-primary to-emerald-600 shadow-lg shadow-primary/25"
          >
            {isLoading ? t("auth.login.signingIn") : t("auth.login.signIn")}
          </Button>
        </form>
        
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border/50" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-foreground/50">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          type="button"
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`;
          }}
          className="w-full h-11 rounded-xl font-medium border-border/50 hover:bg-muted/50"
        >
          <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
            <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
          </svg>
          Continue with Google
        </Button>

        {/* ===== FOOTER ===== */}
        <div className="mt-8 text-center text-sm text-foreground/60">
          {t("auth.login.noAccount")}{" "}
          <Link
            href="/register"
            className="font-semibold text-primary hover:underline"
          >
            {t("auth.login.apply")}
          </Link>
        </div>


      </Card>
    </div>
  );
}