"use client";

import { useTranslation } from "react-i18next";

export default function TermsPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-32 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">
        {t("legal.terms.title")}
      </h1>
      <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/70 leading-relaxed">
        <p>{t("legal.terms.content")}</p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-foreground">
          1. Use License
        </h2>
        <p>
          Permission is granted to temporarily download one copy of the
          materials (information or software) on Alhamdulillah Foundation's
          website for personal, non-commercial transitory viewing only.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-foreground">
          2. Disclaimer
        </h2>
        <p>
          The materials on Alhamdulillah Foundation's website are provided on an
          'as is' basis. Alhamdulillah Foundation makes no warranties, expressed
          or implied, and hereby disclaims and negates all other warranties
          including, without limitation, implied warranties or conditions of
          merchantability, fitness for a particular purpose, or non-infringement
          of intellectual property or other violation of rights.
        </p>
      </div>
    </div>
  );
}
