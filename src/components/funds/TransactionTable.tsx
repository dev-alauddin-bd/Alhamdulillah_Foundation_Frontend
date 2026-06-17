"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ImageIcon, Eye, X, Download } from "lucide-react";
import Image from "next/image";
import { AFDataTable } from "@/components/shared/AFDataTable";
import { AFSearchFilters } from "@/components/shared/AFSearchFilters";
import { AFModal } from "@/components/shared/AFModal";

//======================   Transaction Table Component   ===============================
export const TransactionTable = ({
  history,
  search,
  setSearch,
  limit,
  setLimit,
}: any) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [galleryImages, setGalleryImages] = useState<string[] | null>(null);

  //======================   Filtering Logic   ===============================
  const filteredData = history?.filter(
    (tx: any) =>
      tx.reason.toLowerCase().includes(search.toLowerCase()) ||
      tx.createdBy?.name?.toLowerCase().includes(search.toLowerCase()),
  );

  //======================   Table Columns Definition   ===============================
  const columns = [
    {
      header: "Created By",
      cell: (tx: any) => (
        <div className="flex flex-col">
          <span className="font-semibold text-foreground text-sm">
            {tx.userId?.name || "System"}
          </span>
          <span className="text-[10px] text-muted-foreground">
            {tx.userId?.email || "—"}
          </span>
        </div>
      ),
    },
    {
      header: "Type",
      cell: (tx: any) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            tx.type === "INCOME"
              ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
              : "bg-rose-50 text-rose-600 border border-rose-100"
          }`}
        >
          {tx.type}
        </span>
      ),
    },
    {
      header: "Fund",
      cell: (tx: any) => (
        <span
          className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
            tx.fundType === "WELFARE"
              ? "bg-amber-50 text-amber-600 border border-amber-100"
              : "bg-blue-50 text-blue-600 border border-blue-100"
          }`}
        >
          {tx.fundType || "MAIN"}
        </span>
      ),
    },
    {
      header: "Amount",
      className: "text-right",
      cell: (tx: any) => (
        <span className="font-bold text-sm text-foreground">
          ৳{tx.amount.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Balance",
      className: "text-right",
      cell: (tx: any) => (
        <span className="text-muted-foreground text-sm italic">
          ৳{tx.balanceSnapshot.toLocaleString()}
        </span>
      ),
    },
    {
      header: "Reason",
      cell: (tx: any) => (
        <div className="space-y-1">
          <div
            className="max-w-[200px] truncate text-sm text-foreground/80"
            title={tx.reason}
          >
            {tx.reason}
          </div>
          {tx.paymentId && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase bg-blue-100 text-blue-700">
              💳 {tx.paymentId?.method || "Payment"}
            </span>
          )}
        </div>
      ),
    },
    {
      header: "Evidence",
      cell: (tx: any) =>
        tx.evidenceImages?.length > 0 ? (
          <Button
            variant="outline"
            size="sm"
            className="h-8 gap-1.5 text-[11px] font-medium rounded-lg"
            onClick={() => setGalleryImages(tx.evidenceImages)}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            View ({tx.evidenceImages.length})
          </Button>
        ) : (
          <span className="text-[10px] text-muted-foreground italic opacity-60">
            No Evidence
          </span>
        ),
    },
    {
      header: "Date",
      cell: (tx: any) => (
        <span className="text-xs text-muted-foreground">
          {new Date(tx.createdAt).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-4">
      {/*======================   Search & Limit Filters   ===============================*/}
      <AFSearchFilters
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search reason or user..."
      >
        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest whitespace-nowrap">
            Show:
          </span>
          {[10, 20, 50].map((num) => (
            <Button
              key={num}
              size="sm"
              variant={limit === num ? "default" : "outline"}
              onClick={() => setLimit(num)}
              className="h-9 w-10 p-0 rounded-lg text-xs font-bold"
            >
              {num}
            </Button>
          ))}
        </div>
      </AFSearchFilters>

      {/*======================   Data Table   ===============================*/}
      <AFDataTable
        columns={columns}
        data={filteredData || []}
        emptyMessage="No transactions found matching your search."
      />

      {/*======================   Evidence Gallery Modal   ===============================*/}
      <AFModal
        isOpen={!!galleryImages}
        onOpenChange={(open) => !open && setGalleryImages(null)}
        title="Evidence Gallery"
        className="md:max-w-4xl max-h-[90vh] overflow-y-auto"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
          {galleryImages?.map((img: string, idx: number) => (
            <div
              key={idx}
              className="relative aspect-video rounded-xl overflow-hidden border bg-muted shadow-sm group"
            >
              <Image
                src={img}
                alt="Evidence"
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedImage(img)}
                  className="rounded-full"
                >
                  <Eye className="w-4 h-4 mr-2" /> Full View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </AFModal>

      {/*======================   Full-Screen Preview   ===============================*/}
      {selectedImage && (
        <div className="fixed inset-0 z-[999] bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all shadow-2xl ring-1 ring-white/20"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative w-full h-[70vh] flex items-center justify-center">
            <Image
              src={selectedImage}
              alt="Full Preview"
              fill
              className="object-contain"
              priority
            />
          </div>

          <div className="mt-12 flex gap-4">
            <Button
              variant="outline"
              onClick={() => window.open(selectedImage, "_blank")}
              className="bg-white/5 text-white border-white/20 hover:bg-white/10 rounded-xl px-6"
            >
              <Download className="w-4 h-4 mr-2" /> Open Original
            </Button>
            <Button
              onClick={() => setSelectedImage(null)}
              className="bg-white text-black hover:bg-gray-200 rounded-xl px-10 font-bold"
            >
              Close
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
