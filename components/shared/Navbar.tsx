"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Sun, Moon, Menu, LayoutDashboard, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

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
    const onScroll = () => setScrolled(window.scrollY > 10);
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
    <nav
      className={`
        fixed top-0 left-1/2 transform -translate-x-1/2
        z-50 w-full container mx-auto md:mt-4 lg:mt-8
        transition-all duration-300
        ${scrolled
          ? "h-12 bg-background/90 backdrop-blur-xl shadow-md"
          : "h-14 bg-background/70 backdrop-blur-lg"}
        md:rounded-2xl
      `}
    >
      <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <div className="relative h-10 w-10 md:h-14 md:w-14">
            <Image src="/logo.png" alt="Logo" fill className="object-contain" />
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-2 rounded-full
                  text-sm md:text-base font-medium
                  transition
                  ${active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-primary/10"}
                `}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="rounded-full px-4">
                    <LayoutDashboard size={16} className="mr-1" />
                    {t("common.dashboard")}
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logoutHandler}
                  className="rounded-full px-4 text-red-600 hover:text-red-600"
                >
                  <LogOut size={16} className="mr-1" />
                  {t("common.logout")}
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="rounded-full px-5">
                  {t("common.login")}
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full">
                  <Menu size={18} />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                sideOffset={8}
                className="w-56 rounded-xl p-1 shadow-xl"
              >
                {navItems.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <DropdownMenuItem
                      key={item.href}
                      asChild
                      className={`rounded-lg ${active && "bg-primary/10 text-primary"}`}
                    >
                      <Link href={item.href}>{item.label}</Link>
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="gap-2">
                  <Link href={user ? "/dashboard" : "/login"}>
                    <LayoutDashboard size={16} />
                    {user ? t("common.dashboard") : t("common.login")}
                  </Link>
                </DropdownMenuItem>

                {user && (
                  <DropdownMenuItem
                    onClick={logoutHandler}
                    className="gap-2 text-red-600 focus:text-red-600"
                  >
                    <LogOut size={16} />
                    {t("common.logout")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Theme */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="h-8 w-8 md:h-9 md:w-9 rounded-full"
          >
            {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
          </Button>

          {/* Language */}
          <ToggleGroup
            type="single"
            value={lang}
            onValueChange={(v) => v && i18n.changeLanguage(v)}
            className="flex items-center h-6 sm:h-7 md:h-8 border border-muted/50 rounded-md"
          >
            <ToggleGroupItem
              value="en"
              className="text-[9px] sm:text-[11px] md:text-sm px-1.5 sm:px-2 md:px-3 h-5 sm:h-6 md:h-7"
            >
              EN
            </ToggleGroupItem>
            <ToggleGroupItem
              value="bn"
              className="text-[9px] sm:text-[11px] md:text-sm px-1.5 sm:px-2 md:px-3 h-5 sm:h-6 md:h-7"
            >
              BN
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
    </nav>
  );
}