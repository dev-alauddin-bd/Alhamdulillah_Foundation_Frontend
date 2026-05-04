"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useInitiatePaymentMutation, useSubmitManualPaymentMutation } from "@/redux/features/payment/paymentApi";
import { useGetFundSummaryQuery } from "@/redux/features/fundApi/fundApi";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import {
  Heart,
  Loader2,
  ArrowRight,
  Wallet,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { Label } from "@radix-ui/react-label";

const SUGGESTED_AMOUNTS = [500, 1000, 2000, 5000, 10000];

export default function MonthlyDonationPage() {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<string>("BKASH_GATEWAY");
  const [trxId, setTrxId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [manualSubmitted, setManualSubmitted] = useState(false);
  const [customAmount, setCustomAmount] = useState<boolean>(false);

  const { data: summary, isLoading: summaryLoading } = useGetFundSummaryQuery();
  const [initiatePayment, { isLoading: processing }] = useInitiatePaymentMutation();
  const [submitManual, { isLoading: submittingManual }] = useSubmitManualPaymentMutation();
  const router = useRouter();

  const handleDonate = async () => {
    if (!amount || Number(amount) <= 0) {
      toast.error(t("donate.enterAmount"));
      return;
    }
    const toastId = toast.loading(t("donate.processing"));
    try {
      const response = await initiatePayment({
        amount: Number(amount),
        method: paymentMethod as any,
        purpose: "MONTHLY_DONATION",
      }).unwrap();

      const gatewayUrl = response?.data?.gatewayUrl;
      const paymentId = response?.data?.paymentId;

      if (gatewayUrl) {
        toast.success(t("donate.processing"), { id: toastId });
        window.location.href = gatewayUrl;
        return;
      }

      if (paymentMethod.includes("MANUAL")) {
        toast.success("Payment record created. Please submit details.", { id: toastId });
        setManualSubmitted(true);
        (window as any).currentPaymentId = paymentId;
        return;
      }

      toast.error(t("common.error"), { id: toastId });
    } catch (error: any) {
      toast.error(
        error?.data?.message || t("common.error"),
        { id: toastId }
      );
    }
  };

  const handleManualSubmit = async () => {
    const paymentId = (window as any).currentPaymentId;
    if (!paymentId || !trxId) {
      toast.error("Transaction ID is required");
      return;
    }

    const toastId = toast.loading("Verifying transaction details...");
    try {
      await submitManual({
        paymentId,
        transactionId: trxId,
        senderNumber,
      }).unwrap();
      
      toast.success("Submission successful! Waiting for approval.", { id: toastId });
      router.push("/dashboard/my-payments");
    } catch (error: any) {
      toast.error(error?.data?.message || "Submission failed", { id: toastId });
    }
  };

  const paymentOptions = [
    { id: "BKASH_GATEWAY", name: "বিকাশ পেমেন্ট", color: "bg-[#E2136E]", desc: "সরাসরি পেমেন্ট" },
    { id: "BKASH_MANUAL", name: "বিকাশ (ম্যানুয়াল)", color: "bg-[#E2136E]/80", desc: "নম্বর: 01700000000 (Send Money)" },
    { id: "NAGAD_MANUAL", name: "নগদ (ম্যানুয়াল)", color: "bg-[#F04922]", desc: "নম্বর: 01800000000 (Send Money)" },
    { id: "ROCKET_MANUAL", name: "রকেট (ম্যানুয়াল)", color: "bg-[#8C3494]", desc: "নম্বর: 01900000000 (Send Money)" },
  ];

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 space-y-12 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <AFPageHeader
        title={t("donate.title")}
        description={t("donate.description")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-8 space-y-10">
          {/* Amount Selection */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">
              {t("donate.selectAmount")} (BDT)
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {SUGGESTED_AMOUNTS.map((amt) => (
                <button
                  key={amt}
                  onClick={() => {
                    setAmount(amt.toString());
                    setCustomAmount(false);
                  }}
                  className={cn(
                    "min-h-[3.5rem] sm:h-16 rounded-2xl font-black text-sm transition-all duration-300 border-2 flex items-center justify-center",
                    amount === amt.toString() && !customAmount
                      ? "bg-primary border-transparent text-white shadow-xl shadow-primary/20 scale-105"
                      : "bg-card/40 border-muted/20 hover:border-primary/40 hover:bg-primary/5 text-foreground"
                  )}
                >
                  ৳{amt.toLocaleString()}
                </button>
              ))}
              <button
                onClick={() => setCustomAmount(true)}
                className={cn(
                  "min-h-[3.5rem] sm:h-16 rounded-2xl font-black text-sm transition-all duration-300 flex items-center justify-center border-2",
                  customAmount
                    ? "bg-primary border-transparent text-white shadow-xl shadow-primary/20 scale-105"
                    : "bg-card/40 border-muted/20 hover:border-primary/40 hover:bg-primary/5 text-foreground"
                )}
              >
                {t("donate.customAmount")}
              </button>
            </div>

            {customAmount && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500 mt-2">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-primary font-black">৳</div>
                  <Input
                    type="number"
                    placeholder={t("donate.enterAmount")}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-12 min-h-[3.5rem] sm:h-16 rounded-3xl bg-card/40 border-muted/30 focus:ring-primary/20 font-black text-lg w-full"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Gateway Selection */}
          <section className="space-y-4">
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">
              {t("donate.selectMethod")}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {paymentOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => { setPaymentMethod(opt.id); setManualSubmitted(false); }}
                  className={cn(
                    "p-6 sm:p-8 rounded-2xl border-2 cursor-pointer transition-all duration-500 relative overflow-hidden w-full flex gap-4 items-center",
                    paymentMethod === opt.id
                      ? `${opt.color} border-transparent shadow-2xl text-white scale-[1.02]`
                      : "bg-card/40 border-muted/20 hover:border-primary/40 hover:bg-primary/5"
                  )}
                >
                  <div className={cn(
                    "h-12 w-12 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center transition-colors duration-500",
                    paymentMethod === opt.id ? "bg-white/20" : `bg-primary/10 text-primary`
                  )}>
                    <Wallet size={28} />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-black text-sm sm:text-lg">{opt.name}</h4>
                    <p className={cn(
                      "text-[9px] sm:text-[10px] font-black uppercase tracking-widest",
                      paymentMethod === opt.id ? "text-white/70" : "text-muted-foreground/60"
                    )}>
                      {opt.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Impact Statement */}
          <div className="p-6 sm:p-8 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-[0.03] sm:opacity-[0.05]">
              <Sparkles size={80} className="text-emerald-500" />
            </div>
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-emerald-500/10 flex shadow-inner items-center justify-center shrink-0">
              <Heart size={28} className="text-emerald-500 fill-current animate-pulse" />
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h4 className="text-xs sm:text-sm font-black text-emerald-700 uppercase tracking-widest">{t("donate.monthlyImpact")}</h4>
              <p className="text-[9px] sm:text-xs text-muted-foreground leading-relaxed font-bold">
                {t("donate.impactDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div className="lg:col-span-4 space-y-8">
          <Card className="border-none shadow-2xl rounded-2xl overflow-hidden bg-card/40 backdrop-blur-xl border border-muted/20 sticky top-0 sm:top-24 w-full">
            <div className="p-4 sm:p-6 border-b border-muted/20 bg-primary/5">
              <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] text-primary mb-1">{t("payments.totalPayments")}</h4>
              <p className="text-[9px] sm:text-xs text-muted-foreground font-bold uppercase tracking-widest">{t("payments.title")}</p>
            </div>
            <div className="p-4 sm:p-6 space-y-6">
              {manualSubmitted ? (
                 <div className="space-y-6 animate-in fade-in duration-500">
                    <div className="text-center space-y-2">
                      <h4 className="text-sm font-black uppercase tracking-widest">Submit Details</h4>
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest ml-1">Transaction ID</Label>
                        <Input 
                          value={trxId} 
                          onChange={(e) => setTrxId(e.target.value)} 
                          placeholder="TRX ID" 
                          className="h-12 rounded-xl border-muted/20 bg-background/50"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[9px] font-black uppercase tracking-widest ml-1">Sender Number</Label>
                        <Input 
                          value={senderNumber} 
                          onChange={(e) => setSenderNumber(e.target.value)} 
                          placeholder="01XXXXXXXXX" 
                          className="h-12 rounded-xl border-muted/20 bg-background/50"
                        />
                      </div>
                    </div>
                    <Button
                      onClick={handleManualSubmit}
                      disabled={submittingManual}
                      className="w-full h-14 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 transition-all font-black uppercase text-[10px] tracking-[0.2em]"
                    >
                      {submittingManual ? <Loader2 className="animate-spin" /> : "Confirm Submission"}
                    </Button>
                 </div>
              ) : (
                <>
                  {summaryLoading ? (
                    <div className="flex flex-col items-center gap-4 py-6">
                      <Loader2 className="h-8 w-8 animate-spin text-primary/20" />
                      <span className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest animate-pulse">{t("payments.loading")}</span>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between items-center bg-emerald-500/5 p-2 sm:p-4 rounded-xl border border-emerald-500/10">
                        <span className="text-[9px] sm:text-[10px] font-black text-emerald-600 uppercase tracking-widest">Income</span>
                        <span className="text-sm sm:text-lg font-black text-emerald-600 font-mono">৳{summary?.main?.totalIncome?.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center bg-rose-500/5 p-2 sm:p-4 rounded-xl border border-rose-500/10">
                        <span className="text-[9px] sm:text-[10px] font-black text-rose-600 uppercase tracking-widest">Expense</span>
                        <span className="text-sm sm:text-lg font-black text-rose-600 font-mono">৳{summary?.main?.totalExpense?.toLocaleString()}</span>
                      </div>
                      <div className="pt-2 sm:pt-4 text-center">
                        <p className="text-[9px] sm:text-[10px] font-black text-muted-foreground uppercase tracking-widest">Balance</p>
                        <p className="text-3xl sm:text-5xl font-black text-primary text-center font-mono leading-none drop-shadow-sm">৳{summary?.totalBalance?.toLocaleString()}</p>
                      </div>
                    </>
                  )}

                  <div className="h-px bg-muted/30" />

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("donate.selectMethod")}</span>
                      <span className="text-xs sm:text-sm font-black">{paymentMethod}</span>
                    </div>
                    <div className="flex justify-between items-center text-primary">
                      <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest">{t("donate.confirmDonation")}</span>
                      <span className="text-xl sm:text-2xl font-black">৳{Number(amount).toLocaleString()}</span>
                    </div>
                  </div>

                  <Button
                    onClick={handleDonate}
                    disabled={processing || !amount || Number(amount) <= 0}
                    className="w-full min-h-[3.5rem] sm:h-16 rounded-2xl bg-primary hover:scale-[1.02] active:scale-95 shadow-2xl shadow-primary/30 transition-all font-black uppercase text-xs sm:text-sm tracking-[0.2em] relative overflow-hidden group/btn flex items-center justify-center gap-2"
                  >
                    {processing ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        {t("donate.processing")}
                      </>
                    ) : (
                      <>
                        {t("donate.confirmDonation")}
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>
                </>
              )}

              <div className="flex items-center justify-center gap-2 py-2 text-[8px] sm:text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                <ShieldCheck size={14} className="text-emerald-500" />
                Secured & Encrypted
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}