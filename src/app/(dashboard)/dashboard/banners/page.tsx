"use client";

//==================================================================================
//                               BANNER MANAGEMENT
//==================================================================================
// Description: Administrative tool for managing homepage hero sliders and ads.
// Features: Image upload, Display sequencing, and Real-time status toggling.
//==================================================================================

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Trash2,
  Edit2,
  Loader2,
  Image as ImageIcon,
  LayoutList,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  useGetBannersQuery,
  useCreateBannerMutation,
  useUpdateBannerMutation,
  useDeleteBannerMutation,
} from "@/redux/features/banner/bannerApi";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFDataTable } from "@/components/shared/AFDataTable";
import { AFModal } from "@/components/shared/AFModal";

export default function BannersPage() {
  //======================   STATE & API HOOKS   ===============================
  const { data: banners, isLoading } = useGetBannersQuery(undefined);
  const [createBanner] = useCreateBannerMutation();
  const [updateBanner] = useUpdateBannerMutation();
  const [deleteBanner] = useDeleteBannerMutation();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    displayOrder: "",
    isActive: true,
  });

  //======================   EVENT HANDLERS   ===============================
  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: "",
      displayOrder: "",
      isActive: true,
    });
    setEditingBanner(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      displayOrder: Number(formData.displayOrder) || 0,
    };

    try {
      if (editingBanner) {
        await updateBanner({
          id: editingBanner._id,
          data: payload,
        }).unwrap();
        toast.success("Marketing banner synchronized successfully");
      } else {
        await createBanner(payload).unwrap();
        toast.success("New banner published successfully");
      }

      setIsModalOpen(false);
      resetForm();
    } catch {
      toast.error("Security violation: Unable to persist banner changes");
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title || "",
      description: banner.description || "",
      image: banner.image || "",
      displayOrder: String(banner.displayOrder ?? ""),
      isActive: banner.isActive ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        "Are you sure you want to permanently strip this banner from the site?",
      )
    )
      return;

    try {
      await deleteBanner(id).unwrap();
      toast.success("Banner decommissioned successfully");
    } catch {
      toast.error("System error: Could not remove banner asset");
    }
  };

  //======================   TABLE DEFINITION   ===============================
  const columns = [
    {
      header: "Visual Asset",
      cell: (banner: any) => (
        <div className="relative w-24 h-12 rounded-lg overflow-hidden border border-muted/50 shadow-sm group">
          <img
            src={banner.image || "/placeholder.svg"}
            className="w-full h-full object-cover transition-transform group-hover:scale-110"
            alt={banner.title}
          />
        </div>
      ),
    },
    {
      header: "Headline",
      cell: (banner: any) => (
        <div className="max-w-[200px]">
          <p className="font-bold text-sm truncate">{banner.title}</p>
          <p className="text-[10px] text-muted-foreground truncate">
            {banner.description || "No subtitle"}
          </p>
        </div>
      ),
    },
    {
      header: "Sequence",
      cell: (banner: any) => (
        <div className="flex items-center gap-1.5 font-black text-xs text-primary bg-primary/5 w-fit px-2 py-1 rounded">
          <LayoutList size={12} />
          {banner.displayOrder}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (banner: any) => (
        <Badge
          className={
            banner.isActive
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 shadow-none uppercase font-black text-[9px]"
              : "bg-muted text-muted-foreground border-transparent uppercase font-black text-[9px]"
          }
          variant={banner.isActive ? "default" : "secondary"}
        >
          {banner.isActive ? "Published" : "Hidden"}
        </Badge>
      ),
    },
    {
      header: "Actions",
      className: "text-right",
      cell: (banner: any) => (
        <div className="flex justify-end gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEdit(banner)}
            className="h-8 w-8 rounded-full text-blue-500 hover:text-blue-600 hover:bg-blue-50 border border-blue-50"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDelete(banner._id)}
            className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 border border-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  //======================   MAIN RENDER   ===============================
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <AFPageHeader
        title="Hero Content Management"
        description="Configure front-facing banners to highlight foundation milestones and announcements."
        action={
          <Button
            onClick={() => setIsModalOpen(true)}
            className="rounded-xl shadow-lg cursor-pointer shadow-primary/20 h-11 px-6 font-black scale-100 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Banner Asset
          </Button>
        }
      />

      {/* Visual Data Table */}
      <div className="rounded-2xl border border-muted/30 overflow-hidden shadow-xl bg-card">
        <AFDataTable
          columns={columns}
          data={banners || []}
          isLoading={isLoading}
          emptyMessage="No marketing assets configured for the frontend."
        />
      </div>

      {/* Multi-purpose Modal (Create/Edit) */}
      <AFModal
        isOpen={isModalOpen}
        onOpenChange={(open) => {
          setIsModalOpen(open);
          if (!open) resetForm();
        }}
        title={
          editingBanner ? "Modify Existing Banner" : "Create New Banner Asset"
        }
        className="sm:max-w-[550px] rounded-3xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="bg-primary/5 p-4 rounded-xl flex items-center gap-3">
            <ImageIcon className="text-primary h-5 w-5" />
            <p className="text-xs font-bold text-primary uppercase tracking-tighter">
              Asset Configuration
            </p>
          </div>

          <div className="grid gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-muted-foreground ml-1">
                Asset Headline
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="e.g. Revolutionizing Agriculture 2024"
                required
                className="rounded-xl h-11 border-muted-foreground/20 focus:ring-primary/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-muted-foreground ml-1">
                Contextual Description
              </label>
              <textarea
                className="w-full min-h-[100px] rounded-xl border border-muted-foreground/20 bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="Briefly describe the purpose of this banner..."
              />
            </div>

            <div className="p-1 bg-muted/20 rounded-2xl">
              <CloudinaryUpload
                label="Primary Visual (1920x1080)"
                value={formData.image}
                onUploadSuccess={(url) =>
                  setFormData({ ...formData, image: url })
                }
                onRemove={() => setFormData({ ...formData, image: "" })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase text-muted-foreground ml-1">
                  Hierarchy Index
                </label>
                <Input
                  type="number"
                  value={formData.displayOrder}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      displayOrder: e.target.value,
                    })
                  }
                  placeholder="Order (1, 2, 3...)"
                  className="rounded-xl h-11 border-muted-foreground/20"
                />
              </div>
              <div className="flex flex-col justify-end">
                <Button
                  type="button"
                  variant={formData.isActive ? "default" : "outline"}
                  className={`h-11  cursor-pointer rounded-xl font-bold transition-all ${formData.isActive ? "bg-emerald-500 hover:bg-emerald-600" : ""}`}
                  onClick={() =>
                    setFormData({ ...formData, isActive: !formData.isActive })
                  }
                >
                  {formData.isActive ? "Live in Frontend" : "Stay in Draft"}
                </Button>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-muted/30">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
              className="rounded-xl cursor-pointer px-8 order-2 sm:order-1 font-bold"
            >
              Discard Changes
            </Button>
            <Button
              type="submit"
              className="rounded-xl cursor-pointer px-10 font-black shadow-lg shadow-primary/20 order-1 sm:order-2"
            >
              Commit Asset
            </Button>
          </div>
        </form>
      </AFModal>
    </div>
  );
}
