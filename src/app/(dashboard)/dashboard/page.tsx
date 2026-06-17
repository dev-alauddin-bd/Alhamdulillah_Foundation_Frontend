"use client";

//==================================================================================
//                               DASHBOARD OVERVIEW
//==================================================================================
// Description: Main entry point for the dashboard after login.
// Features: Statistical overview, pending account handling, and project summaries.
//==================================================================================

import Link from "next/link";
import {
  AlertTriangle,
  LayoutDashboard,
  Database,
  CreditCard,
  TrendingUp,
  Users,
  Briefcase,
  Layers,
  ShieldCheck,
  Wallet
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { useGetMeQuery, useGetStatsQuery } from "@/redux/features/auth/authApi";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { MonthlyFundChart } from "@/components/dashboard/MonthlyFundChart";
import { ProjectDistributionChart } from "@/components/dashboard/ProjectDistributionChart";
import { RecentDonationsTable } from "@/components/dashboard/RecentDonationsTable";
import { CSVExportButton } from "@/components/dashboard/CSVExportButton";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";

import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const { t } = useTranslation();
  
  //======================   API HOOKS & DATA   ===============================
  const userFromState = useSelector((state: any) => state.AFAuth.user);
  
  //======================   API HOOKS & DATA   ===============================
  const { data: userResponse, isLoading: userLoading, refetch } = useGetMeQuery(undefined, {
    skip: !userFromState
  });
  const { data: statsResponse, isFetching: statsFetching } = useGetStatsQuery(undefined, {
    skip: !userFromState
  });

  const user = userResponse?.data?.user || userResponse?.data || userFromState;
  const stats = statsResponse?.data;

  useEffect(() => {
    const status = searchParams.get("status");
    if (status === "PAID") {
      toast.success(t("dashboard.settlementVerified") || "Settlement Verified. Your contribution has been recorded in the foundation ledger.");
      refetch(); // 🔥 Dynamic synchronization
    } else if (status === "CANCELLED") {
      toast.error(t("dashboard.transactionAborted") || "Transaction Aborted. The payment process was cancelled by the user.");
    }
  }, [searchParams, refetch, t]);

  //======================   RENDER LOGIC   ===============================
  if (userLoading || (statsFetching && !stats)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="h-16 w-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center">
               <LayoutDashboard size={20} className="text-primary animate-pulse" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium animate-pulse tracking-widest uppercase text-xs">
            {t("dashboard.analyzing") || "Analyzing Foundation Data..."}
          </p>
        </div>
      </div>
    );
  }

  const isMember = user?.role === "MEMBER" || user?.role === "ADMIN" || user?.role === "SUPER_ADMIN";

  //======================   NON-MEMBER / PENDING ACCOUNT VIEW   ===============================
  if (!isMember) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <Card className="max-w-xl w-full border-primary/20 bg-primary/5 backdrop-blur-sm overflow-hidden shadow-2xl rounded-3xl">
          <div className="p-8 sm:p-12 flex flex-col items-center text-center gap-6">
            <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center animate-pulse">
              <AlertTriangle className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                {t("dashboard.pendingTitle") || "Membership Required"}
              </h2>
              <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
                {t("dashboard.pendingDesc") || "Welcome to Alhamdulillah Foundation! To access the dashboard and contribute to projects, you need to activate your membership by paying a one-time fee."}
              </p>
            </div>

            <Link href="/dashboard/membership" className="w-full sm:w-auto">
              <Button
                variant="default"
                size="lg"
                className="w-full sm:px-12 rounded-2xl font-black bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all h-14"
              >
                {t("dashboard.membershipBtn") || "Activate Account Now"}
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  const isAdmin = user?.role === "SUPER_ADMIN" || user?.role === "ADMIN";

  //======================   STANDARD DASHBOARD VIEW   ===============================
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <AFPageHeader
          title={t("dashboard.welcomeBack", { name: user?.name || "User" }) || `Welcome back, ${user?.name || "User"}!`}
          description={t("dashboard.quickLook") || "Here's a quick look at your foundation's current status and activities."}
        />
        <div className="flex items-center gap-2">
          <CSVExportButton 
            data={stats?.monthlyStats || []} 
            filename="monthly_stats" 
            label={t("dashboard.exportAnalytics") || "Export Analytics"} 
          />
          <CSVExportButton 
            data={stats?.recentDonations || []} 
            filename="recent_donations" 
            label={t("dashboard.donationsCSV") || "Donations CSV"} 
          />
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 ${isAdmin ? 'xl:grid-cols-5' : 'lg:grid-cols-4'} gap-6`}>
        <Card className="p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-300 border border-border/50 bg-blue-50/40 dark:bg-blue-950/10">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Briefcase size={80} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
              <Layers size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">
                {isAdmin 
                  ? (t("dashboard.globalProjects") || "Venture Portfolio") 
                  : (t("dashboard.activeProjects") || "Active Projects")}
              </p>
              <h3 className="text-xl font-black">{stats?.totalProjects || 0}</h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold">
                {stats?.activeProjects || 0} {t("dashboard.currentlyOngoing") || "LIVE OPERATIONS"}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-300 border border-border/50 bg-emerald-50/40 dark:bg-emerald-950/10">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp size={80} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/20">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                {isAdmin 
                  ? (t("dashboard.netProfit") || "Network Yield") 
                  : (t("dashboard.myImpact") || "Capital Contribution")}
              </p>
              <h3 className="text-xl font-black">
                ৳{(isAdmin ? (stats?.netProfit || 0) : (stats?.myInvestments || 0)).toLocaleString()}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold">
                {isAdmin 
                  ? (t("dashboard.netYield") || "NET EARNINGS") 
                  : (t("dashboard.myTotalContribution") || "MY TOTAL ROI")}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-300 border border-border/50 bg-cyan-50/40 dark:bg-cyan-950/10">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <CreditCard size={80} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-cyan-600 rounded-xl text-white shadow-lg shadow-cyan-500/20">
              <Database size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-cyan-600 dark:text-cyan-400 uppercase tracking-widest">
                {isAdmin 
                  ? (t("dashboard.mainFund") || "Foundation Reserve") 
                  : (t("dashboard.foundationFund") || "Protocol Fund")}
              </p>
              <h3 className="text-xl font-black">৳{(stats?.mainBalance || stats?.currentBalance || 0).toLocaleString()}</h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold">
                {isAdmin 
                  ? (t("dashboard.mainLiquidity") || "MAIN OPERATIONAL") 
                  : (t("dashboard.totalTransparentFund") || "LIVE LIQUIDITY")}
              </p>
            </div>
          </div>
        </Card>

        {/* Welfare Fund Card */}
        <Card className="p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-300 border border-border/50 bg-amber-50/40 dark:bg-amber-950/10">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <AlertTriangle size={80} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-amber-500 rounded-xl text-white shadow-lg shadow-amber-500/20">
               <ShieldCheck size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-widest">
                {t("dashboard.welfareReserve") || "Welfare Reserve"}
              </p>
              <h3 className="text-xl font-black">৳{(stats?.welfareBalance || 0).toLocaleString()}</h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold">
                KOLLAN THOBIL
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-300 border border-border/50 bg-purple-50/40 dark:bg-purple-950/10">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Users size={80} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-500/20">
              <Users size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest">
                {isAdmin 
                  ? (t("dashboard.totalNodes") || "Network Nodes") 
                  : (t("dashboard.ourCommunity") || "Impact Community")}
              </p>
              <h3 className="text-xl font-black">{stats?.totalUsers || 0}</h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase">
                {t("dashboard.registered") || "REGISTERED"}
              </p>
            </div>
          </div>
        </Card>

        {/* 💰 MY BALANCE CARD (Requirement 10) */}
        <Card className="p-6 overflow-hidden relative group hover:shadow-xl transition-all duration-300 border border-border/50 bg-indigo-50/40 dark:bg-indigo-950/10 sm:col-span-2 lg:col-span-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
            <Wallet size={80} />
          </div>
          <div className="flex items-center gap-4 relative z-10">
            <div className="p-3 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
              <Wallet size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                {t("dashboard.myBalance") || "My Account Balance"}
              </p>
              <h3 className="text-xl font-black text-indigo-700 dark:text-indigo-300">
                ৳{(user?.accountBalance || 0).toLocaleString()}
              </h3>
              <p className="text-[10px] text-muted-foreground mt-1 font-bold uppercase">
                {t("dashboard.availableForWithdraw") || "AVAILABLE CREDIT"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <MonthlyFundChart 
          data={stats?.monthlyStats || []} 
          title={isAdmin 
            ? (t("dashboard.monthlyGrowth") || "Monthly Foundation Growth") 
            : (t("dashboard.myMonthlyContributions") || "My Monthly Contributions")}
        />
        <ProjectDistributionChart data={stats?.projectDistribution || []} />
      </div>

      {/* Bottom Section: Recent Activities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentDonationsTable 
          donations={stats?.recentDonations || []} 
          title={isAdmin 
            ? (t("dashboard.recentDonations") || "Recent Donations") 
            : (t("dashboard.myRecentDonations") || "My Recent Donations")}
        />
        
        <Card className="p-6 flex flex-col justify-center items-center text-center space-y-4 border-dashed border-2 bg-muted/5 group hover:bg-primary/5 transition-colors duration-500">
           <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-500">
             <LayoutDashboard className="h-10 w-10 text-primary" />
           </div>
           <div>
             <h3 className="text-xl font-bold">{t("dashboard.needInsights") || "Need detailed insights?"}</h3>
             <p className="text-sm text-muted-foreground max-w-sm mt-2">
               {t("dashboard.exportDesc") || "You can export your foundation's financial data to CSV for offline analysis and reporting."}
             </p>
           </div>
           <div className="flex gap-4 mt-2">
             <Link href="/dashboard/funds">
                <Button variant="default" className="rounded-full px-8">{t("dashboard.viewAllFunds") || "View All Funds"}</Button>
             </Link>
             <Link href="/dashboard/projects">
                <Button variant="outline" className="rounded-full px-8">{t("dashboard.manageProjects") || "Manage Projects"}</Button>
             </Link>
           </div>
        </Card>
      </div>
    </div>
  );
}
