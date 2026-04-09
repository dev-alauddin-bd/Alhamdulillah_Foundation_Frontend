"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Link from "next/link";
import { format } from "date-fns";

interface ManagementTableProps {
  managements: any[];
  onEdit: (management: any) => void;
  onDelete: (id: string) => void;
}

export function ManagementTable({
  managements,
  onEdit,
  onDelete,
}: ManagementTableProps) {
  return (
    <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {managements?.length > 0 ? (
              managements.map((management) => (
                <TableRow
                  key={management._id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border border-border">
                        <AvatarImage src={management.userId?.avatar} />
                        <AvatarFallback className="text-xs font-bold">
                          {(management.name || management.userId?.name || "U")
                            .substring(0, 2)
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        {management.userId ? (
                          <Link
                            href={`/dashboard/users/${management.userId._id}`}
                            className="font-semibold hover:text-primary transition-colors hover:underline"
                          >
                            {management.userId.name}
                          </Link>
                        ) : (
                           <span className="font-semibold">{management.name}</span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {management.userId?.email || "No Account"}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{management.position}</TableCell>
                  <TableCell>
                    {management.startAt
                      ? format(new Date(management.startAt), "PPP")
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {management.endAt
                      ? format(new Date(management.endAt), "PPP")
                      : "Present"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={management.isActive ? "default" : "secondary"}
                    >
                      {management.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(management)}
                        className="h-8 w-8 text-blue-500 hover:text-blue-600 hover:bg-blue-50"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(management._id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="h-24 text-center text-muted-foreground"
                >
                  No management records found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
