"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useInitiatePaymentMutation, useSubmitManualPaymentMutation } from "@/redux/features/payment/paymentApi";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import {
  CheckCircle,
  ArrowRight,
  Loader2,
  Zap,
  Star,
  Info,
} from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

const MEMBERSHIP_FEE = 1000;

export default function MembershipActivationPage() {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<string>("BKASH_GATEWAY");
  const [trxId, setTrxId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [manualSubmitted, setManualSubmitted] = useState(false);
  const user = useSelector(selectCurrentUser);
  const router = useRouter();
  
  const [initiatePayment, { isLoading: processing }] = useInitiatePaymentMutation();
  const [submitManual, { isLoading: submittingManual }] = useSubmitManualPaymentMutation();

  // 🔒 Requirement: Super Admin and Admin should not see this page
  // Redirect if user is already a member or admin
  useEffect(() => {
    if (user && (user.role === "MEMBER" || user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (user && (user.role === "MEMBER" || user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Loader2 className="animate-spin h-10 w-10 text-primary" />
        <p className="text-muted-foreground">ড্যাশবোর্ডে নিয়ে যাওয়া হচ্ছে...</p>
      </div>
    );
  }

  const handleActivate = async () => {
    const toastId = toast.loading("পেমেন্ট গেটওয়ে লোড হচ্ছে...");
    try {
      const response = await initiatePayment({
        amount: MEMBERSHIP_FEE,
        method: paymentMethod as any,
        purpose: "MEMBERSHIP_FEE",
      }).unwrap();

      const gatewayUrl = response?.data?.gatewayUrl;
      const paymentId = response?.data?.paymentId;

      if (gatewayUrl) {
        toast.success("পেমেন্ট পেজে রিডাইরেক্ট করা হচ্ছে...", { id: toastId });
        window.location.href = gatewayUrl;
        return;
      }

      if (paymentMethod.includes("MANUAL")) {
        toast.success("পেমেন্ট রেকর্ড তৈরি হয়েছে। এবার তথ্য সাবমিট করুন।", { id: toastId });
        setManualSubmitted(true);
        (window as any).currentPaymentId = paymentId;
        return;
      }

      toast.error("পেমেন্ট গেটওয়েতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", { id: toastId });
    } catch (error: any) {
      toast.error(error?.data?.message || "সার্ভার এরর হয়েছে।", { id: toastId });
    }
  };

  const handleManualSubmit = async () => {
    const paymentId = (window as any).currentPaymentId;
    if (!paymentId || !trxId) {
      toast.error("Transaction ID অবশ্যই দিতে হবে");
      return;
    }

    const toastId = toast.loading("তথ্য যাচাই করা হচ্ছে...");
    try {
      await submitManual({
        paymentId,
        transactionId: trxId,
        senderNumber,
      }).unwrap();
      
      toast.success("তথ্য সফলভাবে জমা দেওয়া হয়েছে! অ্যাডমিন অ্যাপ্রুভালের জন্য অপেক্ষা করুন।", { id: toastId });
      router.push("/dashboard/my-payments");
    } catch (error: any) {
      toast.error(error?.data?.message || "সাবমিশন ফেইল হয়েছে", { id: toastId });
    }
  };

  const paymentOptions = [
    { id: "BKASH_GATEWAY", name: "বিকাশ পেমেন্ট", color: "bg-[#E2136E]", desc: "অ্যাপ বা গেটওয়ের মাধ্যমে" },
    { id: "BKASH_MANUAL", name: "বিকাশ (ম্যানুয়াল)", color: "bg-[#E2136E]/90", desc: "নম্বর: 01700000000 (Send Money)" },
    { id: "NAGAD_MANUAL", name: "নগদ (ম্যানুয়াল)", color: "bg-[#F04922]", desc: "নম্বর: 01800000000 (Send Money)" },
    { id: "ROCKET_MANUAL", name: "রকেট (ম্যানুয়াল)", color: "bg-[#8C3494]", desc: "নম্বর: 01900000000 (Send Money)" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 py-10 px-4">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black text-foreground">মেম্বারশিপ অ্যাক্টিভেশন</h1>
        <p className="text-muted-foreground text-lg">ফাউন্ডেশনের স্থায়ী মেম্বার হতে পেমেন্ট সম্পন্ন করুন।</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left: Summary */}
        <Card className="border-none shadow-xl bg-primary/5 p-8 rounded-3xl space-y-6">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                 <Star fill="currentColor" size={24} />
              </div>
              <div>
                 <h3 className="font-bold text-xl">ফাউন্ডেশন মেম্বার</h3>
                 <p className="text-sm text-muted-foreground">এককালীন মেম্বারশিপ ফি</p>
              </div>
           </div>

           <div className="py-6 border-y border-primary/10">
              <div className="flex justify-between items-center text-2xl font-black">
                 <span>মোট পরিমাণ:</span>
                 <span className="text-primary">৳১,০০০</span>
              </div>
           </div>

           <div className="space-y-4">
              <p className="text-sm font-bold text-muted-foreground flex items-center gap-2">
                 <Info size={16} /> মেম্বার হওয়ার সুবিধা:
              </p>
              <ul className="space-y-2">
                 {["স্থায়ী সদস্যপদ", "ভোট দেওয়ার ক্ষমতা", "ফাউন্ডেশন ব্যাজ", "প্রজেক্টে অগ্রাধিকার"].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm font-medium">
                       <CheckCircle size={16} className="text-emerald-500" /> {item}
                    </li>
                 ))}
              </ul>
           </div>
        </Card>

        {/* Right: Payment */}
        <div className="space-y-6">
           {!manualSubmitted ? (
             <>
               <div className="space-y-4">
                  <h4 className="font-bold text-sm uppercase tracking-widest text-muted-foreground">পেমেন্ট মাধ্যম সিলেক্ট করুন</h4>
                  <div className="grid grid-cols-1 gap-3">
                     {paymentOptions.map((opt) => (
                        <div 
                          key={opt.id}
                          onClick={() => setPaymentMethod(opt.id)}
                          className={cn(
                            "p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4",
                            paymentMethod === opt.id 
                              ? "border-primary bg-primary/5 shadow-md" 
                              : "border-muted/20 hover:border-primary/20"
                          )}
                        >
                           <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white", opt.color)}>
                              <Zap size={20} />
                           </div>
                           <div className="flex-1">
                              <h5 className="font-bold text-sm">{opt.name}</h5>
                              <p className="text-[10px] text-muted-foreground">{opt.desc}</p>
                           </div>
                           {paymentMethod === opt.id && <CheckCircle size={20} className="text-primary" />}
                        </div>
                     ))}
                  </div>
               </div>

               <Button
                 onClick={handleActivate}
                 disabled={processing}
                 className="w-full h-14 rounded-2xl bg-foreground text-background hover:bg-foreground/90 font-bold text-lg"
               >
                 {processing ? <Loader2 className="animate-spin mr-2" /> : "পেমেন্ট নিশ্চিত করুন"}
               </Button>
             </>
           ) : (
             <Card className="p-6 border-2 border-emerald-500/20 bg-emerald-500/5 rounded-3xl space-y-6 animate-in zoom-in duration-500">
                <div className="text-center space-y-2">
                   <h4 className="text-xl font-bold">পেমেন্ট তথ্য দিন</h4>
                   <p className="text-xs text-muted-foreground">আপনার ট্রানজিশন আইডি এবং সেন্ডার নম্বরটি লিখুন।</p>
                </div>
                
                <div className="space-y-4">
                   <div className="space-y-2">
                      <Label className="text-xs font-bold ml-1">Transaction ID</Label>
                      <Input 
                        value={trxId} 
                        onChange={(e) => setTrxId(e.target.value)} 
                        placeholder="যেমন: 8N7X2K..." 
                        className="h-12 rounded-xl"
                      />
                   </div>
                   <div className="space-y-2">
                      <Label className="text-xs font-bold ml-1">সেন্ডার নম্বর (বিকাশ/নগদ)</Label>
                      <Input 
                        value={senderNumber} 
                        onChange={(e) => setSenderNumber(e.target.value)} 
                        placeholder="01XXXXXXXXX" 
                        className="h-12 rounded-xl"
                      />
                   </div>
                </div>

                <Button
                  onClick={handleManualSubmit}
                  disabled={submittingManual}
                  className="w-full h-14 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 font-bold"
                >
                  {submittingManual ? <Loader2 className="animate-spin" /> : "তথ্য সাবমিট করুন"}
                </Button>
                
                <Button 
                  variant="ghost" 
                  onClick={() => setManualSubmitted(false)}
                  className="w-full text-xs text-muted-foreground underline"
                >
                   ভুল মেথড সিলেক্ট করেছেন? ব্যাকে যান
                </Button>
             </Card>
           )}
           
           <p className="text-center text-[10px] text-muted-foreground leading-relaxed">
             পেমেন্ট সংক্রান্ত কোনো সমস্যা হলে আমাদের সাপোর্ট নাম্বারে যোগাযোগ করুন।
           </p>
        </div>
      </div>
    </div>
  );
}
