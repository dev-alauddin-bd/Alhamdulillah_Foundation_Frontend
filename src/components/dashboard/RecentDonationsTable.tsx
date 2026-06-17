"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { format } from "date-fns";

interface RecentDonationsTableProps {
  donations: any[];
  title?: string;
}

export function RecentDonationsTable({ donations, title = "Recent Donations" }: RecentDonationsTableProps) {
  return (
    <Card className="shadow-lg border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{title}</CardTitle>
        <CardDescription>
          The latest contributions to the foundation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {donations?.map((donation) => (
            <div key={donation._id} className="flex items-center justify-between group">
              <div className="flex items-center gap-4">
                <Avatar className="h-10 w-10 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary font-bold">
                    {donation.userId?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <p className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">
                    {donation.userId?.name || "Unknown User"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {donation.paymentStatus} • {format(new Date(donation.createdAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  +৳{donation.amount.toLocaleString()}
                </p>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {donation.purpose?.replace(/_/g, " ")}
                </p>
              </div>
            </div>
          ))}
          {(!donations || donations.length === 0) && (
            <div className="text-center py-10 text-muted-foreground italic">
              No recent donations found.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
