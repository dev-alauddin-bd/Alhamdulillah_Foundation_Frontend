"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Sun, Moon, Menu, LayoutDashboard, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useAppLogout } from "@/hooks/useAppLogout";

export default function Navbar() {
  const user = useSelector(selectCurrentUser);
  const pathname = usePathname();
  const logoutHandler = useAppLogout();

  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();
  const lang = i18n.language as "en" | "bn";

  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { label: t("common.home"), href: "/" },
    { label: t("common.projects"), href: "/projects" },
    { label: t("common.about"), href: "/about" },
    { label: t("common.notices"), href: "/notices" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 py-4">
      <div className="container mx-auto px-4 md:px-8">
        <nav className="flex items-center justify-between px-6 md:px-10 py-3 rounded-full transition-all duration-500 border border-border/30 bg-card/75 dark:bg-white/5 dark:border-white/5 backdrop-blur-xl shadow-xl shadow-primary/5">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group relative">
            <div className="relative h-10 w-10 md:h-12 md:w-12 transition-all duration-500 group-hover:scale-105">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              <Image src="/logo.png" alt="Logo" fill className="object-contain relative z-10" />
            </div>
            <div className="flex flex-col space-y-1">
              <span className="font-black text-sm md:text-lg tracking-tighter uppercase leading-none text-foreground dark:text-white">
                {lang === "bn" ? "আলহামদুলিল্লাহ" : "ALHAMDULILLAH"}
              </span>
              <span className="font-bold text-[8px] md:text-[10px] tracking-[0.4em] uppercase text-primary/80 leading-none">
                {lang === "bn" ? "ফাউন্ডেশন" : "FOUNDATION"}
              </span>
            </div>
          </Link>

          {/* Desktop Nav - Centered */}
          <div className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "px-5 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all relative group overflow-hidden",
                    active 
                      ? "text-primary bg-primary/10" 
                      : "text-foreground/60 hover:text-foreground dark:text-white/60 dark:hover:text-white"
                  )}
                >
                  <span className="relative z-10">{item.label}</span>
                  {active && (
                    <span className="absolute inset-0 bg-primary/5 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3 md:gap-5">
            {/* Language Switcher - Premium Style */}
            <button
              onClick={() => i18n.changeLanguage(lang === "en" ? "bn" : "en")}
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-full border border-border/50 dark:border-white/10 hover:border-primary/50 transition-all text-[10px] font-black text-foreground/80 dark:text-white/80 hover:text-primary uppercase bg-foreground/5 dark:bg-white/5"
            >
              {lang}
            </button>

            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9 rounded-full border border-border/50 dark:border-white/10 hover:border-primary/50 bg-foreground/5 dark:bg-white/5 text-foreground/80 dark:text-white/80 hover:text-primary transition-all"
            >
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
            </Button>

            {/* Auth/Dashboard Action */}
            <div className="hidden md:block">
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      className="rounded-full px-6 py-5 bg-primary/10 hover:bg-primary/20 border border-primary/20 gap-3 group"
                    >
                      <LayoutDashboard size={16} className="text-primary group-hover:rotate-12 transition-transform" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                        {user.name?.split(" ")[0] || t("common.dashboard")}
                      </span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-[1.5rem] p-3 border border-border/50 bg-card/90 dark:border-white/10 dark:bg-black/90 mt-4 animate-in fade-in slide-in-from-top-4">
                    <DropdownMenuItem asChild className="rounded-xl py-3 cursor-pointer">
                      <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <LayoutDashboard size={16} />
                        </div>
                        <span className="font-bold text-sm">{t("common.dashboard")}</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-white/5 my-2" />
                    <DropdownMenuItem
                      onClick={logoutHandler}
                      className="rounded-xl py-3 cursor-pointer text-red-400 focus:text-red-400 focus:bg-red-400/10"
                    >
                      <div className="h-8 w-8 rounded-lg bg-red-400/10 flex items-center justify-center">
                        <LogOut size={16} />
                      </div>
                      <span className="font-bold text-sm">{t("common.logout")}</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link href="/login">
                  <Button className="rounded-full px-8 py-5 bg-primary hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30 font-black uppercase text-[11px] tracking-widest text-primary-foreground">
                    {t("common.login")}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="icon" variant="ghost" className="h-10 w-10 rounded-full bg-foreground/5 border border-border/50 dark:bg-white/5 dark:border-white/10">
                    <Menu size={20} className="text-foreground dark:text-white" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[calc(100vw-2rem)] mx-4 rounded-[2rem] p-4 border border-border/50 bg-card/95 backdrop-blur-2xl dark:border-white/10 dark:bg-black/95 mt-4 animate-in zoom-in-95">
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    {navItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild className="rounded-2xl p-4 bg-foreground/5 dark:bg-white/5 hover:bg-primary/10 border border-border/30 dark:border-white/5 transition-all flex flex-col items-start gap-2">
                        <Link href={item.href} className="w-full">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Navigate</span>
                          <span className="font-bold text-sm text-foreground dark:text-white">{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  
                  <DropdownMenuSeparator className="bg-white/5 my-4" />
                  
                  <div className="space-y-2">
                    <DropdownMenuItem asChild className="rounded-2xl py-4 bg-primary text-primary-foreground flex justify-center cursor-pointer">
                      <Link href={user ? "/dashboard" : "/login"} className="gap-3 font-black uppercase tracking-widest text-[11px]">
                        <LayoutDashboard size={18} />
                        {user ? t("common.dashboard") : t("common.login")}
                      </Link>
                    </DropdownMenuItem>
                    {user && (
                      <DropdownMenuItem
                        onClick={logoutHandler}
                        className="rounded-2xl py-4 bg-red-400/10 text-red-400 flex justify-center cursor-pointer border border-red-400/20"
                      >
                        <LogOut size={18} />
                        <span className="font-black uppercase tracking-widest text-[11px] ml-3">{t("common.logout")}</span>
                      </DropdownMenuItem>
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </nav>
      </div>
    </header>
  );
}