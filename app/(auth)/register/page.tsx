"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowRight, UserPlus, ShieldCheck, Mail, Lock } from "lucide-react";
import { useSignUpUserMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import { z } from "zod";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [signUpUser, { isLoading }] = useSignUpUserMutation();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const registerSchema = z
    .object({
      firstName: z.string().min(1, "First Name is required"),
      lastName: z.string().min(1, "Last Name is required"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validation = registerSchema.safeParse(formData);

    if (!validation.success) {
      const firstError = validation.error.errors[0]?.message || "Invalid form data";
      toast.error(firstError);
      return;
    }

    try {
      const res = await signUpUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }).unwrap();

      dispatch(
        setUser({
          user: res?.data?.user,
          accessToken: res?.data?.accessToken,
        }),
      );

      toast.success(res?.message || "Registration successful 🎉");

      // ✅ Immediate redirect (toast will still show)
      router.push("/dashboard/membership");
    } catch (err: any) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-12">
      <Card className="w-full shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-3xl border-none overflow-hidden  bg-card">
  
  {/* ===== LOGO + LANGUAGE ===== */}
                      <div className=" flex flex-col items-center gap-4">
                     
                          {/* LOGO */}
                          <div className="h-24 w-24 relative rounded-2xl bg-primary/10 flex items-center justify-center">
                            <Image
                              src="/logo.png"
                              alt="Logo"
                              fill
                              className="object-contain p-3"
                            />
                          </div>
              
                 
                        <div className="text-center">
                          <h1 className="text-2xl font-bold tracking-tight">
                            {t("auth.register.registerTitle")}
                          </h1>
                        </div>
                      </div>
              
        {/* Right Side - Form */}
        <div className="flex p-8 bg-card">
    
          

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t("auth.register.firstName")}</Label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="firstName"
                        value={formData.firstName}
                        placeholder="First Name"
                        onChange={handleChange}
                        className="h-12 pl-10 rounded-xl border-input bg-background/50 focus:bg-background transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t("auth.register.lastName")}</Label>
                    <div className="relative">
                      <UserPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        name="lastName"
                        value={formData.lastName}
                        placeholder="Last Name"
                        onChange={handleChange}
                        className="h-12 pl-10 rounded-xl border-input bg-background/50 focus:bg-background transition-all font-medium"
                        required
                      />
                    </div>
                  </div>
              </div>
             

              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t("auth.register.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Type your email"
                    onChange={handleChange}
                    className="h-12 pl-10 rounded-xl border-input bg-background/50 focus:bg-background transition-all font-medium"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground">{t("auth.register.password")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      name="password"
                      placeholder="Type your password"
                      value={formData.password}
                      onChange={handleChange}
                      className="h-12 pl-10 rounded-xl border-input bg-background/50 focus:bg-background transition-all font-medium"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground"> {t("auth.register.confirmPassword")}</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="password"
                      placeholder="Type your confirm password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="h-12 pl-10 rounded-xl border-input bg-background/50 focus:bg-background transition-all font-medium"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border/50" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-foreground/50">
                  Or join with
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              type="button"
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/google`;
              }}
              className="w-full h-12 rounded-xl font-medium border-border/50 hover:bg-muted/50 mb-4"
            >
              <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
              </svg>
              Continue with Google
            </Button>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 text-base font-black bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-2xl transition-all hover:scale-[1.02] active:scale-95"
            >
              {isLoading ? t("auth.register.creatingAccount") : t("auth.register.joinFoundation")}
            </Button>

            <p className="text-center text-sm font-bold text-muted-foreground mt-6">
              {t("auth.register.alreadyHaveAccount")}{" "}
              <Link href="/login" className="text-primary hover:underline">
                {t("auth.register.signIn")}
              </Link>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
}
