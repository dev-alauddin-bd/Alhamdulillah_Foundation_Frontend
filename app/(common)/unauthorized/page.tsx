"use client";

import Link from "next/link";
import { ShieldAlert, ArrowLeft, Lock, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center mt-8 p-2">
      <Card className="max-w-sm sm:max-w-md w-full border-none shadow-md overflow-hidden rounded-xl bg-background/80 backdrop-blur-md">
        <div className="relative p-4 sm:p-8 flex flex-col items-center text-center gap-4 sm:gap-6">
          {/* Animated Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 sm:w-36 sm:h-36 bg-red-500/10 blur-[60px] rounded-full" />

          {/* Main Icon */}
          <div className="relative">
            <div className="h-16 w-16 sm:h-20 sm:w-20 bg-red-500/10 rounded-xl flex items-center justify-center ring-2 ring-white shadow-lg animate-pulse">
              <ShieldAlert className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
            </div>
            <div className="absolute -bottom-1 -right-1 bg-background p-1 rounded-lg shadow border border-red-100">
              <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-red-600" />
            </div>
          </div>

          {/* Text */}
          <div className="space-y-2 sm:space-y-3 relative">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight">
              Access Restricted
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground leading-snug max-w-[220px] sm:max-w-xs mx-auto font-medium">
              Security Protocol: Your current account level does not have clearance for this sector.
            </p>
          </div>

          {/* Info Card */}
          <div className="w-full bg-muted/20 p-3 sm:p-4 rounded-xl border border-muted flex gap-2 sm:gap-3 text-left">
            <div className="h-6 w-6 sm:h-8 sm:w-8 shrink-0 bg-primary/10 rounded flex items-center justify-center text-primary">
              <Info size={14} className="sm:!h-4 sm:!w-4" />
            </div>
            <div className="space-y-1">
              <h4 className="font-bold text-[9px] sm:text-xs uppercase tracking-widest text-primary">
                Security Note
              </h4>
              <p className="text-[7px] sm:text-[9px] text-muted-foreground leading-tight italic">
                If you believe this is a mistake, contact the System Administrator to request elevated privileges (SUPER_ADMIN status).
              </p>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
            <Link href="/dashboard" className="flex-1">
              <Button className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl font-bold shadow-sm hover:scale-[1.02] active:scale-95 transition-all text-xs sm:text-sm bg-primary">
                Return to Dashboard
              </Button>
            </Link>
            <Link href="/" className="flex-1">
              <Button
                variant="outline"
                className="w-full h-10 sm:h-12 rounded-lg sm:rounded-xl font-bold border transition-all hover:bg-muted text-xs sm:text-sm"
              >
                <ArrowLeft className="mr-1 h-3 w-3 sm:h-4 sm:w-4" /> Back Home
              </Button>
            </Link>
          </div>
        </div>
      </Card>

      <p className="mt-4 sm:mt-6 text-[6px] sm:text-[8px] uppercase font-bold tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground opacity-40 text-center">
        Encryption ID: AF-RESTRICTED-403-PRTCL
      </p>
    </div>
  );
}