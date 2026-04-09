
import Navbar from "@/components/shared/Navbar";
import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-accent/10">

      {/* ===== EXISTING NAVBAR ===== */}
      <Navbar />

      {/* ===== PAGE CONTENT ===== */}
      <main className="flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {children}
        </div>
      </main>
    </div>
  );
}