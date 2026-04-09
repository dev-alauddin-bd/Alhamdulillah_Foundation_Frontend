"use client";

import ProjectCard from "@/components/projects/ProjectCard";
import { Button } from "@/components/ui/button";
import { useGetProjectsQuery } from "@/redux/features/project/projectApi";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function ProjectsSection() {
  const { t } = useTranslation();
  const { data: projectsData } = useGetProjectsQuery({});

  return (
    <section
      id="projects"
      className="
        py-8 sm:py-12 md:py-24
        px-4 md:px-8
      "
    >
      {/* HEADER */}
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
          {t("project.title", {
            defaultValue: "We'd Love to Hear From You",
          })}
        </h2>

        <p
          className="
            text-sm sm:text-base md:text-lg
            text-muted-foreground
            leading-relaxed
          "
        >
          {t("project.desc", {
            defaultValue:
              "Have a question or want to get involved? Reach out to us and we'll get back to you as soon as possible.",
          })}
        </p>
      </div>

      {/* PROJECT GRID */}
      <div className="container mx-auto grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
        {projectsData?.data?.slice(0, 4).map((project: any) => (
          <ProjectCard key={project?._id} project={project} />
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-8 sm:mt-12">
        <Link href="/projects">
          <Button
            variant="outline"
            className="
              rounded-full
              px-5 py-2
              sm:px-8 sm:py-3
              text-sm sm:text-base
            "
          >
            {t("project.exploreAll")}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </section>
  );
}