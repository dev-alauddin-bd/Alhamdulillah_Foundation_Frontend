"use client";

import { useState } from "react";
import { Payment, useGetMyPaymentsQuery } from "@/redux/features/payment/paymentApi";
import { AFDataTable } from "@/components/shared/AFDataTable";
import { AFSearchFilters } from "@/components/shared/AFSearchFilters";
import { AFSectionTitle } from "@/components/shared/AFSectionTitle";
import { AFPagination } from "@/components/shared/AFPagination";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function MyPaymentsPage() {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const STATUS_TABS = [
    { label: t("payments.allStatuses"), value: "ALL" },
    { label: t("payments.pending"), value: "PENDING" },
    { label: t("payments.paid"), value: "PAID" },
    { label: t("payments.failed"), value: "FAILED" },
    { label: t("payments.cancelled"), value: "CANCELLED" },
  ];

  const { data, isLoading } = useGetMyPaymentsQuery({
    page,
    limit,
    paymentStatus: status === "ALL" ? undefined : status,
    sortBy: "createdAt",
    sortOrder: "desc",
  });

  const payments = data?.data || [];
  const meta = data?.meta || { totalPages: 1, total: 0 };

  const handleStatusChange = (val: string) => {
    setStatus(val);
    setPage(1);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PAID: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
      PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
      FAILED: "bg-red-500/10 text-red-600 border-red-500/20",
      CANCELLED: "bg-gray-500/10 text-gray-600 border-gray-500/20",
    };
    return colors[status] || "bg-gray-500/10 text-gray-600";
  };

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });

  // Table columns
  const columns = [
    {
      header: t("payments.transactionId"),
      cell: (payment: Payment) => (
        <span className="font-mono font-bold">{payment.transactionId}</span>
      ),
    },
    {
      header: t("payments.amount"),
      cell: (payment: Payment) => (
        <div className="flex items-center gap-1 font-black">
          <span className="text-primary/40">৳</span>
          <span>{payment.amount.toLocaleString()}</span>
        </div>
      ),
    },
    {
      header: t("payments.purpose"),
      cell: (payment: Payment) => (
        <span className="font-bold">
          {t(`payments.purposes.${payment.purpose}`, { defaultValue: payment.purpose })}
        </span>
      ),
    },
    {
      header: t("payments.date"),
      cell: (payment: Payment) => (
        <div className="flex flex-col">
          <span>{formatDate(payment.paidAt || payment.createdAt)}</span>
        </div>
      ),
    },
    {
      header: t("payments.status"),
      cell: (payment: Payment) => (
        <Badge
          className={`${getStatusColor(payment.paymentStatus)} border px-2 py-1 text-xs`}
        >
          {t(`payments.${payment.paymentStatus.toLowerCase()}`, { defaultValue: payment.paymentStatus })}
        </Badge>
      ),
    },
    {
      header: t("payments.invoice"),
      cell: (payment: Payment) =>
        payment.paymentStatus === "PAID" ? (
          <Link href={`/invoice/${payment._id}`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              {t("payments.viewDetails")} <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground font-bold">{t("common.noData")}</span>
        ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto p-4 space-y-8">
      <AFPageHeader
        title={t("myPayments.title")}
        description={t("myPayments.description")}
      />

      <AFSectionTitle
        title={t("myPayments.title")} // Using title as history title
        subtitle={t("myPayments.description")}
      />

      <div className="rounded-[3rem] overflow-hidden bg-card/30 backdrop-blur-md border border-muted/20 shadow-2xl p-4 sm:p-8 space-y-6">
        <AFSearchFilters
          searchValue={search}
          onSearchChange={(val) => {
            setSearch(val);
            setPage(1);
          }}
          searchPlaceholder={t("myPayments.searchPlaceholder")}
          filters={STATUS_TABS}
          activeFilter={status}
          onFilterChange={handleStatusChange}
        />

        <AFDataTable
          columns={columns}
          data={payments as Payment[]}
          isLoading={isLoading}
          emptyMessage={t("common.noData")}
        />

        {meta?.totalPages && meta?.totalPages >= 1 && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-6">
            <AFPagination
              currentPage={page}
              totalPages={meta?.totalPages}
              onPageChange={(p) => {
                setPage(p);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}