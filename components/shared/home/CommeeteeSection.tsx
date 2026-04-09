"use client";

import { useGetManagementsQuery } from "@/redux/features/management/managementApi";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { Users } from "lucide-react";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";

// ===================== Skeleton =====================
const CommitteeCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="aspect-[4/5] rounded-xl bg-muted" />
      <div className="p-4 sm:p-6 text-center -mt-10 sm:-mt-12 relative z-10 space-y-2">
        <div className="h-4 w-28 mx-auto bg-muted rounded" />
        <div className="h-3 w-24 mx-auto bg-muted rounded" />
        <div className="h-3 w-32 mx-auto bg-muted rounded" />
      </div>
    </div>
  );
};

// ===================== Component =====================
export default function CommitteeSection() {
  const { t } = useTranslation();

  const { data: committeeMembers, isLoading } = useGetManagementsQuery({
    page: 1,
    limit: 4,
  });

  const formatTenure = (member: any) => {
    if (!member?.startAt) return "";

    const start = format(new Date(member.startAt), "MMM d, yyyy");

    if (member.isActive) return `${start} → Present`;

    if (member.endAt) {
      const end = format(new Date(member.endAt), "MMM d, yyyy");
      return `${start} → ${end}`;
    }

    return start;
  };

  return (
    <section
      id="team"
      className="py-8 sm:py-12 md:py-24"
    >
      <div className="container mx-auto px-4 md:px-8">
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
            {t("team.title", {
              defaultValue: "Meet Our Committee",
            })}
          </h2>

          <p
            className="
              text-sm sm:text-base md:text-lg
              text-muted-foreground
              leading-relaxed
            "
          >
            {t("team.desc", {
              defaultValue:
                "Our dedicated committee members work tirelessly to guide and support our mission.",
            })}
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <Card
                  key={index}
                  className="overflow-hidden border-border bg-background/50 backdrop-blur-sm"
                >
                  <CommitteeCardSkeleton />
                </Card>
              ))
            : committeeMembers?.data?.map((member: any, index: number) => (
                <Card
                  key={index}
                  className="
                    group overflow-hidden
                    border-border bg-background/50 backdrop-blur-sm
                    hover:shadow-xl transition-all duration-300
                  "
                >
                  {/* Image */}
                  <div className="aspect-[4/5] relative overflow-hidden rounded-xl bg-muted">
                    {member?.userId?.avatar ? (
                      <Image
                        src={member.userId.avatar}
                        alt={member?.userId?.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                        <Users size={48} className="text-foreground/10" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-4 sm:p-6 text-center -mt-10 sm:-mt-12 relative z-10">
                    <h3 className="font-semibold sm:font-bold text-base sm:text-xl mb-0.5">
                      {member?.userId?.name}
                    </h3>

                    <p className="text-primary text-xs sm:text-sm font-medium uppercase tracking-tight">
                      {t(member?.position)}
                    </p>

                    <p
                      className={`text-[10px] sm:text-[11px] font-medium mt-1 ${
                        member.isActive
                          ? "text-emerald-600"
                          : "text-muted-foreground"
                      }`}
                    >
                      {formatTenure(member)}
                    </p>
                  </div>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}