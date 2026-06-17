"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

interface InvoiceProps {
  sigName: string;
  setSigName: (v: string) => void;
  sigDesignation: string;
  setSigDesignation: (v: string) => void;
  onGenerate: () => void;
}

export const InvoiceSettings = ({
  sigName,
  setSigName,
  sigDesignation,
  setSigDesignation,
  onGenerate,
}: InvoiceProps) => (
  <Card className="border-2 border-blue-100 shadow-md">
    <CardHeader className="bg-blue-50/50 py-3">
      <CardTitle className="text-lg text-blue-700 flex items-center gap-2">
        <FileDown className="w-5 h-5" />
        Invoice Settings
      </CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      {/* Flex layout used to keep button next to input */}
      <div className="flex flex-col md:flex-row items-end gap-4">
        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Signatory Name
          </label>
          <Input
            placeholder="Name"
            value={sigName}
            onChange={(e) => setSigName(e.target.value)}
            className="h-9"
          />
        </div>

        <div className="flex-1 w-full">
          <label className="text-xs font-medium text-gray-500 mb-1 block">
            Designation
          </label>
          <Input
            placeholder="Designation"
            value={sigDesignation}
            onChange={(e) => setSigDesignation(e.target.value)}
            className="h-9"
          />
        </div>

        {/* Button is small (sm) and fits width based on text (w-fit) */}
        <Button
          onClick={onGenerate}
          disabled={!sigName || !sigDesignation}
          size="sm"
          className="bg-blue-600 hover:bg-blue-800 text-white font-bold h-9 px-6 w-fit"
        >
          Generate PDF
        </Button>
      </div>
    </CardContent>
  </Card>
);
