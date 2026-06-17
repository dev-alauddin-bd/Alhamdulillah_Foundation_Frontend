"use client";

import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";

//======================   AFSearchFilters Props Interface   ===============================
interface AFSearchFiltersProps {
  searchPlaceholder?: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filters?: {
    label: string;
    value: string;
  }[];
  activeFilter?: string;
  onFilterChange?: (value: string) => void;
  children?: ReactNode;
}

//======================   Reusable Search & Filter Bar Component   ===============================
export function AFSearchFilters({
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  filters,
  activeFilter,
  onFilterChange,
  children,
}: AFSearchFiltersProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 mb-6">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-10 h-11 rounded-xl bg-background border-muted-foreground/20 focus:border-primary transition-all"
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Dynamic Filter Buttons */}
      {filters && filters.length > 0 && onFilterChange && (
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {filters.map((filter) => (
            <Button
              key={filter.value}
              variant={activeFilter === filter.value ? "default" : "outline"}
              size="sm"
              onClick={() => onFilterChange(filter.value)}
              className="capitalize whitespace-nowrap rounded-lg h-9 px-4 font-medium transition-all"
            >
              {filter.label}
            </Button>
          ))}
        </div>
      )}

      {/* Custom Filter Elements */}
      {children}
    </div>
  );
}
