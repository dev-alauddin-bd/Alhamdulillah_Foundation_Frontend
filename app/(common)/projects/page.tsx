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
import { Search, Filter, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import ProjectCard from "@/components/projects/ProjectCard";
import { AFPagination } from "@/components/shared/AFPagination";

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
    limit: 8,
  });

  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setPage(1);
  };

  return (
    <div className="container mx-auto py-10 mt-32 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COMPONENT: FILTERS & SEARCH */}
        <div className="lg:col-span-3 space-y-6">
          <div className="bg-card/50 backdrop-blur-md p-6 rounded-2xl border border-border shadow-sm top-24 sticky">
            <div className="flex items-center gap-2 mb-6">
              <Filter className="h-5 w-5 text-primary" />
              <h3 className="font-bold text-lg">{t("common.filters", { defaultValue: "Filters" })}</h3>
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">{t("common.search")}</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder={t("common.searchPlaceholder", { defaultValue: "Search projects..." })}
                    className="pl-10 h-10 bg-background/50 border-input/50 focus:bg-background transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">{t("common.status")}</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="h-10 bg-background/50 border-input/50">
                    <SelectValue placeholder={t("common.status")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("common.all")} {t("common.status")}
                    </SelectItem>
                    <SelectItem value="ongoing">
                      {t("common.status_ongoing", { defaultValue: "Ongoing" })}
                    </SelectItem>
                    <SelectItem value="upcoming">
                      {t("common.status_upcoming", { defaultValue: "Upcoming" })}
                    </SelectItem>
                    <SelectItem value="expired">
                      {t("common.status_expired", { defaultValue: "Expired" })}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground/80">{t("common.category")}</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-10 bg-background/50 border-input/50">
                    <SelectValue placeholder={t("common.category")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">
                      {t("common.all")} {t("common.category")}
                    </SelectItem>
                    <SelectItem value="Agriculture">Agriculture</SelectItem>
                    <SelectItem value="Fish Farming">Fish Farming</SelectItem>
                    <SelectItem value="Real Estate">Real Estate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Reset Button */}
              {(searchTerm || statusFilter !== "all" || categoryFilter !== "all") && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleReset}
                  className="w-full text-muted-foreground hover:text-foreground mt-2 border-dashed"
                >
                  <X className="mr-2 h-4 w-4" />
                  {t("common.resetFilters")}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COMPONENT: RESULTS & PAGINATION */}
        <div className="lg:col-span-9 space-y-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-[400px] w-full bg-slate-100/50 dark:bg-slate-800/50 animate-pulse rounded-2xl"
                />
              ))}
            </div>
          ) : (
            <>
              {data?.data?.length > 0 ? (
                <>
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 transition-opacity ${isFetching ? "opacity-50" : "opacity-100"}`}
                  >
                    {data.data.map((project: any) => (
                      <ProjectCard key={project._id} project={project} />
                    ))}
                  </div>

                  <div className="flex justify-center pt-8 border-t border-border/50">
                    <AFPagination
                      currentPage={page}
                      totalPages={data.meta?.totalPages || data.totalPages || 1}
                      onPageChange={(p) => {
                        setPage(p);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }}
                    />
                  </div>
                </>
              ) : (
                <div className="h-[60vh] flex flex-col items-center justify-center text-center p-8 bg-card/30 backdrop-blur-sm rounded-3xl border border-dashed border-border/50">
                  <div className="h-20 w-20 bg-muted/50 rounded-full flex items-center justify-center mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{t("common.noProjectsFound", { defaultValue: "No projects found" })}</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-6">
                    {t("common.noProjectsDesc", { defaultValue: "Try adjusting your filters or search terms to find what you're looking for." })}
                  </p>
                  <Button
                    onClick={handleReset}
                    variant="default"
                    className="bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  >
                    {t("common.clearAll")}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
