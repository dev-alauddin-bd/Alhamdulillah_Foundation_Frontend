"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

interface CSVExportButtonProps {
  data: any[];
  filename: string;
  label: string;
}

export function CSVExportButton({ data, filename, label }: CSVExportButtonProps) {
  const exportToCSV = () => {
    if (!data || data.length === 0) {
      toast.error("No data to export");
      return;
    }

    try {
      // Get headers from first object keys
      const headers = Object.keys(data[0]);
      
      // Create CSV rows
      const csvRows = [
        headers.join(","), // header row
        ...data.map(row => 
          headers.map(header => {
            const val = row[header];
            // Handle nested objects or commas in values
            const escaped = ('' + (val ?? '')).replace(/"/g, '""');
            return `"${escaped}"`;
          }).join(",")
        )
      ];

      const csvString = csvRows.join("\n");
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`${label} exported successfully`);
    } catch (error) {
      console.error("Export error:", error);
      toast.error("Failed to export data");
    }
  };

  return (
    <Button 
      variant="outline" 
      size="sm" 
      onClick={exportToCSV}
      className="flex items-center gap-2 hover:bg-primary hover:text-white transition-all duration-300"
    >
      <Download size={16} />
      {label}
    </Button>
  );
}
