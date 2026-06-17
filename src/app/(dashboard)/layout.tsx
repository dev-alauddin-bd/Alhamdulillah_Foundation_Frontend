"use client";

//==================================================================================
//                               DASHBOARD LAYOUT
//==================================================================================

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { IUser, selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useTranslation } from "react-i18next";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group";
import Image from "next/image";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const { i18n } = useTranslation();
  const { theme, setTheme } = useTheme();

  const lang = i18n.language as "en" | "bn";

  //======================   SECURITY ENFORCEMENT   ===============================
  // Handled by Middleware & SessionSync now
  useEffect(() => {
     // Optional: language init or theme logic here
  }, []);

  const changeLang = (value: "en" | "bn") => {
    i18n.changeLanguage(value);
    localStorage.setItem("lang", value);
  };

  return (
    <SidebarProvider>
      <AppSidebar user={user as IUser} />

      <SidebarInset className="flex flex-col min-h-screen overflow-hidden">
        {/* ====================== HEADER ====================== */}
        <header className="flex h-16 items-center justify-between border-b px-4 md:px-6 bg-background/80 backdrop-blur-md sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <div className="h-6 w-px bg-muted-foreground/20 hidden sm:block" />
            <div className="relative h-9 w-9">
              <Image src="/logo.png" alt="Logo" fill className="object-contain" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* THEME TOGGLE */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() =>
                setTheme(theme === "dark" ? "light" : "dark")
              }
              className="rounded-full h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun size={18} className="text-amber-400" />
              ) : (
                <Moon size={18} className="text-slate-700" />
              )}
            </Button>

            {/* LANGUAGE TOGGLE */}
            <ToggleGroup
              type="single"
              value={lang}
              onValueChange={(value) => value && changeLang(value as "en" | "bn")}
              className="border rounded-full"
            >
              <ToggleGroupItem
                value="en"
                className="px-3 text-xs font-bold"
              >
                EN
              </ToggleGroupItem>
              <ToggleGroupItem
                value="bn"
                className="px-3 text-xs font-bold"
              >
                BN
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </header>

        {/* ====================== CONTENT ====================== */}
        <div className="flex-1 p-4 md:p-6 lg:p-10 bg-muted/20 dark:bg-background/10 overflow-y-auto">
          <div className="mx-auto max-w-7xl w-full">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}