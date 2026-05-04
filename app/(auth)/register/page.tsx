"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowRight, UserPlus, ShieldCheck, Mail, Lock } from "lucide-react";
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

    if (!otpSent) {
      // Step 1: Send OTP
      try {
        await sendRegistrationOtp(formData.email).unwrap();
        setOtpSent(true);
        toast.info("আপনার ইমেইলে একটি ওটিপি পাঠানো হয়েছে।");
      } catch (err: any) {
        toast.error(err?.data?.message || "ওটিপি পাঠাতে ব্যর্থ হয়েছে।");
      }
      return;
    }

    // Step 2: Register with OTP
    if (!otpCode || otpCode.length !== 6) {
        toast.error("সঠিক ৬ ডিজিটের ওটিপি দিন");
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
      toast.error(err?.data?.message || "ওটিপি ভুল বা মেয়াদ শেষ হয়ে গেছে");
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
            <p className="text-muted-foreground">Become a part of our foundation today</p>
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
                            placeholder="First Name"
                            onChange={handleChange}
                            className="h-14 pl-12 rounded-2xl glass border-white/10"
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
                            placeholder="Last Name"
                            onChange={handleChange}
                            className="h-14 pl-12 rounded-2xl glass border-white/10"
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
                        placeholder="Type your email"
                        onChange={handleChange}
                        className="h-14 pl-12 rounded-2xl glass border-white/10"
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
                          placeholder="Min 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          className="h-14 pl-12 rounded-2xl glass border-white/10"
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
                          placeholder="Repeat password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="h-14 pl-12 rounded-2xl glass border-white/10"
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
                        <p className="text-sm font-bold text-primary">ইমেইল ভেরিফিকেশন</p>
                        <p className="text-[10px] text-muted-foreground mt-1">আপনার {formData.email} ইমেইলে একটি কোড পাঠানো হয়েছে</p>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-2">ওটিপি কোড দিন</Label>
                        <Input
                            placeholder="৬ ডিজিট কোড"
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            className="h-16 text-center text-2xl font-black tracking-[0.5em] rounded-2xl glass border-white/10"
                            required
                        />
                    </div>
                    <Button 
                        variant="ghost" 
                        onClick={() => setOtpSent(false)}
                        className="w-full text-[10px] font-black uppercase tracking-widest"
                    >
                        তথ্য পরিবর্তন করুন
                    </Button>
                </div>
              )}
            </div>

            <Button
              type="submit"
              disabled={isRegistering || isSendingOtp}
              className="w-full h-16 text-lg font-black bg-primary hover:bg-primary/90 shadow-glow rounded-2xl"
            >
              {isSendingOtp || isRegistering ? (
                <div className="flex items-center gap-3">
                  <span className="animate-spin h-5 w-5 border-2 border-white/20 border-t-white rounded-full"></span>
                  একটু অপেক্ষা করুন...
                </div>
              ) : (
                !otpSent ? t("auth.register.joinFoundation", { defaultValue: "CREATE ACCOUNT" }) : "ভেরিফাই এবং সাইনআপ"
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
