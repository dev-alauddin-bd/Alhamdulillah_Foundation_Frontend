"use client";

import { useMemo, useState } from "react";
import {
  useGetNoticesQuery,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  INotice,
} from "@/redux/features/notice/noticeApi";

import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFSearchFilters } from "@/components/shared/AFSearchFilters";
import { AFDataTable } from "@/components/shared/AFDataTable";
import { AFModal } from "@/components/shared/AFModal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Trash2,
  ExternalLink,
  Plus,
  Loader2,
  FileUp,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";

export default function NoticePage() {
  const { t } = useTranslation();
  const token = useSelector(selectCurrentToken);
  
  // ================= STATE =================
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const [title, setTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // ================= RTK QUERY =================
  const { data: notices = [], isLoading } = useGetNoticesQuery(undefined);
  const [createNotice, { isLoading: creating }] = useCreateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();

  // ================= SEARCH FILTER =================
  const filteredNotices = useMemo(() => {
    return notices.filter((n: any) =>
      n.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [notices, search]);

  // ================= PDF UPLOAD =================
  const handlePdfUpload = async (file: File) => {
    setIsUploading(true);
    const toastId = toast.loading(t("common.processing"));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api"}/upload`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setFileUrl(data.secure_url);
      toast.success(t("common.success"), { id: toastId });
    } catch {
      toast.error(t("common.error"), { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  // ================= CREATE =================
  const handleCreate = async () => {
    if (!title || !fileUrl) {
      toast.error(t("notices.noticeTitle") + " & PDF required");
      return;
    }

    try {
      await createNotice({ title, fileUrl }).unwrap();
      toast.success(t("common.success"));
      setOpen(false);
      setTitle("");
      setFileUrl("");
    } catch {
      toast.error(t("common.error"));
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id: string) => {
    if(!confirm(t("users.deleteConfirm"))) return;
    
    try {
      await deleteNotice(id).unwrap();
      toast.success(t("notices.deleteNotice") + " " + t("common.success"));
    } catch {
      toast.error(t("common.error"));
    }
  };

  // ================= TABLE =================
  const columns = [
    {
      header: t("notices.noticeTitle"),
      className: "text-center",
      cell: (item: INotice) => <p className="font-semibold">{item.title}</p>,
    },
    {
      header: t("notices.publishDate"),
      className: "text-center",
      cell: (item: INotice) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      header: t("notices.actions"),
      className: "text-center",
      cell: (item: INotice) => (
        <div className="flex justify-center items-center gap-3">
          <a href={item.fileUrl} target="_blank" className="text-primary hover:scale-110 transition-transform">
            <ExternalLink size={16} />
          </a>

          <Button
            size="icon"
            variant="ghost"
            className="text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={() => handleDelete(item._id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ),
    },
  ];

  function cn(...classes: (string | undefined | false)[]): string {
    return classes.filter(Boolean).join(" ");
  }
  return (
    <div className="space-y-6">
      <AFPageHeader
        title={t("notices.title")}
        description={t("notices.description")}
        action={
          <Button onClick={() => setOpen(true)} className="cursor-pointer">
            <Plus className="h-4 w-4 mr-2" />
            {t("notices.createNotice")}
          </Button>
        }
      />
      <div className="rounded-2xl overflow-hidden bg-card border border-muted/30 shadow-2xl p-6">
        <AFSearchFilters
          searchValue={search}
          onSearchChange={setSearch}
          searchPlaceholder={t("myPayments.searchPlaceholder")}
        />

        <AFDataTable
          columns={columns}
          data={filteredNotices}
          isLoading={isLoading}
          emptyMessage={t("common.noData")}
        />
      </div>

      <AFModal isOpen={open} onOpenChange={setOpen} title={t("notices.createNotice")}>
        <div className="space-y-5">
          <Input
            placeholder={t("notices.noticeTitle")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <div className="relative">
            <label className="block">
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handlePdfUpload(file);
                }}
              />

              <div className={cn(
                "h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 cursor-pointer transition",
                fileUrl ? "border-emerald-500 bg-emerald-50/50" : "border-muted-foreground/30 hover:border-primary"
              )}>
                {!fileUrl && !isUploading && (
                  <>
                    <FileUp className="h-8 w-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground font-medium">
                      {t("common.processing") === "Processing..." ? "Click or drop PDF here" : "পিডিএফ এখানে ড্রপ করুন"}
                    </p>
                  </>
                )}

                {isUploading && (
                  <>
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                    <p className="text-xs text-primary">{t("common.processing")}</p>
                  </>
                )}

                {fileUrl && !isUploading && (
                  <>
                    <CheckCircle className="h-7 w-7 text-emerald-500" />
                    <p className="text-xs font-semibold text-emerald-600">
                      {t("common.success")}
                    </p>
                  </>
                )}
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              {t("common.cancel")}
            </Button>

            <Button
              onClick={handleCreate}
              disabled={creating || isUploading || !fileUrl}
            >
              {creating ? t("common.processing") : t("common.save")}
            </Button>
          </div>
        </div>
      </AFModal>
    </div>
  );
}