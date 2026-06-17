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
    <section id="projects" className="py-24 md:py-32 relative overflow-hidden bg-mesh">
      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="max-w-3xl mb-16 md:mb-24" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">Our Impact</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            ACTIVE <span className="text-gradient">COMMUNITY</span> <br />
            PROJECTS
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {t("project.desc", {
              defaultValue:
                "Explore our ongoing initiatives designed to provide sustainable support and create lasting change in local communities.",
            })}
          </p>
        </div>

        {/* PROJECT GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {projectsData?.data?.slice(0, 4).map((project: any, index: number) => (
            <div key={project?._id} data-aos="fade-up" data-aos-delay={index * 100}>
              <ProjectCard project={project} />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16 md:mt-24" data-aos="fade-up">
          <Link href="/projects">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full px-10 h-14 font-bold glass hover:bg-white/5 transition-all group"
            >
              {t("project.exploreAll")}
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}