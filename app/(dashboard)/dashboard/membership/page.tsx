"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useInitiatePaymentMutation } from "@/redux/features/payment/paymentApi";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle,
  ArrowRight,
  Loader2,
  Lock,
  Zap,
  Star,
  ShieldAlert,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const MEMBERSHIP_FEE = 1000;

export default function MembershipActivationPage() {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<string>("SSLCOMMERZ");
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  const [initiatePayment, { isLoading: processing }] = useInitiatePaymentMutation();

  if (user && (user.role === "MEMBER" || user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-8 animate-in zoom-in duration-700">
        <div className="relative">
          <div className="h-32 w-32 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <CheckCircle size={64} className="text-emerald-500" />
          </div>
          <div className="absolute -top-2 -right-2 h-10 w-10 bg-emerald-500 rounded-full border-4 border-background flex items-center justify-center animate-bounce">
            <Star size={16} className="text-white fill-current" />
          </div>
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-black tracking-tight text-foreground">{t("membership.alreadyActive")}</h1>
          <p className="text-muted-foreground font-medium">{t("membership.alreadyActiveDesc")}</p>
        </div>
        <Button 
          onClick={() => router.push("/dashboard")} 
          className="h-14 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all hover:scale-105 active:scale-95"
        >
          {t("membership.returnToDashboard")}
        </Button>
      </div>
    );
  }

  const handleActivate = async () => {
    const toastId = toast.loading("Initializing membership protocol...");

    try {
      const response = await initiatePayment({
        amount: MEMBERSHIP_FEE,
        method: paymentMethod as any,
        purpose: "MEMBERSHIP_FEE",
      }).unwrap();

      const gatewayUrl = response?.data?.gatewayUrl;

      if (gatewayUrl) {
        toast.success("Redirecting to secured gateway...", { id: toastId });
        // Use window.location for external redirect, but if it was internal, we'd use router.push
        window.location.href = gatewayUrl; 
        return;
      }

      toast.error("Gateway response invalid. Please retry.", { id: toastId });
    } catch (error: any) {
      toast.error(
        error?.data?.message || "Protocol rejection. Internal service error.",
        { id: toastId }
      );
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <AFPageHeader
        title={t("membership.title")}
        description={t("membership.description")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left: Branding & Perks */}
        <div className="lg:col-span-5 space-y-8">
          <div className="relative group perspective-1000">
             <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600 to-primary blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 rounded-[2.5rem]" />
             <Card className="relative border-none bg-emerald-950 text-white shadow-2xl rounded-[2.5rem] overflow-hidden">
                <div className="absolute top-0 right-0 p-8">
                   <Star className="text-emerald-500/20 fill-current h-32 w-32 -mr-16 -mt-16" />
                </div>
                <CardContent className="p-10 space-y-10">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-none px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest backdrop-blur-md">
                    {t("membership.diamondTier")}
                  </Badge>
                  
                  <div className="space-y-4">
                    <h3 className="text-4xl font-black tracking-tight leading-none">{t("membership.globalPartner")}</h3>
                    <p className="text-emerald-100/60 text-sm font-medium leading-relaxed">
                      {t("membership.partnerDesc")}
                    </p>
                  </div>

                  <div className="space-y-4">
                    {[
                      t("membership.votingRights"),
                      t("membership.prioritySlots"),
                      t("membership.verifiedBadge"),
                      t("membership.impactReports"),
                    ].map((perk, i) => (
                      <div key={i} className="flex items-center gap-4 text-sm font-black group/item">
                        <div className="h-7 w-7 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0 group-hover/item:bg-emerald-500/40 transition-colors">
                          <CheckCircle size={14} className="text-emerald-400" />
                        </div>
                        <span className="opacity-80 group-hover/item:opacity-100 transition-opacity">{perk}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-8 border-t border-white/10 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500 mb-1">{t("membership.oneTimeFee")}</p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black">৳1,000</span>
                      </div>
                    </div>
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 font-black rounded-lg">{t("membership.currency")}</Badge>
                  </div>
                </CardContent>
             </Card>
          </div>

          <div className="p-8 bg-primary/5 rounded-[2.5rem] border border-primary/10 flex gap-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:scale-110 transition-transform duration-700">
               <ShieldAlert size={80} className="text-primary" />
            </div>
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
               <ShieldCheck className="text-primary" size={28} />
            </div>
            <div className="space-y-2 relative">
              <h4 className="text-sm font-black text-foreground uppercase tracking-widest">{t("membership.enterpriseSecurity")}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed font-bold">
                {t("membership.securityDesc")}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Payment Logic */}
        <div className="lg:col-span-7 space-y-8">
           <section className="space-y-6">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">{t("membership.selectGateway")}</h3>
                <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1.5">
                  <Lock size={12} /> {t("membership.secureChannel")}
                </span>
              </div>

              <div className="grid grid-cols-1 gap-6">
                  {/* SSLCommerz Card */}
                  <div 
                    onClick={() => setPaymentMethod("SSLCOMMERZ")}
                    className={cn(
                      "group p-8 rounded-[2.5rem] border-2 cursor-pointer transition-all duration-500 relative overflow-hidden",
                      paymentMethod === "SSLCOMMERZ" 
                        ? "bg-indigo-600 border-transparent shadow-2xl shadow-indigo-600/20 text-white scale-[1.02]" 
                        : "bg-card/40 border-muted/20 hover:border-indigo-500/40 hover:bg-indigo-500/5"
                    )}
                  >
                     <div className="relative z-10 space-y-4">
                        <div className={cn(
                          "h-14 w-14 rounded-2xl flex items-center justify-center transition-colors duration-500",
                          paymentMethod === "SSLCOMMERZ" ? "bg-white/20" : "bg-indigo-500/10 text-indigo-500"
                        )}>
                           <Zap size={28} />
                        </div>
                        <div>
                           <h4 className="font-black text-xl tracking-tight">{t("membership.sslCommerz")}</h4>
                           <p className={cn(
                             "text-[10px] font-black uppercase tracking-widest",
                             paymentMethod === "SSLCOMMERZ" ? "text-white/70" : "text-muted-foreground/60"
                           )}>{t("membership.paymentMethods")}</p>
                        </div>
                     </div>
                     <div className={cn(
                       "absolute -right-8 -bottom-8 h-32 w-32 rounded-full blur-3xl opacity-20",
                       paymentMethod === "SSLCOMMERZ" ? "bg-white" : "bg-indigo-500"
                     )} />
                  </div>
              </div>
           </section>

           <div className="bg-card/30 backdrop-blur-md p-10 rounded-[3rem] border border-muted/20 shadow-sm space-y-8">
              <div className="space-y-4">
                 <div className="flex justify-between items-end border-b border-muted/20 pb-6">
                    <div>
                       <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-1">{t("membership.finalClearance")}</h4>
                       <p className="text-xl font-black text-foreground">{t("membership.membershipCert")}</p>
                    </div>
                    <div className="text-right">
                       <span className="text-3xl font-black text-primary">৳1,000</span>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{t("membership.gateway")}</p>
                       <p className="text-xs font-black">{paymentMethod}</p>
                    </div>
                    <div className="text-right space-y-1">
                       <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">{t("membership.currency")}</p>
                       <p className="text-xs font-black">BDT</p>
                    </div>
                 </div>
              </div>

              <Button
                onClick={handleActivate}
                disabled={processing}
                className="w-full h-16 rounded-[1.5rem] bg-foreground text-background hover:bg-foreground/90 transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-foreground/10 font-black uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4"
              >
                {processing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    {t("membership.processing")}
                  </>
                ) : (
                  <>
                    {t("membership.confirmAuth")}
                    <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </Button>
              
              <p className="text-center text-[9px] text-muted-foreground/60 font-bold uppercase tracking-widest px-10 leading-relaxed">
                {t("membership.securityNote")}
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
