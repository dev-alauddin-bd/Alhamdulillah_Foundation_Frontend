"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Users } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AboutUsSection() {
  const { t } = useTranslation();

  return (
    <section id="about" className="w-full border-t border-border/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-24">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 items-center">
          {/* ================= LEFT CONTENT ================= */}
          <div className="space-y-5 sm:space-y-6">
       
             {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
      
           <h2 className="text-4xl md:text-5xl font-black mb-6 bg-gradient-to-r from-primary via-emerald-600 to-amber-500 bg-clip-text text-transparent">
             {t("about.title", { defaultValue: "We'd Love to Hear From You" })}
           </h2>
           <p className="text-lg text-muted-foreground leading-relaxed">
             {t("about.desc", { defaultValue: "Have a question or want to get involved? Reach out to us and we'll get back to you as soon as possible." })}
           </p>
        </div>

            {/* STATS */}
            <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
              <div className="rounded-xl p-4 bg-primary/5 border border-primary/10">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/20">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base">
                  {t("about.membersCount")}
                </h4>
                <p className="text-xs sm:text-sm text-foreground/60">
                  {t("about.membersDesc")}
                </p>
              </div>

              <div className="rounded-xl p-4 bg-secondary/5 border border-secondary/10">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-secondary/20">
                  <ArrowRight className="h-5 w-5 text-secondary -rotate-45" />
                </div>
                <h4 className="font-semibold text-sm sm:text-base">
                  {t("about.projectsCount")}
                </h4>
                <p className="text-xs sm:text-sm text-foreground/60">
                  {t("about.projectsDesc")}
                </p>
              </div>
            </div>

            {/* LINK */}
            <Link href="/about">
              <Button
                variant="link"
                className="px-0 text-primary text-base sm:text-lg gap-2"
              >
                {t("about.visionLink")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <div className="relative mx-auto w-full max-w-sm sm:max-w-md md:max-w-none">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-tr from-primary/20 to-secondary/20 border border-border flex items-center justify-center">
              <div className="text-7xl sm:text-8xl md:text-9xl opacity-20 grayscale">
                🌾🐟🏢
              </div>
            </div>

            {/* FLOATING CARD */}
            {/* FLOATING CARD */}
            <div
              className="
    absolute
    bottom-4 left-1/2
    -translate-x-1/2

    sm:bottom-6 sm:left-6 sm:translate-x-0
    md:bottom-8 md:left-8

    max-w-[160px] sm:max-w-[190px] md:max-w-[220px]
    rounded-2xl
    border border-border
    bg-background
    p-4 sm:p-5
    shadow-xl
  "
            >
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                {t("about.transparency")}
              </p>
              <p className="text-xs sm:text-sm text-foreground/60">
                {t("about.transparencyDesc")}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
