"use client";

import { useGetNoticesQuery, INotice } from "@/redux/features/notice/noticeApi";
import { AFSectionTitle } from "@/components/shared/AFSectionTitle";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, Download, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useTranslation } from "react-i18next";

export default function NoticesPage() {
  const { t } = useTranslation();
  const { data, isLoading } = useGetNoticesQuery(undefined);
  
  // Adjust based on the actual API response shape. Assuming data.data or just data based on api file 
  // looking at api file: url: "/notices", method: "GET" typically returns { success: true, data: [...] }
  // I will check if data is array or object. Safest is data?.data || []
  
  const notices: INotice[] = data?.data || [];

  return (
    <div className="min-h-screen bg-background pt-40 pb-16">
      <div className="container mx-auto px-4">
        
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <AFSectionTitle
            title="Official Notices"
            subtitle="Important Announcements & Updates"
            align="center"
          />
          <p className="text-muted-foreground mt-4">
             Stay informed about the latest activities, decisions, and reports from the Alhamdulillah Foundation board.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4 max-w-4xl mx-auto">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-card/50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-4">
            {notices.length > 0 ? (
              notices.map((notice) => (
                <Card 
                  key={notice._id} 
                  className="group hover:shadow-lg transition-all duration-300 border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden"
                >
                  <CardContent className="p-0 flex flex-col sm:flex-row items-center">
                    {/* Date Block */}
                    <div className="bg-primary/5 h-full w-full sm:w-32 flex flex-col items-center justify-center p-4 border-b sm:border-b-0 sm:border-r border-border/60 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <span className="text-3xl font-bold leading-none">
                        {format(new Date(notice.createdAt), "dd")}
                      </span>
                      <span className="text-xs uppercase font-bold tracking-wider mt-1 opacity-70">
                         {format(new Date(notice.createdAt), "MMM yyyy")}
                      </span>
                    </div>
                    
                    {/* Content Block */}
                    <div className="flex-1 p-5 text-center sm:text-left">
                       <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                         {notice.title}
                       </h3>
                       <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground">
                          <FileText className="w-3 h-3" />
                          <span>Official Document</span>
                          {notice.submitBy && (
                             <>
                                <span className="w-1 h-1 rounded-full bg-border" />
                                <span>Posted by {notice.submitBy.name}</span>
                             </>
                          )}
                       </div>
                    </div>

                    {/* Action Block */}
                    <div className="p-5">
                       {notice.fileUrl ? (
                         <Button asChild variant="outline" className="rounded-full gap-2 border-primary/20 hover:bg-primary hover:text-white group-hover:border-white/20">
                            <a href={notice.fileUrl} target="_blank" rel="noopener noreferrer">
                               <Download className="w-4 h-4" />
                               Download
                            </a>
                         </Button>
                       ) : (
                         <span className="text-xs text-muted-foreground italic">No Attachment</span>
                       )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-16 bg-card/30 rounded-2xl border-2 border-dashed border-border/50">
                 <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="w-8 h-8 text-muted-foreground" />
                 </div>
                 <h3 className="text-xl font-bold mb-2">No Notices Found</h3>
                 <p className="text-muted-foreground">There are no notices to display at this time.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
