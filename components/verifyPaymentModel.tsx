import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  payment: any;
  onConfirm: () => void;
  loading: boolean;
};

export function VerifyPaymentModal({
  open,
  onClose,
  payment,
  onConfirm,
  loading,
}: Props) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Payment</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Name</p>
              <p className="font-bold">{payment.userId?.name || "Unknown"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Email</p>
              <p className="font-bold truncate">{payment.userId?.email || "N/A"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Contact</p>
              <p className="font-bold">{payment.senderNumber || payment.userId?.phone || "Gateway Verified"}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Amount</p>
              <p className="font-bold text-primary text-base">৳ {payment.amount}</p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Transaction ID</p>
            <code className="block bg-muted p-2 rounded-lg font-mono text-[10px] break-all border border-muted-foreground/10">
              {payment.transactionId}
            </code>
          </div>

          {payment.screenshot && (
            <div className="space-y-2">
              <p className="text-muted-foreground font-black uppercase tracking-widest text-[10px]">Contribution Proof</p>
              <img
                src={payment.screenshot}
                alt="Payment Proof"
                className="rounded-2xl border-2 border-muted shadow-lg w-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>

          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Approving..." : "Approve"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
