"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Settings, 
  Loader2, 
  HandHelping, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck,
  Zap
} from "lucide-react";
import {
  useAddFundTransactionMutation,
  useGetFundHistoryQuery,
  useGetFundSummaryQuery,
} from "@/redux/features/fundApi/fundApi";
import { AddTransactionForm } from "@/components/funds/AddTransactionForm";
import { generateFundPDF } from "@/lib/pdfGenerator";
import { TransactionTable } from "@/components/funds/TransactionTable";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFSectionTitle } from "@/components/shared/AFSectionTitle";
import { AFPagination } from "@/components/shared/AFPagination";
import { useTranslation } from "react-i18next";

export default function WelfareFundPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sigName, setSigName] = useState("");
  const [sigDesignation, setSigDesignation] = useState("");

  const { data: summary, isLoading: sLoading } = useGetFundSummaryQuery();
  const { data: historyResponse, isLoading: hLoading } = useGetFundHistoryQuery({
    page,
    limit,
    fundType: "WELFARE",
  });
  const [addTransaction, { isLoading: adding }] = useAddFundTransactionMutation();

  const history = historyResponse?.data || [];
  const meta = historyResponse?.meta || { totalPages: 1, total: 0 };

  if (sLoading || hLoading) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-amber-100 border-t-amber-500 rounded-full animate-spin" />
          <HandHelping className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-amber-500 animate-pulse" />
        </div>
        <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.3em] animate-pulse">
          {t("welfare.loading")}
        </p>
      </div>
    );
  }

  const welfare = summary?.welfare || { totalIncome: 0, totalExpense: 0, balance: 0 };

  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Page Header */}
      <AFPageHeader
        title={t("welfare.title")}
        description={t("welfare.description")}
      />

      {/* 🏥 WELFARE STATS OVERVIEW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-amber-50 border-amber-200 shadow-xl rounded-[2.5rem] relative overflow-hidden group">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 p-8">
            <CardTitle className="text-[10px] font-black text-amber-600 uppercase tracking-widest">
              {t("welfare.availableReserve")}
            </CardTitle>
            <HandHelping className="h-6 w-6 text-amber-500" />
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="text-4xl font-black text-amber-700">
              ৳ {welfare.balance?.toLocaleString()}
            </div>
            <p className="text-[10px] text-amber-600/70 mt-2 font-bold uppercase tracking-tighter">
              {t("welfare.readyForUse")}
            </p>
          </CardContent>
          <HandHelping className="absolute -right-8 -bottom-8 h-32 w-32 text-amber-200 opacity-20 group-hover:scale-110 transition-transform -rotate-12" />
        </Card>

        <Card className="bg-emerald-50 border-emerald-200 shadow-xl rounded-[2.5rem] relative overflow-hidden group">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 p-8">
            <CardTitle className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">
              {t("welfare.totalInflow")}
            </CardTitle>
            <TrendingUp className="h-6 w-6 text-emerald-500" />
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="text-4xl font-black text-emerald-700">
              ৳ {welfare.totalIncome?.toLocaleString()}
            </div>
            <p className="text-[10px] text-emerald-600/70 mt-2 font-bold uppercase tracking-tighter">
              {t("welfare.lifetimeContributions")}
            </p>
          </CardContent>
          <TrendingUp className="absolute -right-8 -bottom-8 h-32 w-32 text-emerald-200 opacity-20 group-hover:scale-110 transition-transform" />
        </Card>

        <Card className="bg-rose-50 border-rose-200 shadow-xl rounded-[2.5rem] relative overflow-hidden group">
          <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0 p-8">
            <CardTitle className="text-[10px] font-black text-rose-600 uppercase tracking-widest">
              {t("welfare.distributedSupport")}
            </CardTitle>
            <TrendingDown className="h-6 w-6 text-rose-500" />
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <div className="text-4xl font-black text-rose-700">
              ৳ {welfare.totalExpense?.toLocaleString()}
            </div>
            <p className="text-[10px] text-rose-600/70 mt-2 font-bold uppercase tracking-tighter">
              {t("welfare.socialImpact")}
            </p>
          </CardContent>
          <TrendingDown className="absolute -right-8 -bottom-8 h-32 w-32 text-rose-200 opacity-20 group-hover:scale-110 transition-transform" />
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* ➕ ADD WELFARE TRANSACTION */}
        <div className="xl:col-span-2">
          <AFSectionTitle 
            title={t("welfare.injectResource")} 
            subtitle={t("welfare.injectDesc")}
            badge={t("welfare.resourceInjection")}
          />
          <AddTransactionForm
            onAdd={async (data: any) => {
              await addTransaction({ ...data, fundType: "WELFARE" }).unwrap();
            }}
            adding={adding}
          />
        </div>

        {/* 🛠️ WELFARE REPORTING */}
        <div className="space-y-8">
           <AFSectionTitle 
            title={t("welfare.welfareAudit")} 
            subtitle={t("welfare.welfareAuditDesc")}
            className="mb-0"
          />
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-amber-500/5 via-background to-amber-500/5 backdrop-blur-md">
            <CardHeader className="p-6 border-b border-amber-200/20 bg-gradient-to-r from-amber-500/10 to-orange-500/10">
              <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-3 text-amber-600">
                <div className="p-2 bg-amber-500/10 rounded-xl">
                  <FileText size={20} className="text-amber-600" />
                </div>
                <div>
                  <div>{t("welfare.verificationProtocol")}</div>
                  <p className="text-[10px] font-normal text-muted-foreground normal-case tracking-normal mt-1">
                    Generate welfare fund report
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                  {t("funds.primarySignatory")}
                </label>
                <Input
                  placeholder="Enter signatory name"
                  className="rounded-xl border-2 border-muted/50 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 h-12 bg-background font-medium transition-all"
                  value={sigName}
                  onChange={(e) => setSigName(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-500"></div>
                  {t("funds.officialDesignation")}
                </label>
                <Input
                  placeholder="Enter designation"
                  className="rounded-xl border-2 border-muted/50 focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 h-12 bg-background font-medium transition-all"
                  value={sigDesignation}
                  onChange={(e) => setSigDesignation(e.target.value)}
                />
              </div>
              
              <div className="pt-2">
                <Button
                  onClick={() =>
                    generateFundPDF(
                      history || [],
                      summary,
                      sigName,
                      sigDesignation,
                    )
                  }
                  disabled={!sigName || !sigDesignation}
                  className="w-full h-14 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-600/90 hover:to-orange-600/90 disabled:from-muted disabled:to-muted text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 uppercase text-sm tracking-wider flex items-center justify-center gap-3 group"
                >
                  <FileText size={22} className="group-hover:scale-110 transition-transform" />
                  {t("welfare.welfareAuditPDF")}
                </Button>
              </div>

              {(!sigName || !sigDesignation) && (
                <p className="text-xs text-muted-foreground text-center bg-muted/30 rounded-lg p-3">
                  Please fill in both fields to generate the report
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 📊 WELFARE AUDIT STREAM */}
      <div className="space-y-8">
        <AFSectionTitle 
          title={t("welfare.impactStream")} 
          subtitle={t("welfare.impactStreamDesc")}
          badge={t("welfare.welfareHistory")}
        />
        <div className="rounded-[3rem] overflow-hidden bg-card/30 backdrop-blur-md border border-muted/20 shadow-2xl p-8">
          <TransactionTable
            history={history}
            search={search}
            setSearch={(val: string) => {
              setSearch(val);
              setPage(1);
            }}
            limit={limit}
            setLimit={(val: number) => {
              setLimit(val);
              setPage(1);
            }}
          />

          <AFPagination 
             currentPage={page}
             totalPages={meta.totalPages}
             onPageChange={(p) => {
               setPage(p);
               window.scrollTo({ top: 0, behavior: 'smooth' });
             }}
             className="mt-8"
          />
        </div>
      </div>
    </div>
  );
}
