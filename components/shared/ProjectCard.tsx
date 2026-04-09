"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { MapPin, Calendar, Users, IndianRupee } from "lucide-react";

export function ProjectCard({ project }: { project: any }) {
  const { t } = useTranslation();

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
    <div>
      <Card className="bg-card/50 border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer overflow-hidden">
        <div className="relative h-40 bg-gradient-to-br from-primary/40 to-primary/10 overflow-hidden">
          <div className="absolute inset-0 opacity-60 flex items-center justify-center">
            <div className="text-6xl">{project.icon}</div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent opacity-60" />
          <span className="absolute top-3 right-3 px-2 py-1 rounded text-xs font-medium bg-primary/20 text-primary">
            {project.status}
          </span>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition mb-1">
              {project.name}
            </h3>
            <p className="text-[10px] text-primary font-semibold uppercase tracking-wider mb-2">
              {project.category}
            </p>
            <p className="text-sm text-foreground/60 line-clamp-2 leading-relaxed">
              {project.description}
            </p>
          </div>

          <div className="space-y-3 mb-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-foreground/70">
                  {t("project.target")}
                </span>
                <span className="text-primary font-semibold">
                  ৳{((project.targetAmount || 0) / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all"
                  style={{
                    width: `${((project.raisedAmount || 0) / (project.targetAmount || 1)) * 100}%`,
                  }}
                />
              </div>
              <div className="text-xs text-foreground/50 mt-1">
                {t("project.collected")}: ৳
                {((project.raisedAmount || 0) / 1000).toFixed(0)}K
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Users size={16} className="text-secondary" />
              <span className="text-foreground/70">
                {project.members?.length || project.memberCount || 0}{" "}
                {t("project.members")}
              </span>
            </div>
          </div>

          <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
            {t("project.join")}
          </Button>
        </div>
      </Card>
    </div>
  );
}
