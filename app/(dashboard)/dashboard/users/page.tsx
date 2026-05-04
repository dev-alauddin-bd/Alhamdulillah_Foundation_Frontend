"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Trash2,
  Shield,
  Loader2,
  Mail,
  User as UserIcon,
  ShieldAlert,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  useGetUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} from "@/redux/features/user/userApi";
import { useSelector } from "react-redux";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UserRole } from "@/redux/features/auth/authSlice";
import { AFPageHeader } from "@/components/shared/AFPageHeader";
import { AFSearchFilters } from "@/components/shared/AFSearchFilters";
import { AFDataTable } from "@/components/shared/AFDataTable";
import { AFModal } from "@/components/shared/AFModal";
import { AFSectionTitle } from "@/components/shared/AFSectionTitle";
import { AFPagination } from "@/components/shared/AFPagination";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

const AVAILABLE_PERMISSIONS = [
  "manage_users",
  "manage_projects",
  "manage_banners",
  "view_analytics",
  "approve_payments",
  "manage_members",
];

export default function UsersPage() {
  const { t } = useTranslation();
  
  //======================   STATE & HOOKS   ===============================
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [editingUser, setEditingUser] = useState<any>(null);
  const [viewingUser, setViewingUser] = useState<any>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const currentUser = useSelector((state: any) => state.AFAuth.user);
  const isAdmin = currentUser?.role === UserRole.SUPER_ADMIN || currentUser?.role === UserRole.ADMIN;

  const { data: usersResponse, isLoading } = useGetUsersQuery({
    page,
    limit,
    search: searchTerm || undefined,
    role: roleFilter === "all" ? undefined : roleFilter,
  });

  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const users = usersResponse?.data || [];
  const meta = usersResponse?.meta || { totalPages: 1, total: 0 };

  //======================   EVENT HANDLERS   ===============================
  const handleRoleChange = async (userId: string, newRole: string) => {
    if (!isAdmin) return;
    const toastId = toast.loading(t("common.processing"));
    try {
      await updateUser({ id: userId, data: { role: newRole } }).unwrap();
      toast.success(t("users.roleUpdateSuccess"), { id: toastId });
    } catch (error) {
      toast.error(t("users.roleUpdateError"), { id: toastId });
    }
  };

  const handleDelete = async (userId: string) => {
    if (!isAdmin) return;
    if (confirm(t("users.deleteConfirm"))) {
      const toastId = toast.loading(t("common.processing"));
      try {
        await deleteUser(userId).unwrap();
        toast.success(t("users.deleteSuccess"), { id: toastId });
      } catch (error) {
        toast.error(t("users.deleteError"), { id: toastId });
      }
    }
  };

  const handlePermissionToggle = (permission: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permission)
        ? prev.filter((p) => p !== permission)
        : [...prev, permission],
    );
  };

  const openPermissionModal = (user: any) => {
    setEditingUser(user);
    setSelectedPermissions(user.permissions || []);
    setIsModalOpen(true);
  };

  const openProfileView = (user: any) => {
    setViewingUser(user);
    setIsProfileModalOpen(true);
  };

  //======================   TABLE DEFINITION   ===============================
  const columns = [
    {
      header: t("users.name"),
      cell: (user: any) => (
        <div className="flex items-center gap-4 group">
          <Avatar className="h-11 w-11 border-2 border-primary/10 shadow-sm">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback className="bg-primary/10 text-primary font-black text-sm">
              {user.name?.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-bold text-foreground text-sm">
              {user.name}
            </span>
            <span className="text-[10px] text-muted-foreground/60 flex items-center gap-1 font-bold uppercase tracking-tight">
              <Mail size={10} />
              {user.email}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: t("management.position") || "Designation",
      cell: (user: any) => (
        <span className="text-xs font-bold text-muted-foreground bg-muted/20 px-2 py-1 rounded-lg">
          {user.designation || "N/A"}
        </span>
      ),
    },
    {
      header: t("users.role"),
      cell: (user: any) => (
        isAdmin ? (
          <Select
            defaultValue={user.role}
            onValueChange={(value) => handleRoleChange(user._id, value)}
          >
            <SelectTrigger className="w-[140px] h-9 text-[10px] font-black uppercase tracking-widest rounded-xl bg-background/50 border-muted-foreground/10 shadow-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-muted/20 shadow-2xl">
              <SelectItem value={UserRole.ADMIN} className="text-xs font-black uppercase tracking-widest">
                {t("users.admin")}
              </SelectItem>
              <SelectItem value={UserRole.MEMBER} className="text-xs font-black uppercase tracking-widest">
                {t("users.member")}
              </SelectItem>
              <SelectItem value={UserRole.USER} className="text-xs font-black uppercase tracking-widest">
                {t("users.registered")}
              </SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="secondary" className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-muted/30">
            {user.role}
          </Badge>
        )
      ),
    },
    {
      header: t("users.permissions"),
      cell: (user: any) => (
        <div className="flex flex-wrap gap-1.5 max-w-[240px]">
          {user.permissions?.length > 0 ? (
            user.permissions.map((p: string) => (
              <Badge
                key={p}
                variant="secondary"
                className="text-[8px] px-2 h-5 capitalize font-black bg-primary/5 text-primary/70 border-primary/10 tracking-tighter rounded-full"
              >
                {p.replace(/_/g, " ")}
              </Badge>
            ))
          ) : (
            <span className="text-[10px] text-muted-foreground font-black uppercase tracking-widest bg-muted/20 px-2 py-0.5 rounded-full">
              {t("users.standard")}
            </span>
          )}
        </div>
      ),
    },
    {
      header: t("payments.actions"),
      cell: (user: any) => (
        isAdmin ? (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl border border-blue-500/10 cursor-pointer text-blue-500 hover:text-blue-600 hover:bg-blue-500/5 transition-all shadow-sm"
              onClick={() => openPermissionModal(user)}
            >
              <ShieldAlert className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-2xl border border-red-500/10 cursor-pointer text-red-500 hover:text-red-600 hover:bg-red-500/5 transition-all shadow-sm"
              onClick={() => handleDelete(user._id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            className="text-[10px] font-black uppercase tracking-widest bg-primary/5 text-primary hover:bg-primary/10 rounded-xl"
            onClick={() => openProfileView(user)}
          >
            {t("payments.viewDetails")}
          </Button>
        )
      ),
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <AFPageHeader
        title={t("users.title")}
        description={t("users.description")}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         <Card className="p-6 border-none bg-card/40 backdrop-blur-md shadow-sm flex items-center gap-6 rounded-[2rem]">
            <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
               <Users size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{t("users.totalUsers")}</p>
               <p className="text-2xl font-black">{meta.total || 0}</p>
            </div>
         </Card>
         <Card className="p-6 border-none bg-card/40 backdrop-blur-md shadow-sm flex items-center gap-6 rounded-[2rem]">
            <div className="h-14 w-14 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
               <Shield size={28} />
            </div>
            <div>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{t("users.admins")}</p>
               <p className="text-2xl font-black">{users.filter((u: any) => u.role === 'ADMIN').length}</p>
            </div>
         </Card>
      </div>

      <div className="space-y-8">
        <AFSectionTitle 
          title={t("users.sectionTitle")} 
          subtitle={t("users.sectionSubtitle")}
        />

        <div className="rounded-[3rem] overflow-hidden bg-card/30 backdrop-blur-md border border-muted/20 shadow-2xl p-8">
          <AFSearchFilters
            searchValue={searchTerm}
            onSearchChange={(val) => { setSearchTerm(val); setPage(1); }}
            searchPlaceholder={t("users.searchPlaceholder")}
          >
            <Select value={roleFilter} onValueChange={(val) => { setRoleFilter(val); setPage(1); }}>
              <SelectTrigger className="w-full sm:w-[240px] h-12 rounded-2xl bg-background/50 backdrop-blur-sm shadow-sm border-muted-foreground/10 font-black text-[10px] uppercase tracking-widest">
                <SelectValue placeholder={t("users.roleFilter")} />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border-muted/20 shadow-2xl">
                <SelectItem value="all" className="text-xs font-black uppercase tracking-widest">{t("payments.allStatuses")}</SelectItem>
                <SelectItem value={UserRole.ADMIN} className="text-xs font-black uppercase tracking-widest">{t("users.admin")}</SelectItem>
                <SelectItem value={UserRole.MEMBER} className="text-xs font-black uppercase tracking-widest">{t("users.member")}</SelectItem>
                <SelectItem value={UserRole.USER} className="text-xs font-black uppercase tracking-widest">{t("users.registered")}</SelectItem>
              </SelectContent>
            </Select>
          </AFSearchFilters>

          <div className="mt-10 rounded-[2rem] overflow-hidden shadow-2xl border border-muted/10 bg-card/50">
            <AFDataTable
              columns={columns}
              data={users}
              isLoading={isLoading}
              emptyMessage={t("common.noData")}
            />
          </div>

          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
             <div className="text-xs text-muted-foreground">
                {t("payments.page")} {page} / {meta.totalPages} ({meta.total})
             </div>
             <AFPagination 
                currentPage={page}
                totalPages={meta.totalPages}
                onPageChange={(p) => { setPage(p); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
             />
          </div>
        </div>
      </div>

      {/* User Profile View Modal */}
      <AFModal
        isOpen={isProfileModalOpen}
        onOpenChange={setIsProfileModalOpen}
        title={t("users.profileTitle")}
        className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl"
      >
        <div className="space-y-8">
           <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-24 w-24 rounded-[2rem] bg-primary/10 flex items-center justify-center border-4 border-background shadow-xl">
                 <span className="text-4xl font-black text-primary">{viewingUser?.name?.charAt(0)}</span>
              </div>
              <div>
                 <h3 className="text-2xl font-black">{viewingUser?.name}</h3>
                 <p className="text-sm font-bold text-muted-foreground">{viewingUser?.email}</p>
                 <Badge variant="secondary" className="mt-2 text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary border-none">
                    {viewingUser?.role}
                 </Badge>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4">
              <div className="p-5 rounded-[1.5rem] bg-muted/20 border border-muted/10">
                 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3">ব্যবহারকারীর তথ্য</p>
                 
                 <div className="space-y-2">
                    <div className="flex justify-between items-center bg-background/50 p-4 rounded-xl">
                       <span className="text-xs font-bold text-muted-foreground">র‍্যাঙ্ক / পদবী</span>
                       <span className="text-sm font-black text-blue-600">{viewingUser?.designation || "সদস্য"}</span>
                    </div>
                    <div className="flex justify-between items-center bg-background/50 p-4 rounded-xl">
                       <span className="text-xs font-bold text-muted-foreground">ফোন নম্বর</span>
                       <span className="text-sm font-black text-foreground">{viewingUser?.phone || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center bg-background/50 p-4 rounded-xl">
                       <span className="text-xs font-bold text-muted-foreground">শেয়ার নম্বর</span>
                       <span className="text-sm font-black text-primary">{viewingUser?.shareNo || "N/A"}</span>
                    </div>
                    <div className="flex justify-between items-center bg-background/50 p-4 rounded-xl">
                       <span className="text-xs font-bold text-muted-foreground">মোট শেয়ার</span>
                       <span className="text-sm font-black text-emerald-600">{viewingUser?.shareCount || 0}</span>
                    </div>
                    <div className="p-4 bg-background/50 rounded-xl">
                       <span className="text-xs font-bold text-muted-foreground block mb-1">ঠিকানা</span>
                       <span className="text-xs font-medium text-foreground">{viewingUser?.address || "তথ্য নেই"}, {viewingUser?.cityState || ""}</span>
                    </div>
                 </div>
              </div>
           </div>

           <Button className="w-full h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest" onClick={() => setIsProfileModalOpen(false)}>
              {t("common.close")}
           </Button>
        </div>
      </AFModal>

      {/* Security Protocol Modal */}
      <AFModal
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
        title={t("users.editTitle")}
        className="sm:max-w-[550px] rounded-[2.5rem] border-none shadow-2xl"
      >
        <div className="space-y-8">
          <div className="bg-primary/5 p-6 rounded-[2rem] flex items-center gap-5 border border-primary/10">
            <div className="bg-primary/10 h-16 w-16 rounded-2xl flex items-center justify-center">
              <ShieldAlert className="text-primary h-8 w-8" />
            </div>
            <div>
              <h4 className="font-black text-2xl text-foreground">{editingUser?.name}</h4>
              <p className="text-xs font-bold text-muted-foreground/60">{editingUser?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("users.shareNo")}</label>
              <Input 
                value={editingUser?.shareNo || ""} 
                onChange={(e) => setEditingUser({...editingUser, shareNo: e.target.value})}
                className="rounded-2xl h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("users.shareCount")}</label>
              <Input 
                type="number"
                value={editingUser?.shareCount || 0} 
                onChange={(e) => setEditingUser({...editingUser, shareCount: Number(e.target.value)})}
                className="rounded-2xl h-11"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("management.position") || "Designation"}</label>
              <Input 
                value={editingUser?.designation || ""} 
                onChange={(e) => setEditingUser({...editingUser, designation: e.target.value})}
                className="rounded-2xl h-11"
              />
            </div>
          </div>

          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{t("users.permissions")}</label>
             <div className="grid grid-cols-1 gap-2 max-h-[250px] overflow-y-auto pr-2">
                {AVAILABLE_PERMISSIONS.map((permission) => (
                <div
                    key={permission}
                    onClick={() => handlePermissionToggle(permission)}
                    className={`flex items-center space-x-4 p-4 rounded-2xl border cursor-pointer transition-all ${
                    selectedPermissions.includes(permission) ? "bg-primary/10 border-primary/20" : "bg-background border-muted/30"
                    }`}
                >
                    <Checkbox checked={selectedPermissions.includes(permission)} className="h-4 w-4 rounded-md pointer-events-none" />
                    <Label className="capitalize cursor-pointer flex-1 text-[10px] font-black tracking-widest uppercase pointer-events-none">
                       {permission.replace(/_/g, " ")}
                    </Label>
                </div>
                ))}
             </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-muted/30">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="rounded-2xl px-10 h-12 font-black uppercase text-[10px] tracking-widest">
              {t("common.cancel")}
            </Button>
            <Button
              onClick={async () => {
                const toastId = toast.loading(t("common.processing"));
                try {
                  await updateUser({
                    id: editingUser._id,
                    data: { 
                      permissions: selectedPermissions,
                      shareNo: editingUser.shareNo,
                      shareCount: editingUser.shareCount,
                      designation: editingUser.designation
                    },
                  }).unwrap();
                  toast.success(t("common.success"), { id: toastId });
                  setIsModalOpen(false);
                } catch (error) {
                  toast.error(t("common.error"), { id: toastId });
                }
              }}
              disabled={isUpdating}
              className="rounded-2xl px-12 h-12 font-black uppercase text-[10px] tracking-widest bg-primary"
            >
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {t("common.save")}
            </Button>
          </div>
        </div>
      </AFModal>
    </div>
  );
}