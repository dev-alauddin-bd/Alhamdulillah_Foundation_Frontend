"use client";

import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Briefcase, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative w-full h-[85vh] md:h-[95vh] lg:h-screen overflow-hidden bg-background">
      {/* Background Image with optimized overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832&auto=format&fit=crop"
          alt="Alhamdulillah Foundation Banner"
          fill
          className="object-cover scale-110 motion-safe:animate-[subtle-zoom_20s_infinite_alternate]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/20 to-transparent" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      <div className="relative z-10 h-full container mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12 pt-20">
        {/* Left Side: Content & Action Buttons */}
        <div className="flex-1 space-y-6 md:space-y-10 text-left animate-in fade-in slide-in-from-left-8 duration-1000">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/10">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.2em] uppercase opacity-90 text-white">
                {t("home.empowering")}
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9] text-white">
              {t("hero.title")}
            </h1>

            <p className="text-lg md:text-xl text-white/70 max-w-xl leading-relaxed">
              {t("hero.subtitle")}
            </p>
          </div>

          {/* Awesome Action Buttons on Left */}
          <div className="flex flex-wrap gap-4 md:gap-6 pt-4">
            <Link href="/projects">
              <Button size="lg" className="h-16 md:h-20 rounded-2xl px-10 text-lg font-black shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-10px_rgba(16,185,129,0.6)] group bg-primary hover:bg-primary/90 transition-all duration-500 overflow-hidden relative">
                <span className="relative z-10 flex items-center gap-3">
                  {t("hero.exploreProjects")}
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-500" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </Button>
            </Link>

            <Link href="/register">
              <Button size="lg" variant="outline" className="h-16 md:h-20 rounded-2xl px-10 text-lg font-black glass text-white border-white/10 hover:border-white/30 hover:bg-white/10 transition-all duration-500 group">
                <span className="flex items-center gap-3">
                  {t("hero.joinInvestor")}
                  <div className="w-2 h-2 rounded-full bg-white opacity-20 group-hover:opacity-100 group-hover:scale-150 transition-all duration-500" />
                </span>
              </Button>
            </Link>
          </div>
        </div>

        {/* Right Side: Stats Grid */}
        <div className="flex-1 w-full lg:max-w-md space-y-4 animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
          {[
            { icon: Users, label: t("hero.stats.members") },
            { icon: Briefcase, label: t("hero.stats.projects") },
            { icon: ShieldCheck, label: t("hero.stats.transparency") },
          ].map((stat, i) => (
            <div
              key={i}
              className="group glass border-white/5 hover:border-primary/30 rounded-[2rem] p-6 flex items-center gap-6 transition-all duration-500 hover:bg-white/10"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-500">
                <stat.icon className="text-primary w-7 h-7" />
              </div>
              <div>
                <p className="text-white font-black text-xl md:text-2xl tracking-tight leading-none mb-1">{stat.label}</p>
                <div className="h-0.5 w-0 group-hover:w-full bg-primary/50 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5 pointer-events-none" />

      <style jsx global>{`
        @keyframes subtle-zoom {
          from { transform: scale(1.05); }
          to { transform: scale(1.15); }
        }
      `}</style>
    </section>
  );
}