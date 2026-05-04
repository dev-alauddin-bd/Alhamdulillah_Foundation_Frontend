"use client";

import { Card } from "@/components/ui/card";
import { Users, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function ProjectCard({ project }: any) {
  const { t } = useTranslation();
  const progress = Math.min(((project.totalInvestment || 0) / (project.intialInvestment || 1)) * 100, 100);

  return (
    <Link href={`/projects/${project._id}`} className="group block h-full">
      <Card className="h-full bg-card/40 backdrop-blur-md border-white/5 hover:border-primary/50 transition-all duration-500 rounded-[2rem] overflow-hidden flex flex-col relative group-hover:shadow-[0_15px_40px_-15px_rgba(16,185,129,0.2)]">
        
        {/* Compact Image Container */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={project.thumbnail}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-1000 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-90" />
          
          <div className="absolute top-4 right-4">
            <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest backdrop-blur-xl border border-white/10 text-white ${
              project.status === "ongoing" ? "bg-primary/80" : "bg-white/10"
            }`}>
              {project.status}
            </span>
          </div>
        </div>

        {/* Mini Content Area */}
        <div className="p-6 flex flex-col flex-1 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="h-px w-3 bg-primary" />
              <span className="text-[9px] font-black text-primary uppercase tracking-[0.15em]">
                {project.category}
              </span>
            </div>
            <h3 className="font-black text-lg tracking-tighter text-white group-hover:text-primary transition-colors line-clamp-1 leading-none">
              {project.name}
            </h3>
            <p className="text-xs text-muted-foreground/70 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="pt-4 mt-auto space-y-4 border-t border-white/5">
            {/* Progress Section */}
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <span className="text-[9px] font-black text-muted-foreground/50 uppercase tracking-widest">৳{(project.intialInvestment || 0).toLocaleString()}</span>
                <span className="text-[9px] font-black text-primary uppercase tracking-widest">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-1000"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Compact Bottom Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-2 py-1 rounded-lg bg-white/5 border border-white/5">
                <Users size={12} className="text-primary" />
                <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                  {project.members?.length || 0}
                </span>
              </div>
              
              <ArrowRight size={14} className="text-primary group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}
