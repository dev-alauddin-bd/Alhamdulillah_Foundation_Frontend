"use client";

import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, MapPin, Users, TrendingUp, FileText, 
  Calendar, AlertCircle, Plus, Trash2, ShieldCheck, CheckCircle2 
} from "lucide-react";
import Link from "next/link";
import { 
  useGetProjectQuery, 
  useAddProjectMemberMutation, 
  useRemoveProjectMemberMutation,
  useSettleProjectMutation,
  useUpdateInvestigationMutation
} from "@/redux/features/project/projectApi";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "@/redux/features/auth/authSlice";
import { useTranslation } from "react-i18next";

export default function ProjectDetailsPage() {
  const { t } = useTranslation();
  const params = useParams();
  const projectId = params.id as string;
  const user = useSelector(selectCurrentUser);

  const { data: projectRes, isLoading, error } = useGetProjectQuery(projectId);
  const [addMember, { isLoading: isAddingMember }] = useAddProjectMemberMutation();
  const [removeMember] = useRemoveProjectMemberMutation();
  const [settleProject] = useSettleProjectMutation();
  const [updateInvestigation] = useUpdateInvestigationMutation();

  const project = projectRes?.data || projectRes;

  if (isLoading) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <Card className="p-8 text-center max-w-md mx-auto mt-20">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">{t("projectDetails.projectNotFound")}</h2>
        <Button asChild className="mt-4">
          <Link href="/dashboard/projects">{t("projectDetails.backToDashboard")}</Link>
        </Button>
      </Card>
    );
  }

  const investmentProgress = Math.min(
    ((project.totalInvestment || 0) / (project.initialInvestment || 1)) * 100,
    100
  );

  const handleAddMe = async () => {
    try {
      await addMember({
        projectId,
        memberData: {
          user: user?._id,
          role: "Member",
          responsibility: "Investor",
          active: true
        }
      }).unwrap();
      toast.success(t("common.success"));
    } catch (err: any) {
      toast.error(err?.data?.message || t("common.error"));
    }
  };

  const handleRemoveMember = async (memberUserId: string) => {
    if (!window.confirm(t("users.deleteConfirm"))) return;
    try {
      await removeMember({ projectId, userId: memberUserId }).unwrap();
      toast.success(t("common.success"));
    } catch (err: any) {
      toast.error(err?.data?.message || t("common.error"));
    }
  };

  const handleSettle = async (isProfit: boolean) => {
    const promptMsg = isProfit ? t("projectDetails.profit") : t("projectDetails.loss");
    const amount = prompt(`${t("common.processing")} ${promptMsg}:`, "0");
    if (amount === null) return;
    
    try {
      await settleProject({ 
        projectId,
        profit: isProfit ? Number(amount) : 0,
        loss: isProfit ? 0 : Number(amount)
      }).unwrap();
      toast.success(t("common.success"));
    } catch (err: any) {
      toast.error(err?.data?.message || t("common.error"));
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-10">
      <Link href="/dashboard/projects" className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" />
        <span>{t("projectDetails.backToDashboard")}</span>
      </Link>

      {/* Header Card */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-8 rounded-[2.5rem] border border-muted/20 shadow-xl">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Badge className={`px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest ${
              project.status === 'ongoing' ? 'bg-emerald-500 text-white' : 
              project.status === 'upcoming' ? 'bg-orange-500 text-white' : 'bg-rose-600 text-white'
            }`}>
              {t(`projects.statusLabels.${project.status}`)}
            </Badge>
            <Badge variant="outline" className="px-4 py-1 rounded-full font-black text-[10px] uppercase tracking-widest border-primary/20 text-primary">
              {project.category}
            </Badge>
          </div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">{project.name}</h1>
          <div className="flex flex-wrap items-center gap-6 text-sm font-medium text-muted-foreground">
            <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-primary" />{project.location}</span>
            <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-primary" />{new Date(project.startDate).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="flex gap-3">
          {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
            <Button asChild variant="outline" className="font-bold rounded-xl h-12 px-6">
              <Link href={`/dashboard/projects/${projectId}/edit`}>{t("projects.editProject")}</Link>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="bg-muted/50 p-1.5 rounded-2xl mb-6 flex h-auto">
              <TabsTrigger value="overview" className="flex-1 rounded-xl font-black text-xs uppercase py-3">{t("projectDetails.narrative")}</TabsTrigger>
              <TabsTrigger value="members" className="flex-1 rounded-xl font-black text-xs uppercase py-3">{t("projectDetails.participants")} ({project.memberCount || 0})</TabsTrigger>
              <TabsTrigger value="governance" className="flex-1 rounded-xl font-black text-xs uppercase py-3">{t("projectDetails.governance")}</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="rounded-[2rem] border-muted/20 shadow-sm overflow-hidden">
                <CardHeader className="bg-muted/30 border-b border-muted/20 p-8">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                    <FileText className="w-5 h-5 text-primary" />{t("projectDetails.narrative")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8 prose dark:prose-invert max-w-none text-muted-foreground font-medium">
                  {project.description}
                </CardContent>
              </Card>

              {project.isSettled && (
                <Card className="rounded-[2rem] border-primary/30 bg-primary/5 shadow-inner border-2">
                  <CardContent className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 rounded-2xl bg-primary/20"><CheckCircle2 className="text-primary w-6 h-6" /></div>
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-wide">{t("projectDetails.settledTitle")}</h3>
                        <p className="text-xs font-bold text-muted-foreground">{t("projectDetails.settledSubtitle")}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-background p-5 rounded-2xl border border-muted/20 text-center">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">{t("projectDetails.profit")}</p>
                        <p className="text-2xl font-black text-emerald-500">৳{project.profit?.toLocaleString()}</p>
                      </div>
                      <div className="bg-background p-5 rounded-2xl border border-muted/20 text-center">
                        <p className="text-[10px] font-black text-muted-foreground uppercase mb-1">{t("projectDetails.loss")}</p>
                        <p className="text-2xl font-black text-rose-500">৳{project.loss?.toLocaleString()}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <Card className="rounded-[2rem] border-muted/20 shadow-sm overflow-hidden">
                <CardHeader className="p-8 border-b border-muted/10 flex flex-row items-center justify-between bg-muted/20">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                    <Users className="w-5 h-5 text-primary" />{t("projectDetails.memberRoster")}
                  </CardTitle>
                  {!project.isSettled && (
                    <Button onClick={handleAddMe} disabled={isAddingMember} className="rounded-xl font-black text-[10px] uppercase h-10 px-6">
                      <Plus className="w-4 h-4 mr-2" />{t("projectDetails.joinProject")}
                    </Button>
                  )}
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y divide-muted/10">
                    {project.members?.map((member: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between px-8 py-5 hover:bg-muted/5 group">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-black">{member.user?.name?.[0]}</div>
                          <div>
                            <p className="font-black text-sm">{member.user?.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <Badge className="px-2 py-0 h-4 text-[8px] font-black uppercase bg-primary/10 text-primary border-none">{member.role}</Badge>
                              <span className="text-[10px] font-bold text-muted-foreground">{member.responsibility}</span>
                            </div>
                          </div>
                        </div>
                        {(user?.role === 'SUPER_ADMIN' || user?._id === member.user?._id) && !project.isSettled && (
                          <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.user?._id)} className="text-rose-500 hover:bg-rose-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="governance" className="space-y-6">
              <Card className="rounded-[2rem] border-muted/20 shadow-sm">
                <CardHeader className="p-8 border-b border-muted/20 bg-muted/20">
                  <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-primary" />{t("projectDetails.investigationTitle")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  {project.investigationReport ? (
                    <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl">
                      <p className="text-emerald-500 font-black text-[10px] uppercase mb-3">Verified Report ✓</p>
                      <p className="text-foreground/80 font-medium leading-relaxed">{project.investigationReport}</p>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-muted/10 rounded-2xl border-2 border-dashed border-muted/20">
                      <p className="font-bold text-muted-foreground/60 italic">{t("projectDetails.noReport")}</p>
                    </div>
                  )}
                  
                  {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && (
                    <Button 
                      onClick={() => {
                        const report = prompt(t("projectDetails.submitReport"));
                        if (report) updateInvestigation({ projectId, report, approvals: [] });
                      }}
                      className="w-full mt-6 font-black uppercase text-xs h-12 rounded-xl"
                    >
                      {t("projectDetails.submitReport")}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {(user?.role === 'SUPER_ADMIN' || user?.role === 'ADMIN') && !project.isSettled && (
                <Card className="rounded-[2rem] border-primary/20 bg-primary/5 shadow-lg overflow-hidden">
                  <CardHeader className="p-8 border-b border-primary/10">
                    <CardTitle className="text-sm font-black uppercase text-primary">{t("projectDetails.settlement")}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-8 flex gap-4">
                     <Button onClick={() => handleSettle(true)} className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 font-black uppercase text-xs">{t("projectDetails.settleProfit")}</Button>
                     <Button onClick={() => handleSettle(false)} variant="outline" className="flex-1 h-14 border-rose-200 text-rose-600 font-black uppercase text-xs">{t("projectDetails.settleLoss")}</Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar Sticky Financial Card */}
        <div className="space-y-6">
          <Card className="rounded-[2.5rem] border-none bg-primary shadow-2xl shadow-primary/30 overflow-hidden sticky top-24">
            <CardHeader className="p-8 text-primary-foreground relative overflow-hidden">
               <div className="relative z-10 space-y-2">
                 <p className="text-[10px] font-black uppercase tracking-widest opacity-70">{t("projectDetails.fiscalStanding")}</p>
                 <h2 className="text-4xl font-black">৳{(project.totalInvestment || 0).toLocaleString()}</h2>
               </div>
               <TrendingUp className="absolute bottom-[-10%] right-[-10%] w-40 h-40 text-black/10 -rotate-12" />
            </CardHeader>
            <CardContent className="p-8 bg-background/10 backdrop-blur-md space-y-8 text-primary-foreground">
              <div className="space-y-3">
                <div className="flex justify-between items-end">
                   <p className="text-[10px] font-black uppercase opacity-70">{t("projectDetails.growth")}</p>
                   <p className="text-xl font-black">{Math.round(investmentProgress)}%</p>
                </div>
                <Progress value={investmentProgress} className="h-3 bg-white/20 rounded-full" />
              </div>

              <div className="space-y-4 pt-4 border-t border-white/10">
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold opacity-70">{t("projectDetails.targetCapital")}</span>
                    <span className="font-black">৳{(project.initialInvestment || 0).toLocaleString()}</span>
                 </div>
                 <div className="flex items-center justify-between text-xs">
                    <span className="font-bold opacity-70">{t("projectDetails.raisedSoFar")}</span>
                    <span className="font-black">৳{(project.totalInvestment || 0).toLocaleString()}</span>
                 </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}