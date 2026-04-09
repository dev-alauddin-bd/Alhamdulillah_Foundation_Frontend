"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

//======================   AFPageHeader Props Interface   ===============================
interface AFPageHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}

//======================   Reusable Page Header Component   ===============================
export function AFPageHeader({
  title,
  description,
  action,
  className,
}: AFPageHeaderProps) {
  return (
    <div
      className={cn(
        "relative rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-muted/20 shadow-2xl p-8 md:p-12 flex flex-col md:flex-row md:items-center justify-between gap-8",
        className,
      )}
    >
      {/* Abstract Background Decoration */}
      <div className="absolute -top-24 -right-24 h-64 w-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-3 max-w-3xl">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-foreground leading-[1.1]">
          {title}
        </h1>
        {description && (
          <p className="text-muted-foreground font-medium text-sm md:text-base leading-relaxed max-w-2xl">
            {description}
          </p>
        )}
      </div>

      {action && <div className="relative flex-shrink-0">{action}</div>}
    </div>
  );
}
