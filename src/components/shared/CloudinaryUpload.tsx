"use client";

import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useUploadFileMutation } from "@/redux/features/upload/uploadApi";

interface CloudinaryUploadProps {
  onUploadSuccess: (url: string) => void;
  onRemove?: () => void;
  value?: string;
  label?: string;
}

export default function CloudinaryUpload({
  onUploadSuccess,
  onRemove,
  value,
  label = "Upload Image",
}: CloudinaryUploadProps) {
  const [uploadFile, { isLoading: uploading }] = useUploadFileMutation();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const result = await uploadFile(formData).unwrap();
      onUploadSuccess(result.secure_url);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error("Upload Error:", error);
      toast.error("Failed to upload image");
    }
  };

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-sm font-medium text-foreground">{label}</label>
      )}

      <div className="flex flex-wrap gap-4">
        {value ? (
          <div className="relative w-40 h-40 rounded-lg border overflow-hidden">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <button
              onClick={onRemove}
              className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              disabled={uploading}
            />
            <div
              className={`
              w-40 h-40 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-2
              hover:border-primary/50 transition-colors
              ${uploading ? "bg-muted" : "bg-background"}
            `}
            >
              {uploading ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="text-xs text-foreground/60">
                    Uploading...
                  </span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-foreground/40" />
                  <span className="text-xs text-foreground/60">{label}</span>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
