"use client";

import ProjectForm from "@/components/projects/ProjectForm";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { useTranslation } from "react-i18next";

export default function NewProjectPage() {
  const { t } = useTranslation();
  return (
    <div className="space-y-6">
      <AFPageHeader
        title={t("projects.createProject")}
        description={t("projects.description")}
      />

      <ProjectForm />
    </div>
  );
}
