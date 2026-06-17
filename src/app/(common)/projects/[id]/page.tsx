"use client";

import { useGetProjectQuery } from "@/redux/features/project/projectApi";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useTranslation } from "react-i18next";
import {
  MapPin,
  Calendar,
  Users,
  Banknote,
  Phone,
  Info,
  Video,
} from "lucide-react";
import YouTubePreview from "@/components/shared/YouTubePreview";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const { t } = useTranslation();
  const { data: project, isLoading } = useGetProjectQuery(id);

  if (isLoading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-[400px] w-full bg-slate-200 rounded-2xl" />
        <div className="space-y-4">
          <div className="h-10 w-2/3 bg-slate-200 rounded" />
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
        </div>
      </div>
    );
  }

  if (!project)
    return <div className="text-center py-20">{t("no_projects")}</div>;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-green-500";
      case "upcoming":
        return "bg-blue-500";
      case "expired":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="container mx-auto space-y-12 min-h-screen py-10 ">
      <div className="relative h-[450px] w-full rounded-2xl overflow-hidden shadow-2xl mt-20">
        <Image
          src={project.thumbnail || "/placeholder-project.jpg"}
          alt={project.name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute bottom-8 left-8 right-8">
          <Badge
            className={`mb-4 ${getStatusColor(project.status)} text-base px-4 py-1`}
          >
            {t(project.status)}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
            {project.name}
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Info className="h-6 w-6 text-primary" />
              Project Overview
            </h2>
            <p className="text-foreground/80 leading-relaxed text-lg text-justify whitespace-pre-line">
              {project.description}
            </p>
          </section>

          {project.notice && (
            <section className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <h3 className="font-bold text-amber-800 flex items-center gap-2 mb-1">
                <Info className="h-4 w-4" />
                Notice
              </h3>
              <p className="text-amber-700">{project.notice}</p>
            </section>
          )}

          {project.videos?.length > 0 && (
            <section>
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <Video className="h-6 w-6 text-primary" />
                Videos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {project.videos.map((video: string, idx: number) => (
                  <YouTubePreview key={idx} url={video} />
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-card/50 backdrop-blur-md p-6 rounded-2xl border border-border shadow-xl space-y-6 sticky top-24 transition-all">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Banknote className="h-5 w-5" /> Initial Investment
                </span>
                <span className="font-bold text-primary">
                  ৳{(project.initialInvestment || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Banknote className="h-5 w-5 text-secondary" /> Total
                  Investment
                </span>
                <span className="font-bold text-secondary">
                  ৳{(project.totalInvestment || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="text-muted-foreground flex items-center gap-2">
                  <Users className="h-5 w-5" /> Core Team
                </span>
                <span className="font-bold">
                  {project.members?.length || 0}
                </span>
              </div>
            </div>

            <Separator />

            <div className="space-y-4 text-sm text-foreground/80">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Location</p>
                  <p>{project.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Timeline</p>
                  <p>
                    {new Date(project.startDate).toLocaleDateString()} -{" "}
                    {new Date(project.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Contact</p>
                  <p>{project.contactNumber}</p>
                </div>
              </div>
            </div>

            <div className="bg-primary/5 p-4 rounded-lg text-center text-sm text-primary border border-primary/10">
              <Info className="w-4 h-4 mx-auto mb-2" />
              <p>
                All active foundation members are automatically partners in this
                project.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
