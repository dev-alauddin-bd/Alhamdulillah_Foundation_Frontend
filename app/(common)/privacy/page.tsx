"use client";

import { useTranslation } from "react-i18next";

export default function PrivacyPage() {
  const { t } = useTranslation();

  return (
    <div className="container mx-auto px-4 py-32 max-w-4xl">
      <h1 className="text-4xl font-bold mb-8 text-primary">
        {t("legal.privacy.title")}
      </h1>
      <div className="prose prose-lg dark:prose-invert max-w-none text-foreground/70 leading-relaxed">
        <p>{t("legal.privacy.content")}</p>
        <p className="mt-4">
          We only ask for personal information when we truly need it to provide
          a service to you. We collect it by fair and lawful means, with your
          knowledge and consent. We also let you know why we’re collecting it
          and how it will be used.
        </p>
        <h2 className="text-2xl font-bold mt-12 mb-4 text-foreground">
          Data Retention
        </h2>
        <p>
          We only retain collected information for as long as necessary to
          provide you with your requested service. What data we store, we’ll
          protect within commercially acceptable means to prevent loss and
          theft, as well as unauthorized access, disclosure, copying, use or
          modification.
        </p>
      </div>
    </div>
  );
}
