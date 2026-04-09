"use client";

import { Card } from "@/components/ui/card";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function FaqSection() {
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const { t } = useTranslation();

  const faqQuestions = t("faq.questions", {
    returnObjects: true,
  }) as { q: string; a: string }[];

  return (
    <section
      id="faq"
      className="
        relative overflow-hidden
        py-10 sm:py-14 md:py-28
        bg-accent/5
      "
    >
      {/* Background blobs */}
      <div className="absolute top-1/4 left-0 -z-10 w-72 h-72 sm:w-96 sm:h-96 bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-1/4 right-0 -z-10 w-56 h-56 sm:w-64 sm:h-64 bg-secondary/5 rounded-full blur-[80px]" />

      <div className="container mx-auto px-4">
        {/* ================= HEADER ================= */}
        <div
          className="
            text-center max-w-3xl mx-auto
            mb-8 sm:mb-12 md:mb-20
          "
        >
          <h2
            className="
              font-black
              text-xl sm:text-2xl md:text-5xl
              mb-3 sm:mb-4 md:mb-6
              bg-gradient-to-r from-primary via-emerald-600 to-amber-500
              bg-clip-text text-transparent
            "
          >
            {t("faq.title", {
              defaultValue: "Frequently Asked Questions",
            })}
          </h2>

          <p
            className="
              text-sm sm:text-base md:text-lg
              text-muted-foreground
              leading-relaxed
            "
          >
            {t("faq.desc", {
              defaultValue:
                "Find answers to common questions about our work, mission, and services.",
            })}
          </p>
        </div>

        {/* ================= FAQ GRID ================= */}
        <div
          className="
            grid grid-cols-1 md:grid-cols-2
            gap-4 sm:gap-6
            max-w-6xl mx-auto
          "
        >
          {Array.isArray(faqQuestions) &&
            faqQuestions.map((q, i) => {
              const isOpen = expandedFAQ === i;

              return (
                <Card
                  key={i}
                  onClick={() =>
                    setExpandedFAQ(isOpen ? null : i)
                  }
                  className={`
                    cursor-pointer
                    p-4 sm:p-6 md:p-8
                    rounded-2xl
                    bg-card/50 backdrop-blur-md
                    border border-border/40
                    transition-all duration-300
                    ${
                      isOpen
                        ? "ring-1 ring-primary/20 shadow-xl"
                        : "hover:shadow-lg"
                    }
                  `}
                >
                  {/* Question */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex gap-3">
                      <span
                        className={`
                          text-lg sm:text-xl font-black
                          ${
                            isOpen
                              ? "text-primary"
                              : "text-muted-foreground/30"
                          }
                        `}
                      >
                        {(i + 1).toString().padStart(2, "0")}
                      </span>

                      <h3
                        className={`
                          font-semibold
                          text-sm sm:text-base md:text-lg
                          leading-snug
                          ${
                            isOpen
                              ? "text-primary"
                              : "text-foreground"
                          }
                        `}
                      >
                        {q.q}
                      </h3>
                    </div>

                    <span
                      className={`
                        mt-0.5 p-1.5 rounded-full
                        transition-transform duration-300
                        ${
                          isOpen
                            ? "bg-primary text-white rotate-180"
                            : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </span>
                  </div>

                  {/* Answer */}
                  <div
                    className={`
                      grid transition-all duration-300 ease-in-out
                      ${
                        isOpen
                          ? "grid-rows-[1fr] opacity-100 mt-4"
                          : "grid-rows-[0fr] opacity-0"
                      }
                    `}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="
                          pl-7 sm:pl-8
                          text-xs sm:text-sm md:text-base
                          text-muted-foreground
                          leading-relaxed
                          border-l-2 border-primary/20
                        "
                      >
                        {q.a}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
        </div>

        {/* ================= CTA ================= */}
        <div className="mt-10 sm:mt-14 md:mt-20 text-center">
          <p className="text-sm sm:text-base text-muted-foreground mb-3">
            {t("faq.confussion", {
              defaultValue: "Still have questions?",
            })}
          </p>

          <a
            href="#contact"
            className="
              inline-flex items-center gap-2
              font-semibold text-primary
              hover:gap-3 transition-all
              underline decoration-2 underline-offset-4
            "
          >
            {t("faq.askQuestion", {
              defaultValue: "Ask a Question",
            })}
            <ChevronDown className="-rotate-90 w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}