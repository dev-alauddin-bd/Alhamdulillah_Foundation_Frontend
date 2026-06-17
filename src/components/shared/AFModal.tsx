"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ReactNode } from "react";

//======================   AFModal Props Interface   ===============================
interface AFModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
}

//======================   Centralized Modal Component   ===============================
export function AFModal({
  isOpen,
  onOpenChange,
  title,
  children,
  className = "sm:max-w-[500px]",
}: AFModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className={`${className} p-0 overflow-hidden rounded-2xl border-none shadow-2xl`}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl font-bold text-foreground">
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="p-6 pt-4">{children}</div>
      </DialogContent>
    </Dialog>
  );
}
