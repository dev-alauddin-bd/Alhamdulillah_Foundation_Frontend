import React from "react";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AFPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const AFPagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: AFPaginationProps) => {
  // No early return for totalPages <= 1 to show visual presence for testing

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (startPage > 1) {
        if (startPage > 2) pages.unshift("...");
        pages.unshift(1);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <div
            key={`ellipsis-${index}`}
            className="flex items-center justify-center w-10 h-10 text-muted-foreground"
          >
            <MoreHorizontal size={16} />
          </div>
        );
      }

      const isActive = currentPage === page;

      return (
        <Button
          key={`page-${page}`}
          variant={isActive ? "default" : "ghost"}
          size="icon"
          onClick={() => onPageChange(page as number)}
          className={cn(
            "w-10 h-10 rounded-xl font-black text-xs transition-all duration-300",
            isActive
              ? "shadow-lg shadow-primary/20 scale-110"
              : "hover:bg-primary/10 hover:text-primary",
          )}
        >
          {page}
        </Button>
      );
    });
  };

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row items-center justify-between gap-6 py-10",
        className,
      )}
    >
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
        Page <span className="text-primary">{currentPage}</span> of{" "}
        <span className="text-foreground">{totalPages}</span>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="w-10 h-10 rounded-xl border-muted/50 hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-30 cursor-pointer"
        >
          <ChevronLeft size={18} />
        </Button>

        <div className="flex items-center gap-1">{renderPageNumbers()}</div>

        <Button
          variant="outline"
          size="icon"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="w-10 h-10 rounded-xl border-muted/50 hover:border-primary/50 hover:bg-primary/5 transition-all disabled:opacity-30 cursor-pointer"
        >
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};
