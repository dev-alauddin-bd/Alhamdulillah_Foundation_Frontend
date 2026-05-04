"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { t } = useTranslation();

  const faqQuestions = t("faq.questions", {
    returnObjects: true,
  }) as { q: string; a: string }[];

  return (
    <section id="faq" className="py-24 md:py-32 relative overflow-hidden bg-mesh">
      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="max-w-3xl mb-16 md:mb-24" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">{t("faq.commonInquiries")}</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            {t("faq.frequentlyAsked")}
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {t("faq.desc", {
              defaultValue:
                "Find answers to common questions about our work, mission, and how you can get involved.",
            })}
          </p>
        </div>

        {/* FAQ GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
          {Array.isArray(faqQuestions) &&
            faqQuestions.map((q, i) => {
              const isOpen = expandedFAQ === i;

              return (
                <div
                  key={i}
                  data-aos="fade-up"
                  data-aos-delay={i * 50}
                >
                  <Card
                    onClick={() => setExpandedFAQ(isOpen ? null : i)}
                    className={`group cursor-pointer p-6 md:p-8 rounded-[2rem] glass transition-all duration-500 border-white/5 overflow-hidden ${
                      isOpen ? "ring-2 ring-primary/20 bg-white/5" : "hover:bg-white/5"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <span className={`text-xl font-black tracking-tighter ${isOpen ? "text-primary" : "text-muted-foreground/30"}`}>
                          {(i + 1).toString().padStart(2, "0")}
                        </span>
                        <h3 className={`font-bold text-lg leading-tight transition-colors ${isOpen ? "text-primary" : "text-foreground"}`}>
                          {q.q}
                        </h3>
                      </div>
                      <div className={`mt-1 p-1.5 rounded-full transition-all duration-500 ${isOpen ? "bg-primary text-white rotate-180 shadow-glow" : "bg-white/5 text-muted-foreground"}`}>
                        <ChevronDown size={18} />
                      </div>
                    </div>

                    <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100 mt-6" : "grid-rows-[0fr] opacity-0"}`}>
                      <div className="overflow-hidden">
                        <p className="pl-10 text-sm md:text-base text-muted-foreground leading-relaxed border-l border-primary/20">
                          {q.a}
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
        </div>

        {/* CTA */}
        <div className="mt-16 md:mt-24 text-center" data-aos="fade-up">
          <p className="text-muted-foreground mb-4">{t("faq.stillHaveQuestions")}</p>
          <Link href="#contact">
            <Button variant="link" className="text-primary font-black tracking-widest uppercase text-xs hover:no-underline group">
              {t("faq.askUsAnything")} 
              <ChevronDown className="ml-2 w-4 h-4 -rotate-90 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}