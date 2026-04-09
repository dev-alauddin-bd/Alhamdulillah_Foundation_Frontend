"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useGetMeQuery } from "@/redux/features/auth/authApi";
import { useUpdateUserMeMutation } from "@/redux/features/user/userApi";
import {
  Mail,
  Phone,
  User as UserIcon,
  Camera,
  Save,
  XCircle,
  Loader2,
  Edit2,
  ShieldCheck,
  Globe,
} from "lucide-react";
import { toast } from "sonner";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { useTranslation } from "react-i18next";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { data: userResponse, isLoading } = useGetMeQuery(undefined);
  const user = userResponse?.data;
  const [updateUserMe, { isLoading: updating }] = useUpdateUserMeMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

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

  const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=0D9488&color=fff&size=256&bold=true`;

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <AFPageHeader
        title={t("settings.profile")}
        description={t("settings.description")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-8">
          <Card className="overflow-hidden border-none shadow-3xl bg-card/40 backdrop-blur-xl border border-muted/20 rounded-[3rem]">
            <div className="p-10 flex flex-col items-center text-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-primary to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative">
                  <img
                    src={formData.avatar || user?.avatar || defaultAvatar}
                    className="w-40 h-40 rounded-[2.5rem] border-4 border-background shadow-2xl object-cover"
                    alt="Identity Avatar"
                  />
                  {isEditing && (
                    <div className="absolute bottom-2 right-2 flex gap-2">
                       <div className="relative">
                          <input 
                            type="file" 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={async (e) => {
                               const file = e.target.files?.[0];
                               if (!file) return;
                               setUploadingAvatar(true);
                               // Cloudinary upload logic here...
                               setUploadingAvatar(false);
                            }}
                          />
                          <button disabled={uploadingAvatar} className="bg-primary text-white p-3 rounded-2xl shadow-xl">
                            {uploadingAvatar ? <Loader2 size={18} className="animate-spin" /> : <Camera size={18} />}
                          </button>
                       </div>
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

        <div className="lg:col-span-8">
          <Card className="border-none shadow-3xl rounded-[3rem] overflow-hidden min-h-[600px] bg-card/40 backdrop-blur-xl border border-muted/20">
            <div className="p-10 border-b border-muted/30 bg-primary/5">
              <h3 className="text-xs font-black text-primary flex items-center gap-3 uppercase tracking-[0.3em]">
                <UserIcon size={20} />
                Global Infrastructure Registry
              </h3>
            </div>

            <div className="p-10 space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("settings.name")}</label>
                  {isEditing ? (
                    <input name="name" value={formData.name} onChange={handleChange} className="w-full bg-muted/20 rounded-2xl h-16 px-6 text-sm font-black focus:outline-none border-2 border-transparent focus:border-primary/40" />
                  ) : (
                    <div className="h-16 flex items-center px-6 bg-muted/10 rounded-2xl text-sm font-black border border-muted/20">{user?.name}</div>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("settings.phone")}</label>
                  {isEditing ? (
                    <input name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-muted/20 rounded-2xl h-16 px-6 text-sm font-black focus:outline-none border-2 border-transparent focus:border-primary/40" />
                  ) : (
                    <div className="h-16 flex items-center px-6 bg-muted/10 rounded-2xl text-sm font-black border border-muted/20">{user?.phone || "N/A"}</div>
                  )}
                </div>

                <div className="md:col-span-2 space-y-3">
                  <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{t("projects.projectDescription")}</label>
                  {isEditing ? (
                    <input name="address" value={formData.address} onChange={handleChange} className="w-full bg-muted/20 rounded-2xl h-16 px-6 text-sm font-black focus:outline-none border-2 border-transparent focus:border-primary/40" />
                  ) : (
                    <div className="min-h-[4rem] flex items-center px-6 bg-muted/10 rounded-2xl text-sm font-black border border-muted/20 py-4">{user?.address || "No address recorded."}</div>
                  )}
                </div>
              </div>

              {/* SHARES SECTION */}
              <div className="pt-10 space-y-6">
                 <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Foundational Assets</span>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Share ID</p>
                        <p className="text-xl font-black text-primary">{user?.shareNo || "N/A"}</p>
                    </div>
                    <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10">
                        <p className="text-[10px] font-black uppercase text-muted-foreground mb-1">Total Shares</p>
                        <p className="text-xl font-black text-emerald-600">{user?.shareCount || 0}</p>
                    </div>
                 </div>
              </div>

              {isEditing && (
                <div className="pt-12 flex justify-end">
                  <Button
                    size="lg"
                    className="rounded-3xl px-16 h-18 font-black uppercase text-xs tracking-[0.2em] bg-primary"
                    onClick={handleUpdate}
                    disabled={updating || uploadingAvatar}
                  >
                    {updating ? <Loader2 className="mr-3 animate-spin" /> : <Save className="mr-3" />}
                    {t("settings.saveChanges")}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}