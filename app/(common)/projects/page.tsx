"use client";

import { useState } from "react";
import { useGetProjectsQuery } from "@/redux/features/project/projectApi";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Filter, X, LayoutGrid, Briefcase, Sprout, Fish, Home } from "lucide-react";
import { useTranslation } from "react-i18next";
import ProjectCard from "@/components/projects/ProjectCard";
import { AFPagination } from "@/components/shared/AFPagination";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);

  const { data, isLoading, isFetching } = useGetProjectsQuery({
    search: searchTerm,
    status: statusFilter === "all" ? undefined : statusFilter,
    category: categoryFilter === "all" ? undefined : categoryFilter,
    page,
    limit: 12, // Increased limit for smaller cards
  });

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* 1. PREMIUM HEADER */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-white/5">
        <div className="absolute inset-0 bg-mesh opacity-30" />
        <div className="container mx-auto px-6 relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="flex-1 text-left space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass border-white/10">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_10px_var(--primary)]" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-90 text-white">
                {t("common.projects")}
              </span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.85]">
              {t("projects.exploreImpact")}
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-xl">
              {t("project.desc", { defaultValue: "Empowering communities through sustainable, transparent, and collaborative investments." })}
            </p>
          </div>
        </div>
      </section>

      {/* 2. PREMIUM HORIZONTAL FILTER BAR */}
      <section className="container mx-auto px-6 -mt-12 relative z-20">
        <div className="glass p-4 md:p-6 rounded-[2rem] md:rounded-[3rem] border-white/10 shadow-2xl backdrop-blur-2xl">
          <div className="flex flex-col gap-6">
            
            {/* Top Row: Search & Status */}
            <div className="flex flex-col md:flex-row items-center gap-4">
              {/* Search */}
              <div className="relative flex-1 w-full group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-all duration-300" />
                <Input
                  placeholder={t("projects.searchPlaceholder")}
                  className="pl-14 h-14 md:h-16 bg-white/5 border-white/10 rounded-2xl md:rounded-full text-lg focus:ring-primary/20 focus:border-primary/50 transition-all placeholder:text-muted-foreground/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Status Tabs */}
              <div className="flex p-1.5 bg-white/5 rounded-2xl md:rounded-full border border-white/10 w-full md:w-auto overflow-x-auto no-scrollbar">
                {["all", "ongoing", "upcoming", "completed"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={cn(
                      "px-6 h-11 md:h-12 rounded-xl md:rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap",
                      statusFilter === s 
                        ? "bg-primary text-white shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:text-white hover:bg-white/5"
                    )}
                  >
                    {s === "all" ? t("projects.allProjects") : t("projects.statusLabels." + s)}
                  </button>
                ))}
              </div>
            </div>

            {/* Bottom Row: Categories & Reset */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-2 border-t border-white/5">
              <div className="flex items-center gap-4 overflow-x-auto no-scrollbar w-full md:w-auto pb-2 md:pb-0">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hidden md:block">{t("projects.categories")}</span>
                <div className="flex gap-2">
                  {[
                    { id: "all", label: t("projects.allCategories"), icon: LayoutGrid },
                    { id: "Agriculture", label: t("projects.agriculture"), icon: Sprout },
                    { id: "Fish Farming", label: t("projects.fishFarming"), icon: Fish },
                    { id: "Real Estate", label: t("projects.realEstate"), icon: Home }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.id)}
                      className={cn(
                        "px-5 py-2.5 rounded-xl border transition-all duration-300 flex items-center gap-2 whitespace-nowrap",
                        categoryFilter === cat.id
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105"
                          : "bg-white/5 border-white/5 text-muted-foreground hover:border-white/20 hover:text-white"
                      )}
                    >
                      <cat.icon className={cn("w-4 h-4", categoryFilter === cat.id ? "text-white" : "text-primary")} />
                      <span className="text-xs font-bold">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                <Button
                  variant="ghost"
                  onClick={handleReset}
                  className="h-12 px-6 rounded-xl md:rounded-full text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all font-black uppercase text-[10px] tracking-widest shrink-0"
                >
                  <X className="mr-2 h-4 w-4" />
                  {t("common.clearAll")}
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. RESULTS GRID */}
      <section className="container mx-auto px-6 pt-12 pb-24">
        <div className="space-y-12">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
                <h2 className="text-2xl font-black uppercase tracking-tighter">
                  {statusFilter === "all" ? t("common.all") : t("projects.statusLabels." + statusFilter)} <span className="text-primary">{t("common.projects")}</span>
                </h2>
                <p className="text-xs text-muted-foreground font-medium">
                  {t("projects.showingResults", { count: data?.data?.length || 0 })}
                </p>
            </div>
            <div className="flex gap-2">
              {/* Add sort or view toggle here if needed */}
            </div>
          </div>
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-[400px] w-full bg-white/5 animate-pulse rounded-[2rem]" />
                ))}
              </div>
            ) : (
              <>
                {data?.data?.length > 0 ? (
                  <>
                    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-500 ${isFetching ? "opacity-50" : "opacity-100"}`}>
                      {data.data.map((project: any) => (
                        <ProjectCard key={project._id} project={project} />
                      ))}
                    </div>

                    <div className="flex justify-center pt-10">
                      <AFPagination
                        currentPage={page}
                        totalPages={data.meta?.totalPages || data.totalPages || 1}
                        onPageChange={(p) => {
                          setPage(p);
                          window.scrollTo({ top: 300, behavior: "smooth" });
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <div className="py-32 flex flex-col items-center justify-center text-center glass border-dashed border-white/10 rounded-[3rem]">
                    <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">{t("common.noProjects")}</h3>
                    <Button onClick={handleReset} size="lg" className="rounded-full px-10 shadow-glow">{t("common.resetFilters")}</Button>
                  </div>
                )}
              </>
            )}
          </div>
      </section>
    </div>
  );
}
