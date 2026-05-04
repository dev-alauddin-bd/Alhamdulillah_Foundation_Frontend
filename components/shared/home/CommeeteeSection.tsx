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
    const start = format(new Date(member.startAt), "MMM yyyy");
    if (member.isActive) return `${start} → Present`;
    if (member.endAt) {
      const end = format(new Date(member.endAt), "MMM yyyy");
      return `${start} → ${end}`;
    }
    return start;
  };

  return (
    <section id="team" className="py-24 md:py-32 relative overflow-hidden bg-mesh">
      <div className="container mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="max-w-3xl mb-16 md:mb-24" data-aos="fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass border-white/10 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <span className="text-[10px] font-bold tracking-widest uppercase opacity-80">{t("home.leadership")}</span>
          </div>
          
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-6">
            {t("home.dedicatedCommittee")}
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
            {t("team.desc", {
              defaultValue:
                "Our dedicated committee members work tirelessly to guide and support our mission with transparency and integrity.",
            })}
          </p>
        </div>

        {/* GRID */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="aspect-[4/5] rounded-3xl bg-muted" />
                </div>
              ))
            : committeeMembers?.data?.map((member: any, index: number) => (
                <Card
                  key={index}
                  className="group relative overflow-hidden rounded-[2.5rem] glass border-white/5 hover:border-primary/50 transition-all duration-500 shadow-xl"
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                >
                  {/* Image */}
                  <div className="aspect-[4/5] relative overflow-hidden">
                    {member?.userId?.avatar ? (
                      <Image
                        src={member.userId.avatar}
                        alt={member?.userId?.name}
                        fill
                        className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                        <Users size={64} className="text-primary/20" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Content Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-8 text-center translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="font-bold text-xl text-white mb-1">
                      {member?.userId?.name}
                    </h3>

                    <p className="text-primary text-[10px] font-black uppercase tracking-widest mb-4">
                      {t(member?.position)}
                    </p>

                    <div className="pt-4 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      <p className="text-[10px] text-white/50 font-medium tracking-widest uppercase">
                        {formatTenure(member)}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
        </div>
      </div>
    </section>
  );
}