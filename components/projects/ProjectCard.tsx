import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function ProjectCard({ project }: any) {
  const { t } = useTranslation();

  return (
    <Link href={`/projects/${project._id}`} className="block h-full group">
      <Card className="h-full bg-card/50 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col">
        {/* ===== Thumbnail ===== */}
        <div className="relative h-40 overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            className="object-cover transition-all duration-500 group-hover:scale-105 brightness-[0.7] group-hover:brightness-100"
          />

          {/* Gradient overlay (same design) */}
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-70" />

          {/* Status */}
          <span
            className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg border border-white/20 ${
              project.status === "ongoing"
                ? "bg-emerald-500 text-white"
                : project.status === "upcoming"
                  ? "bg-orange-500 text-white ring-2 ring-orange-500/20"
                  : "bg-rose-600 text-white ring-2 ring-rose-600/20"
            }`}
          >
            {project.status}
          </span>
        </div>

        {/* ===== Content ===== */}
        <div className="p-6 flex flex-col flex-1">
          {/* Category */}
          <p className="text-[10px] text-primary font-semibold uppercase tracking-wider mb-1">
            {project.category}
          </p>

          {/* Name */}
          <h3 className="font-bold text-base text-foreground group-hover:text-primary transition mb-1">
            {project.name}
          </h3>

          {/* Description */}
          <p className="text-[11px] text-foreground/60 line-clamp-2 mb-4 leading-relaxed flex-1">
            {project.description}
          </p>

          {/* Amount */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-foreground/70">Initial Investment</span>
              <span className="text-primary font-semibold">
                ৳{(project.intialInvestment || 0).toLocaleString()}
              </span>
            </div>

            <div className="w-full bg-muted rounded-full h-2">
              <div
                className={`h-2 rounded-full ${project.totalInvestment >= project.intialInvestment ? "bg-green-500" : "bg-primary"}`}
                style={{
                  width: `${Math.min(((project.totalInvestment || 0) / (project.intialInvestment || 1)) * 100, 100)}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-[10px] mt-1 text-foreground/50">
              <span>
                Total: ৳{(project.totalInvestment || 0).toLocaleString()}
              </span>
              <span>{project.members?.length || 0} Members</span>
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
