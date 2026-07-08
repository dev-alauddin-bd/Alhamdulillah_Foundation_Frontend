"use client";
import { useState } from "react";
import { useUploadFileMutation } from "@/redux/features/upload/uploadApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";
import { selectCurrentToken } from "@/redux/features/auth/authSlice";

interface AddTransactionFormProps {
  onAdd: (data: {
    type: "INCOME" | "EXPENSE";
    fundType: "MAIN" | "WELFARE";
    amount: number;
    reason: string;
    evidenceImages: string[];
  }) => Promise<void>;
  adding: boolean;
}

export const AddTransactionForm = ({
  onAdd,
  adding,
}: AddTransactionFormProps) => {
  const token = useSelector(selectCurrentToken);
  console.log('AddTransactionForm: current token', token);
  const [txType, setTxType] = useState<"INCOME" | "EXPENSE">("INCOME");
  const [fundType, setFundType] = useState<"MAIN" | "WELFARE">("MAIN");
  const [txAmount, setTxAmount] = useState("");
  const [txReason, setTxReason] = useState("");
  const [evidenceImages, setEvidenceImages] = useState<File[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);

  const removeImage = (index: number) => {
    setEvidenceImages((prev) => prev.filter((_, i) => i !== index));
  };

  const [uploadFile] = useUploadFileMutation();

  const uploadToCloudinary = async (files: File[]): Promise<string[]> => {
    const urls: string[] = [];
    setIsUploading(true);
    setUploadProgress(0);
    const totalFiles = files.length;

    for (let i = 0; i < totalFiles; i++) {
      const formData = new FormData();
      formData.append("file", files[i]);

      try {
        const { secure_url } = await uploadFile(formData).unwrap();
        console.log(`Uploaded file ${i + 1}/${totalFiles}:`, secure_url);
        urls.push(secure_url);
        // Update progress manually (since RTK Query doesn't expose onUploadProgress)
        const overallPercent = Math.round(((i + 1) * 100) / totalFiles);
        console.log('Upload progress %:', overallPercent);
        setUploadProgress(overallPercent);
      } catch (error) {
        console.error("Upload Error:", error);
        toast.error(`Failed to upload image ${i + 1}`);
      }
    }
    setIsUploading(false);
    return urls;
  };

  const handleSubmit = async () => {
    if (!txAmount || !txReason) {
      toast.warning("Please fill in all required fields!");
      return;
    }

    try {
      console.log('Submitting transaction, evidence count:', evidenceImages.length);
        const imageUrls =
          evidenceImages.length > 0
            ? await uploadToCloudinary(evidenceImages)
            : [];
        console.log('Image URLs after upload:', imageUrls);

      await onAdd({
        type: txType,
        fundType,
        amount: Number(txAmount),
        reason: txReason,
        evidenceImages: imageUrls,
      });

      toast.success("Transaction added successfully!");
        console.log('Transaction submitted successfully with data:', { type: txType, fundType, amount: Number(txAmount), reason: txReason, evidenceImages: imageUrls });

      setTxAmount("");
      setTxReason("");
      setEvidenceImages([]);
      setUploadProgress(0);
    } catch (error) {
      toast.error("Failed to add transaction. Try again.");
    }
  };

  return (
    <>
      <Card className="border-none shadow-2xl rounded-[2.5rem] overflow-hidden bg-card/40 backdrop-blur-md border border-muted/20">
        <CardHeader className="p-8 border-b border-muted/20 bg-primary/5">
          <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-primary">
            Ledger Entry Protocol
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-8">
          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Type & Fund Selection */}
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Entry Dimension
                  </label>
                  <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl h-14">
                    <button
                      onClick={() => setTxType("INCOME")}
                      className={`flex-1 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${
                        txType === "INCOME" 
                        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                        : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      Income
                    </button>
                    <button
                      onClick={() => setTxType("EXPENSE")}
                      className={`flex-1 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${
                        txType === "EXPENSE" 
                        ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" 
                        : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      Expense
                    </button>
                  </div>
               </div>

               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Fund Category
                  </label>
                  <div className="flex gap-2 p-1 bg-muted/30 rounded-2xl h-14">
                    <button
                      onClick={() => setFundType("MAIN")}
                      className={`flex-1 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${
                        fundType === "MAIN" 
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                        : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      Main Fund
                    </button>
                    <button
                      onClick={() => setFundType("WELFARE")}
                      className={`flex-1 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all ${
                        fundType === "WELFARE" 
                        ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" 
                        : "text-muted-foreground hover:bg-muted/50"
                      }`}
                    >
                      Welfare
                    </button>
                  </div>
               </div>
            </div>

            {/* Right: Amount & Reason */}
            <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Fiscal Magnitude
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g. 5000"
                    disabled={isUploading || adding}
                    value={txAmount}
                    onChange={(e) => setTxAmount(e.target.value)}
                    className="h-14 rounded-2xl border-muted/30 focus:ring-primary/20 bg-background/50 font-black text-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Contextual Rationale
                  </label>
                  <Input
                    placeholder="Enter transaction reason..."
                    disabled={isUploading || adding}
                    value={txReason}
                    onChange={(e) => setTxReason(e.target.value)}
                    className="h-14 rounded-2xl border-muted/30 focus:ring-primary/20 bg-background/50 font-bold"
                  />
                </div>
            </div>
          </div>

          {/* Evidence Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                Evidence Protocols (Optional)
              </label>
              {isUploading && (
                <span className="text-[10px] font-black text-primary animate-pulse tracking-widest uppercase">
                  UPLOADING: {uploadProgress}%
                </span>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              <label className="aspect-square rounded-3xl border-2 border-dashed border-muted/30 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
                <ImageIcon className="h-6 w-6 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all" />
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-muted-foreground group-hover:text-primary">Inject Image</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    if (e.target.files) {
                      const newFiles = Array.from(e.target.files!);
                      console.log('Selected evidence files:', newFiles.map(f => f.name));
                      setEvidenceImages((prev) => [...prev, ...newFiles]);
                      e.target.value = "";
                    }
                  }}
                  className="hidden"
                />
              </label>

              {evidenceImages.map((file, index) => (
                <div key={index} className="relative aspect-square rounded-3xl overflow-hidden group border border-muted/20">
                  <img src={URL.createObjectURL(file)} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button onClick={() => removeImage(index)} className="p-2 bg-rose-500 text-white rounded-full hover:scale-110 transition-transform">
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={adding || isUploading}
            className="w-full h-16 bg-primary hover:scale-[1.01] active:scale-95 text-primary-foreground font-black rounded-3xl shadow-2xl shadow-primary/20 transition-all uppercase text-xs tracking-[0.3em] flex items-center justify-center gap-4"
          >
            {adding || isUploading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                Processing...
              </>
            ) : (
              "Commit to Ledger"
            )}
          </Button>
        </CardContent>
      </Card>
      <ToastContainer position="bottom-right" autoClose={3000} theme="dark" />
    </>
  );
};
