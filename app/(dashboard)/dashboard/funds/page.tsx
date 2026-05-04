"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileText, Settings, Loader2, DollarSign, Wallet } from "lucide-react";
import {
  useAddFundTransactionMutation,
  useGetFundHistoryQuery,
  useGetFundSummaryQuery,
  useGetExpenseRequestsQuery,
} from "@/redux/features/fundApi/fundApi";
import { AddTransactionForm } from "@/components/funds/AddTransactionForm";
import { generateFundPDF } from "@/lib/pdfGenerator";
import { TransactionTable } from "@/components/funds/TransactionTable";
import { SummaryCards } from "@/components/funds/SummaryCards";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFSectionTitle } from "@/components/shared/AFSectionTitle";
import { AFPagination } from "@/components/shared/AFPagination";
import { ExpenseRequestTable } from "@/components/funds/ExpenseRequestTable";
import { useTranslation } from "react-i18next";

export default function FundDashboard() {
  //======================   STATE & HOOKS   ===============================
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
  });
  const { data: requests, isLoading: rLoading } = useGetExpenseRequestsQuery({ status: 'PENDING' });
  const [addTransaction, { isLoading: adding }] =
    useAddFundTransactionMutation();

  const history = historyResponse?.data || [];
  const meta = historyResponse?.meta || { totalPages: 1, total: 0 };

  //======================   RENDER LOGIC   ===============================
  if (sLoading || hLoading || rLoading) {
    return (
      <div className="flex h-[450px] flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
          <Loader2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-primary animate-pulse" />
        </div>
        <p className="text-muted-foreground font-black text-xs uppercase tracking-[0.3em] animate-pulse">
          {t("funds.loading")}
        </p>
      </div>
    );
  }

  //======================   MAIN VIEW   ===============================
  return (
    <div className="max-w-[1600px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      {/* Page Header */}
      <AFPageHeader
        title={t("funds.title")}
        description={t("funds.description")}
      />

      {/* 💰 FINANCIAL SUMMARY OVERVIEW */}
      <SummaryCards summary={summary} />

      {/* 📝 EXPENSE APPROVAL QUEUE */}
      {requests && requests.length > 0 && (
         <div className="space-y-6">
            <AFSectionTitle 
              title={t("funds.awaitingAuth")} 
              subtitle={t("funds.awaitingDesc")}
              badge={t("funds.protocolQueue")}
            />
            <ExpenseRequestTable requests={requests} isLoading={rLoading} />
         </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 ">
        {/* ➕ NEW TRANSACTION FORM (Left/Top) */}
        <div className="xl:col-span-2">
          <AFSectionTitle 
            title={t("funds.registerTransaction")} 
            subtitle={t("funds.registerDesc")}
            badge={t("funds.ledgerEntry")}
          />
          <AddTransactionForm
            onAdd={async (data: any) => await addTransaction(data).unwrap()}
            adding={adding}
          />
        </div>

        {/* 🛠️ REPORT GENERATION SETTINGS (Right) */}
        <div className="space-y-8">
           <AFSectionTitle 
            title={t("funds.controls")} 
            subtitle={t("funds.controlsDesc")}
            className="mb-0"
          />
          <Card className="border-none shadow-2xl rounded-3xl overflow-hidden bg-gradient-to-br from-primary/5 via-background to-primary/5 backdrop-blur-md">
            <CardHeader className="p-6 border-b border-primary/10 bg-gradient-to-r from-primary/10 to-emerald-500/10">
              <CardTitle className="text-sm font-black uppercase tracking-wider flex items-center gap-3 text-primary">
                <div className="p-2 bg-primary/10 rounded-xl">
                  <FileText size={20} className="text-primary" />
                </div>
                <div>
                  <div>{t("funds.reportProtocols")}</div>
                  <p className="text-[10px] font-normal text-muted-foreground normal-case tracking-normal mt-1">
                    Generate official financial report
                  </p>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  {t("funds.primarySignatory")}
                </label>
                <Input
                  placeholder="Enter signatory name"
                  className="rounded-xl border-2 border-muted/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 h-12 bg-background font-medium transition-all"
                  value={sigName}
                  onChange={(e) => setSigName(e.target.value)}
                />
              </div>
              <div className="space-y-3">
                <label className="text-xs font-bold text-foreground flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  {t("funds.officialDesignation")}
                </label>
                <Input
                  placeholder="Enter designation"
                  className="rounded-xl border-2 border-muted/50 focus:border-primary/50 focus:ring-2 focus:ring-primary/20 h-12 bg-background font-medium transition-all"
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
                  className="w-full h-14 bg-gradient-to-r from-primary to-emerald-600 hover:from-primary/90 hover:to-emerald-600/90 disabled:from-muted disabled:to-muted text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 uppercase text-sm tracking-wider flex items-center justify-center gap-3 group"
                >
                  <FileText size={22} className="group-hover:scale-110 transition-transform" />
                  {t("funds.generatePDF")}
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

      {/* 📊 TRANSACTION AUDIT HISTORY */}
      <div className="space-y-8">
        <AFSectionTitle 
          title={t("funds.auditHistory")} 
          subtitle={t("funds.auditDesc")}
          badge={t("funds.ledgerEntry")}
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
