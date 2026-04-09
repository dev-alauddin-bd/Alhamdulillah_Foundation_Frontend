"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, ArrowUpCircle, ArrowDownCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

export const SummaryCards = ({ summary }: { summary: any }) => {
  const { t } = useTranslation();
  return (
  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
    {/* Main Fund Balance */}
    <Card className="bg-emerald-50 border-emerald-200 shadow-sm relative overflow-hidden group">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
          {t("funds.mainFundTitle")}
        </CardTitle>
        <Wallet className="h-5 w-5 text-emerald-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-emerald-700">
          ৳ {summary?.main?.balance?.toLocaleString() || 0}
        </div>
        <p className="text-[10px] text-emerald-600/70 mt-1 font-bold uppercase tracking-tighter">
          {t("funds.mainFundDesc")}
        </p>
      </CardContent>
      <Wallet className="absolute -right-4 -bottom-4 h-20 w-20 text-emerald-100 opacity-20 group-hover:scale-110 transition-transform" />
    </Card>

    {/* Welfare Fund (Kollan Thobil) */}
    <Card className="bg-amber-50 border-amber-200 shadow-sm relative overflow-hidden group">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
          {t("funds.welfareFundTitle")}
        </CardTitle>
        <ArrowUpCircle className="h-5 w-5 text-amber-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-amber-700">
          ৳ {summary?.welfare?.balance?.toLocaleString() || 0}
        </div>
        <p className="text-[10px] text-amber-600/70 mt-1 font-bold uppercase tracking-tighter">
          {t("funds.welfareFundDesc")}
        </p>
      </CardContent>
      <ArrowUpCircle className="absolute -right-4 -bottom-4 h-20 w-20 text-amber-100 opacity-20 group-hover:scale-110 transition-transform" />
    </Card>

    {/* Total Income */}
    <Card className="bg-blue-50 border-blue-200 shadow-sm relative overflow-hidden group">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[10px] font-black text-blue-600 uppercase tracking-widest">
          {t("funds.totalIncomeTitle")}
        </CardTitle>
        <ArrowUpCircle className="h-5 w-5 text-blue-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-blue-700">
          ৳ {(summary?.main?.totalIncome + summary?.welfare?.totalIncome)?.toLocaleString() || 0}
        </div>
        <p className="text-[10px] text-blue-600/70 mt-1 font-bold uppercase tracking-tighter">
          {t("funds.totalIncomeDesc")}
        </p>
      </CardContent>
      <ArrowUpCircle className="absolute -right-4 -bottom-4 h-20 w-20 text-blue-100 opacity-20 group-hover:scale-110 transition-transform" />
    </Card>

    {/* Total Expense */}
    <Card className="bg-red-50 border-red-200 shadow-sm relative overflow-hidden group">
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-[10px] font-black text-red-600 uppercase tracking-widest">
          {t("funds.totalExpenseTitle")}
        </CardTitle>
        <ArrowDownCircle className="h-5 w-5 text-red-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-black text-red-700">
          ৳ {(summary?.main?.totalExpense + summary?.welfare?.totalExpense)?.toLocaleString() || 0}
        </div>
        <p className="text-[10px] text-red-600/70 mt-1 font-bold uppercase tracking-tighter">
          {t("funds.totalExpenseDesc")}
        </p>
      </CardContent>
      <ArrowDownCircle className="absolute -right-4 -bottom-4 h-20 w-20 text-red-100 opacity-20 group-hover:scale-110 transition-transform" />
    </Card>
  </div>
  );
};
