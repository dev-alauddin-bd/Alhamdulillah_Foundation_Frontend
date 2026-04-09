"use client";

//==================================================================================
//                               APPLICATION SIDEBAR
//==================================================================================
// Description: Primary navigation component for the dashboard.
// Features: Role-based filtering, active state awareness, and smooth animations.
//==================================================================================

import {
  Home,
  Users,
  LogOut,
  ShieldCheck,
  Settings,
  Wallet,
  FolderKanban,
  CreditCard,
  Image as ImageIcon,
  Bell,
  ChevronRight,
  Heart,
  Zap,
  Receipt,
  Globe,
  Vote,
  HandHelping,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { IUser, logout, UserRole } from "@/redux/features/auth/authSlice";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useRouter, usePathname } from "next/navigation";
import baseApi from "@/redux/baseApi";
import { useEffect } from "react";
import { useAppLogout } from "@/hooks/useAppLogout";

//======================   SIDEBAR CONFIGURATION   ===============================
interface SidebarItem {
  title: string;
  url: string;
  icon: React.ComponentType<any>;
  roles: UserRole[];
  key: string;
}

export const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    key: "sidebar.commandCenter",
    url: "/dashboard",
    icon: Home,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MEMBER, UserRole.USER],
  },
  {
    title: "Account Activation",
    key: "sidebar.membership",
    url: "/dashboard/membership",
    icon: Zap,
    roles: [UserRole.USER],
  },
  {
    title: "Users",
    key: "sidebar.users",
    url: "/dashboard/users",
    icon: Users,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MEMBER],
  },
  {
    title: "Transactions",
    key: "sidebar.payments",
    url: "/dashboard/payments",
    icon: CreditCard,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Funds",
    key: "sidebar.funds",
    url: "/dashboard/funds",
    icon: Wallet,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Welfare Fund",
    key: "sidebar.welfareFund",
    url: "/dashboard/welfare",
    icon: HandHelping,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Donations",
    key: "sidebar.donate",
    url: "/dashboard/donate",
    icon: Heart,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MEMBER],
  },
  {
    title: "My Payments",
    key: "sidebar.myPayments",
    url: "/dashboard/my-payments",
    icon: Receipt,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MEMBER, UserRole.USER],
  },
  {
    title: "Notices",
    key: "sidebar.notices",
    url: "/dashboard/notices",
    icon: Bell,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Projects",
    key: "sidebar.projects",
    url: "/dashboard/projects",
    icon: FolderKanban,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Banners",
    key: "sidebar.banners",
    url: "/dashboard/banners",
    icon: ImageIcon,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Management",
    key: "sidebar.management",
    url: "/dashboard/management",
    icon: ShieldCheck,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN],
  },
  {
    title: "Votes",
    key: "sidebar.votes",
    url: "/dashboard/votes",
    icon: Vote,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MEMBER],
  },
  {
    title: "Settings",
    key: "sidebar.settings",
    url: "/dashboard/settings",
    icon: Settings,
    roles: [UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.MEMBER, UserRole.USER],
  },
];

interface AppSidebarProps {
  user: IUser;
}

//======================   COMPONENT LOGIC   ===============================
export function AppSidebar({ user }: AppSidebarProps) {
    const logoutHandler = useAppLogout();
  
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
 
  const currentAvatar = user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "U")}&background=0D9488&color=fff&bold=true`;

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      {/* 👤 LEADERSHIP IDENTITY PANEL */}
      <SidebarHeader className="pb-4 pt-8 px-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 hover:opacity-90 transition-all group p-3 rounded-2xl bg-sidebar-accent/10 border border-sidebar-border/50 hover:bg-sidebar-accent/20 hover:shadow-md"
        >
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12 border-2 border-primary/20 shrink-0 shadow-lg ring-offset-2 ring-primary/5 transition-all duration-500 rounded-2xl group-hover:rounded-xl">
              <AvatarImage
                src={currentAvatar}
                alt={user?.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-primary-foreground font-black text-lg uppercase">
                {user?.name?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-emerald-500 border-2 border-sidebar rounded-full shadow-lg" />
          </div>

          <div className="flex flex-col overflow-hidden text-left">
            <span className="text-sm font-black tracking-tight text-sidebar-foreground group-hover:text-primary transition-colors truncate">
              {user?.name || "System User"}
            </span>
            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-primary/70">
              {user?.role || "USER"}
            </span>
          </div>
        </Link>

        {/* Website Home Button */}
        <Link
          href="/"
          className="flex items-center gap-3 hover:opacity-90 transition-all group p-3 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 hover:from-primary/20 hover:to-primary/10 hover:shadow-md mt-3"
        >
          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-all">
            <Globe className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col overflow-hidden text-left">
            <span className="text-xs font-bold tracking-tight text-sidebar-foreground group-hover:text-primary transition-colors">
              {t("sidebar.websiteHome") || "Website Home"}
            </span>
            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              {t("sidebar.visitSite") || "Visit Site"}
            </span>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
      </SidebarHeader>

      {/* 🧭 SYSTEM NAVIGATION */}
      <SidebarContent className="px-3 py-2 scrollbar-none">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-[9px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/30 mb-3 h-auto">
            {t("sidebar.strategicOversight") || "Strategic Oversight"}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-1">
              {sidebarItems
                .filter((item) => item.roles.includes(user?.role))
                .map((item) => {
                  const isActive = pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton
                        asChild
                        className={`h-11 px-4 rounded-xl transition-all duration-300 relative group/menu ${
                          isActive
                            ? "bg-gradient-to-r from-primary to-emerald-600 text-white shadow-xl shadow-primary/25 scale-[1.02] border border-primary/20 ring-1 ring-white/10"
                            : "text-sidebar-foreground/70 hover:bg-primary/5 hover:text-primary active:scale-[0.98] hover:pl-5"
                        }`}
                      >
                        <Link
                          href={item.url}
                          className="flex items-center gap-3 w-full"
                        >
                          <item.icon
                            className={`w-4.5 h-4.5 transition-all duration-300 ${isActive ? "scale-110" : "group-hover/menu:scale-110"}`}
                          />
                          <span
                            className={`text-xs font-bold tracking-tight transition-all duration-300 ${isActive ? "translate-x-1" : ""}`}
                          >
                            {t(item.key) || item.title}
                          </span>
                          {isActive && (
                            <div className="ml-auto">
                              <ChevronRight size={14} className="opacity-80 animate-pulse" />
                            </div>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 🚪 SECURITY TERMINATION */}
      <SidebarFooter className="p-3">
        <Button
          variant="outline"
          onClick={logoutHandler}
          className="w-full h-11 justify-center gap-2 rounded-xl font-black text-[10px] transition-all duration-500 group border-destructive/30 text-destructive hover:bg-destructive hover:text-white shadow-sm hover:shadow-destructive/20"
        >
          <LogOut className="w-4 h-4 group-hover:rotate-12 transition-transform duration-500" />
          <span className="uppercase tracking-[0.2em]">{t("sidebar.signOut") || "Sign Out"}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
