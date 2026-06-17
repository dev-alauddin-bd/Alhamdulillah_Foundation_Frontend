import React from "react";
import { cn } from "@/lib/utils";

interface AFSectionTitleProps {
  title: string;
  subtitle?: string;
  badge?: string;
  action?: React.ReactNode;
  align?: "left" | "center" | "right";
  className?: string;
}

export const AFSectionTitle = ({
  title,
  subtitle,
  badge,
  action,
  align = "left",
  className,
}: AFSectionTitleProps) => {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 mb-8",
        align === "center" && "items-center text-center",
        align === "right" && "items-end text-right",
        align === "left" && "md:flex-row md:items-end justify-between",
        className,
      )}
    >
      <div className="space-y-2">
        {badge && (
          <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-black uppercase tracking-widest text-primary animate-pulse">
            {badge}
          </span>
        )}
        <h2 className="text-xl font-black tracking-tight text-foreground md:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground font-medium text-sm md:text-base max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};
