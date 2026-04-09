"use client";

import { useApproveExpenseMutation, useRejectExpenseMutation } from "@/redux/features/fundApi/fundApi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, Users, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import { AFDataTable } from "@/components/shared/AFDataTable";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";

export const ExpenseRequestTable = ({ requests, isLoading }: any) => {
  const user = useSelector(selectCurrentUser);
  const [approveExpense, { isLoading: isApproving }] = useApproveExpenseMutation();
  const [rejectExpense] = useRejectExpenseMutation();

  const handleApprove = async (id: string) => {
    try {
      await approveExpense(id).unwrap();
      toast.success("Approval recorded successfully!");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to approve");
    }
  };

  const handleReject = async (id: string) => {
    const reason = window.prompt("Enter rejection reason:");
    if (!reason) return;

    try {
      await rejectExpense({ id, reason }).unwrap();
      toast.success("Request rejected");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to reject");
    }
  };

  const columns = [
    {
      header: "Requester",
      cell: (req: any) => (
        <div className="flex flex-col">
          <span className="font-bold text-sm text-gray-900">{req.requesterId?.name}</span>
          <span className="text-[10px] text-gray-500">{req.requesterId?.email}</span>
        </div>
      ),
    },
    {
      header: "Amount",
      cell: (req: any) => (
        <span className="font-black text-rose-600">৳{req.amount.toLocaleString()}</span>
      ),
    },
    {
      header: "Reason",
      cell: (req: any) => (
        <div className="max-w-[200px] truncate text-xs text-gray-600" title={req.reason}>
          {req.reason}
        </div>
      ),
    },
    {
      header: "Approvals",
      cell: (req: any) => (
        <div className="flex flex-wrap gap-1">
          {req.approvals?.length > 0 ? (
            req.approvals.map((admin: any, idx: number) => (
              <Badge key={idx} variant="secondary" className="bg-emerald-50 text-emerald-700 text-[9px] border-emerald-100">
                <Users className="w-2.5 h-2.5 mr-1" />
                {admin.name}
              </Badge>
            ))
          ) : (
            <span className="text-[10px] text-gray-400 italic">No admin approvals yet</span>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      cell: (req: any) => {
        const statusConfigs: any = {
          PENDING: { label: "Pending", icon: Clock, class: "bg-amber-100 text-amber-700" },
          APPROVED: { label: "Final Approved", icon: CheckCircle, class: "bg-emerald-100 text-emerald-700" },
          REJECTED: { label: "Rejected", icon: XCircle, class: "bg-rose-100 text-rose-700" },
        };
        const config = statusConfigs[req.status] || { label: req.status, icon: Clock, class: "bg-gray-100 text-gray-700" };
        const Icon = config.icon;

        return (
          <Badge className={`${config.class} border-none font-black text-[9px] uppercase tracking-widest px-3 py-1`}>
            <Icon className="w-3 h-3 mr-1.5" />
            {config.label}
          </Badge>
        );
      },
    },
    {
      header: "Actions",
      cell: (req: any) => {
        if (req.status !== "PENDING") return null;

        // Check if current user (Admin) already approved
        const alreadyApproved = req.approvals?.some((a: any) => a._id === user?._id);

        return (
          <div className="flex gap-2">
            {user?.role === "ADMIN" && (
              <Button
                size="sm"
                onClick={() => handleApprove(req._id)}
                disabled={isApproving || alreadyApproved}
                className={`${alreadyApproved ? "bg-emerald-50 text-emerald-600" : "bg-emerald-600 hover:bg-emerald-700 text-white"} font-bold h-8 rounded-lg text-xs`}
              >
                {alreadyApproved ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
                    Verified
                  </>
                ) : (
                  <>
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    Verify
                  </>
                )}
              </Button>
            )}

            {user?.role === "SUPER_ADMIN" && (
              <>
                <Button
                  size="sm"
                  onClick={() => handleApprove(req._id)}
                  disabled={isApproving}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold h-8 rounded-lg text-xs shadow-lg shadow-blue-100"
                >
                  <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
                  Final Approval
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleReject(req._id)}
                  className="border-rose-200 text-rose-600 hover:bg-rose-50 font-bold h-8 rounded-lg text-xs"
                >
                  <XCircle className="w-3.5 h-3.5 mr-1.5" />
                  Reject
                </Button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/30">
        <div>
          <h3 className="font-black text-gray-900 uppercase tracking-wider text-sm">Expense Approval Queue</h3>
          <p className="text-[10px] text-gray-500 font-medium">Expenses require Admin verification and Super Admin finalization</p>
        </div>
        <Badge variant="outline" className="rounded-full px-4 py-1 text-[10px] font-black uppercase text-gray-400">
          {requests?.length || 0} Pending
        </Badge>
      </div>
      <AFDataTable columns={columns} data={requests || []} isLoading={isLoading} emptyMessage="No pending expense requests." />
    </div>
  );
};
