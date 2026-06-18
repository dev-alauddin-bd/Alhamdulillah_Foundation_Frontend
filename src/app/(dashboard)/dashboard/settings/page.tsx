"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
    useGetMeQuery, 
    useGetSessionsQuery, 
    useRevokeSessionMutation,
    useChangePasswordMutation
} from "@/redux/features/auth/authApi";
import { useUpdateUserMeMutation } from "@/redux/features/user/userApi";
import {
  Mail,
  Phone,
  User as UserIcon,
  Save,
  XCircle,
  Loader2,
  Edit2,
  ShieldCheck,
  CheckCircle2,
  Smartphone,
  Monitor,
  Globe,
  Trash2,
  Lock,
} from "lucide-react";
import { toast } from "sonner";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { useTranslation } from "react-i18next";
import CloudinaryUpload from "@/components/shared/CloudinaryUpload";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { data: userResponse, isLoading } = useGetMeQuery(undefined);
  const user = userResponse?.data?.user;
  const [updateUserMe, { isLoading: updating }] = useUpdateUserMeMutation();
  const { data: sessionsResponse, isLoading: loadingSessions } = useGetSessionsQuery(undefined);
  const [revokeSession] = useRevokeSessionMutation();
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  const [, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  
  // Security State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");


  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    cityState: "",
    avatar: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
        cityState: user.cityState || "",
        avatar: user.avatar || "",
      });
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-6">
        <div className="relative">
          <div className="h-20 w-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
             <UserIcon size={24} className="text-primary animate-pulse" />
          </div>
        </div>
        <p className="text-muted-foreground font-black uppercase tracking-[0.3em] text-[10px] animate-pulse">
          {t("projects.loading")}
        </p>
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    const toastId = toast.loading(t("settings.saving"));
    try {
      await updateUserMe(formData).unwrap();
      setIsEditing(false);
      toast.success(t("common.success"), { id: toastId });
    } catch (err) {
      toast.error(t("common.error"), { id: toastId });
    }
  };

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
        toast.error(t("settings.passwordsDoNotMatch"));
        return;
    }

    const toastId = toast.loading(t("settings.changingPassword"));
    try {
      await changePassword({ newPassword }).unwrap();
      toast.success(t("settings.passwordChangeSuccess"), { id: toastId });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(t("settings.passwordChangeError", { defaultValue: "Failed to change password." }), { id: toastId });
    }
  };

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0D9488&color=fff&size=256&bold=true`;

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <AFPageHeader
        title={t("settings.title")}
        description={t("settings.description")}
      />

      <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-center mb-10">
            <TabsList className="bg-card/40 backdrop-blur-md p-1.5 rounded-[2rem] border border-muted/20 h-auto gap-2">
                <TabsTrigger value="profile" className="rounded-2xl px-10 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                    {t("settings.profile")}
                </TabsTrigger>
                <TabsTrigger value="security" className="rounded-2xl px-10 py-3 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-primary data-[state=active]:text-white">
                    {t("settings.security")}
                </TabsTrigger>
            </TabsList>
        </div>

        <TabsContent value="profile">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Profile Card Left */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="overflow-hidden border-none shadow-3xl bg-card/40 backdrop-blur-xl border border-muted/20 rounded-[3rem]">
                        <div className="p-10 flex flex-col items-center text-center">
                            <div className="relative group">
                                <div className="absolute -inset-1 bg-primary/20 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                                <div className="relative">
                                    <img
                                        src={formData.avatar || user?.avatar || defaultAvatar}
                                        className="w-40 h-40 rounded-[2.5rem] border-4 border-background shadow-2xl object-cover"
                                        alt="Identity Avatar"
                                    />
                                    {isEditing && (
                                        <div className="absolute -bottom-2 -right-2">
                                            <CloudinaryUpload 
                                                onUploadSuccess={(url) => setFormData({...formData, avatar: url})}
                                                label=""
                                            />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 space-y-2">
                                <h2 className="text-3xl font-black text-foreground tracking-tighter">
                                    {user?.name}
                                </h2>
                                <div className="flex items-center justify-center gap-2">
                                    <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-4 py-1.5 rounded-full">
                                        {user?.role}
                                    </Badge>
                                    <Badge className="bg-emerald-500/10 text-emerald-600 border-none text-[10px] font-black uppercase px-4 py-1.5 rounded-full flex items-center gap-1">
                                        <ShieldCheck size={10} /> {user?.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="mt-10 w-full space-y-4">
                                <div className="flex items-center gap-4 p-5 bg-muted/20 rounded-2xl border border-muted/30">
                                    <Mail size={18} className="text-primary" />
                                    <div className="text-left flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{t("settings.email")}</p>
                                        <p className="text-sm font-bold truncate">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 p-5 bg-muted/20 rounded-2xl border border-muted/30">
                                    <Phone size={18} className="text-emerald-500" />
                                    <div className="text-left flex-1">
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-60">{t("settings.phone")}</p>
                                        <p className="text-sm font-bold">{user?.phone || "Pending..."}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-10 pt-0">
                            <Button
                                size="lg"
                                variant={isEditing ? "destructive" : "outline"}
                                onClick={() => setIsEditing(!isEditing)}
                                className="w-full h-14 rounded-2xl font-black uppercase text-xs tracking-[0.2em]"
                            >
                                {isEditing ? (
                                    <> <XCircle size={18} className="mr-3" /> {t("common.cancel")} </>
                                ) : (
                                    <> <Edit2 size={18} className="mr-3" /> {t("projects.editProject")} </>
                                )}
                            </Button>
                        </div>
                    </Card>
                </div>

                {/* Profile Form Right */}
                <div className="lg:col-span-8">
                    <Card className="border-none shadow-3xl rounded-[3rem] overflow-hidden min-h-[600px] bg-card/40 backdrop-blur-xl border border-muted/20">
                        <div className="p-10 border-b border-muted/30 bg-primary/5">
                            <h3 className="text-xs font-black text-primary flex items-center gap-3 uppercase tracking-[0.3em]">
                                <UserIcon size={20} />
                                {t("settings.profile")}
                            </h3>
                        </div>

                        <div className="p-10 space-y-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("settings.name")}</label>
                                    <Input disabled={!isEditing} name="name" value={formData.name} onChange={handleChange} className="bg-muted/20 rounded-2xl h-16 px-6 text-sm font-black" />
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("settings.phone")}</label>
                                    <Input disabled={!isEditing} name="phone" value={formData.phone} onChange={handleChange} className="bg-muted/20 rounded-2xl h-16 px-6 text-sm font-black" />
                                </div>

                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("settings.address")}</label>
                                    <Input disabled={!isEditing} name="address" value={formData.address} onChange={handleChange} className="bg-muted/20 rounded-2xl h-16 px-6 text-sm font-black" />
                                </div>
                                
                                <div className="md:col-span-2 space-y-3">
                                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("settings.cityState")}</label>
                                    <Input disabled={!isEditing} name="cityState" value={formData.cityState} onChange={handleChange} className="bg-muted/20 rounded-2xl h-16 px-6 text-sm font-black" />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="pt-12 flex justify-end">
                                    <Button
                                        size="lg"
                                        className="rounded-3xl px-16 h-18 font-black uppercase text-xs tracking-[0.2em] bg-primary"
                                        onClick={handleUpdate}
                                        disabled={updating}
                                    >
                                        {updating ? <Loader2 className="mr-3 animate-spin" /> : <Save className="mr-3" />}
                                        {t("settings.saveChanges")}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Active Sessions Section */}
                    <Card className="mt-10 border-none shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-muted/20">
                        <div className="p-10 border-b border-muted/30 bg-primary/5 flex items-center justify-between">
                            <h3 className="text-xs font-black text-primary flex items-center gap-3 uppercase tracking-[0.3em]">
                                <Monitor size={20} />
                                {t("settings.activeSessions")}
                            </h3>
                            <Badge className="bg-primary/10 text-primary border-none text-[10px] font-black uppercase px-4 py-1.5 rounded-full">
                                {sessionsResponse?.data?.length || 0} DEVICES
                            </Badge>
                        </div>

                        <div className="p-10 space-y-6">
                            <p className="text-xs font-medium text-muted-foreground leading-relaxed mb-6">
                                {t("settings.activeSessionsDesc")}
                            </p>

                            <div className="space-y-4">
                                {sessionsResponse?.data?.map((session: any) => (
                                    <div key={session.sessionId} className="flex items-center justify-between p-6 bg-muted/20 rounded-[2rem] border border-muted/30 group hover:border-primary/30 transition-all duration-500">
                                        <div className="flex items-center gap-5">
                                            <div className="h-14 w-14 rounded-2xl bg-card flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500">
                                                {session.os.toLowerCase().includes('windows') || session.os.toLowerCase().includes('mac') ? (
                                                    <Monitor className="text-primary" size={24} />
                                                ) : (
                                                    <Smartphone className="text-emerald-500" size={24} />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-foreground">
                                                    {session.device}
                                                </h4>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="flex items-center gap-1 text-[10px] font-bold text-muted-foreground">
                                                        <Globe size={12} /> {session.ip}
                                                    </span>
                                                    <span className="h-1 w-1 rounded-full bg-muted-foreground/30"></span>
                                                    <span className="text-[10px] font-bold text-muted-foreground">
                                                        {session.browser}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => revokeSession(session.sessionId)}
                                            className="h-12 w-12 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                                        >
                                            <Trash2 size={18} />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </TabsContent>

        <TabsContent value="security">
            <div className="max-w-2xl mx-auto space-y-10">
                <Card className="border-none shadow-3xl rounded-[3rem] overflow-hidden bg-card/40 backdrop-blur-xl border border-muted/20">
                    <div className="p-10 border-b border-muted/30 bg-primary/5">
                        <h3 className="text-xs font-black text-primary flex items-center gap-3 uppercase tracking-[0.3em]">
                            <Lock size={20} />
                            {t("settings.changePasswordTitle")}
                        </h3>
                    </div>

                    <div className="p-10 space-y-8">
                        <div className="space-y-6">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("settings.newPasswordLabel")}</label>
                                <Input 
                                    type="password" 
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-muted/20 rounded-2xl h-16 px-6 text-sm font-black" 
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("settings.confirmPasswordLabel")}</label>
                                <Input 
                                    type="password" 
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-muted/20 rounded-2xl h-16 px-6 text-sm font-black" 
                                />
                            </div>
                            
                            <div className="pt-6 flex gap-4">
                                <Button 
                                    variant="outline" 
                                    onClick={() => {
                                        setNewPassword("");
                                        setConfirmPassword("");
                                    }}
                                    className="flex-1 h-16 rounded-2xl font-black uppercase text-[10px] tracking-widest"
                                >
                                    {t("common.cancel")}
                                </Button>
                                <Button 
                                    onClick={handlePasswordChange}
                                    disabled={changingPassword}
                                    className="flex-[2] h-16 rounded-2xl bg-emerald-600 font-black uppercase text-[10px] tracking-widest text-white"
                                >
                                    {changingPassword ? <Loader2 className="animate-spin mr-2" /> : <CheckCircle2 className="mr-2" />}
                                    {t("settings.updateBtn")}
                                </Button>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
