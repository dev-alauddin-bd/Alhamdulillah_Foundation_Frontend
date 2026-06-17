"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Mail, Lock } from "lucide-react";
import { useSignUpUserMutation, useSendRegistrationOtpMutation } from "@/redux/features/auth/authApi";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/features/auth/authSlice";
import { z } from "zod";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const router = useRouter();
  const [signUpUser, { isLoading: isRegistering }] = useSignUpUserMutation();
  const [sendRegistrationOtp, { isLoading: isSendingOtp }] = useSendRegistrationOtpMutation();
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
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
      firstName: z.string().min(1, t("auth.register.firstNameRequired", { defaultValue: "First Name is required" })),
      lastName: z.string().min(1, t("auth.register.lastNameRequired", { defaultValue: "Last Name is required" })),
      email: z.string().email(t("auth.register.invalidEmail", { defaultValue: "Invalid email address" })),
      password: z.string().min(6, t("auth.register.passwordLength", { defaultValue: "Password must be at least 6 characters" })),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("auth.register.passwordsMismatch", { defaultValue: "Passwords do not match" }),
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

    if (!otpSent) {
      // Step 1: Send OTP
      try {
        await sendRegistrationOtp(formData.email).unwrap();
        setOtpSent(true);
        toast.info(t("auth.register.otpSentToast", { defaultValue: "An OTP has been sent to your email." }));
      } catch (err: any) {
        toast.error(err?.data?.message || t("auth.register.otpSendFailedToast", { defaultValue: "Failed to send OTP." }));
      }
      return;
    }

    // Step 2: Register with OTP
    if (!otpCode || otpCode.length !== 6) {
        toast.error(t("auth.register.enterValidOtpToast", { defaultValue: "Please enter a valid 6-digit OTP" }));
        return;
    }

    try {
      const res = await signUpUser({
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        otpCode: otpCode,
      }).unwrap();

      dispatch(
        setUser({
          user: res?.data?.user,
          accessToken: res?.data?.accessToken,
        }),
      );

      toast.success(res?.message || "Registration successful 🎉");
      router.push("/dashboard/membership");
    } catch (err: any) {
      toast.error(err?.data?.message || t("auth.register.otpVerificationFailedToast", { defaultValue: "Invalid or expired OTP" }));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center mt-12 py-12 px-4">
      <Card className="w-full max-w-2xl shadow-2xl rounded-[2.5rem] border border-border/50 overflow-hidden bg-background/80 backdrop-blur-xl">
  
        {/* ===== LOGO + LANGUAGE ===== */}
        <div className="p-12 flex flex-col items-center gap-6">
          <div className="h-24 w-24 relative rounded-3xl bg-primary/10 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="Logo"
              fill
              className="object-contain p-3"
            />
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-black tracking-tight mb-2">
              {t("auth.register.registerTitle", { defaultValue: "Join Our Mission" })}
            </h1>
            <p className="text-muted-foreground">{t("auth.register.becomeMember", { defaultValue: "Become a part of our foundation today" })}</p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-8">
            <div className="space-y-6">
              {!otpSent ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t("auth.register.firstName")}</Label>
                        <div className="relative">
                          <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            name="firstName"
                            value={formData.firstName}
                            placeholder={t("auth.register.firstNamePlaceholder", { defaultValue: "First Name" })}
                            onChange={handleChange}
                            className="h-14 pl-12 rounded-2xl bg-foreground/5 border-border/50 focus:border-primary/50 dark:bg-white/5 dark:border-white/10"
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t("auth.register.lastName")}</Label>
                        <div className="relative">
                          <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <Input
                            name="lastName"
                            value={formData.lastName}
                            placeholder={t("auth.register.lastNamePlaceholder", { defaultValue: "Last Name" })}
                            onChange={handleChange}
                            className="h-14 pl-12 rounded-2xl bg-foreground/5 border-border/50 focus:border-primary/50 dark:bg-white/5 dark:border-white/10"
                            required
                          />
                        </div>
                      </div>
                  </div>
                

                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t("auth.register.email")}</Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder={t("auth.register.emailPlaceholder", { defaultValue: "Type your email" })}
                        onChange={handleChange}
                        className="h-14 pl-12 rounded-2xl bg-foreground/5 border-border/50 focus:border-primary/50 dark:bg-white/5 dark:border-white/10"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t("auth.register.password")}</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="password"
                          name="password"
                          placeholder={t("auth.register.passwordPlaceholder", { defaultValue: "Min 6 characters" })}
                          value={formData.password}
                          onChange={handleChange}
                          className="h-14 pl-12 rounded-2xl bg-foreground/5 border-border/50 focus:border-primary/50 dark:bg-white/5 dark:border-white/10"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2"> {t("auth.register.confirmPassword")}</Label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="password"
                          placeholder={t("auth.register.confirmPasswordPlaceholder", { defaultValue: "Repeat password" })}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="h-14 pl-12 rounded-2xl bg-foreground/5 border-border/50 focus:border-primary/50 dark:bg-white/5 dark:border-white/10"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                    <div className="text-center p-6 bg-primary/5 rounded-[2rem] border border-primary/10">
                        <Mail className="mx-auto text-primary mb-3" size={32} />
                        <p className="text-sm font-bold text-primary">{t("auth.register.otpVerification", { defaultValue: "Email Verification" })}</p>
                        <p className="text-[10px] text-muted-foreground mt-1">{t("auth.register.otpSentMessage", { email: formData.email, defaultValue: `An OTP code has been sent to your email ${formData.email}` })}</p>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">{t("auth.register.enterOtp", { defaultValue: "Enter OTP Code" })}</Label>
                        <Input
                            placeholder={t("auth.register.otpPlaceholder", { defaultValue: "6 Digit Code" })}
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="h-16 text-center text-2xl font-black tracking-[0.5em] rounded-2xl bg-foreground/5 border-border/50 focus:border-primary/50 dark:bg-white/5 dark:border-white/10"
                            required
                        />
                    </div>
                    <Button 
                        variant="ghost" 
                        onClick={() => setOtpSent(false)}
                        className="w-full text-[10px] font-black uppercase tracking-widest"
                    >
                        {t("auth.register.changeInfo", { defaultValue: "Change Information" })}
                    </Button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isRegistering || isSendingOtp}
              className="w-full h-16 text-lg font-black bg-primary hover:bg-primary/90 shadow-glow rounded-2xl text-primary-foreground"
            >
              {isSendingOtp || isRegistering ? (
                <div className="flex items-center gap-3 justify-center">
                  <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span>
                  {t("auth.register.pleaseWait", { defaultValue: "Please wait..." })}
                </div>
              ) : (
                !otpSent ? t("auth.register.joinFoundation", { defaultValue: "CREATE ACCOUNT" }) : t("auth.register.verifyAndSignUp", { defaultValue: "Verify and Sign Up" })
              )}
            </Button>

            <p className="text-center text-sm text-muted-foreground mt-8">
              {t("auth.register.alreadyHaveAccount", { defaultValue: "Already have an account?" })}{" "}
              <Link href="/login" className="font-black text-primary hover:underline uppercase tracking-widest text-xs">
                {t("auth.register.signIn", { defaultValue: "Sign In" })}
              </Link>
            </p>
          </form>
        </div>
      </Card>
    </div>
  );
}
