"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetUsersQuery } from "@/redux/features/user/userApi";
import {
  useCreateManagementMutation,
  useUpdateManagementMutation,
} from "@/redux/features/management/managementApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { useTranslation } from "react-i18next";

const formSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  committeeType: z.enum(["ADVISORY", "INVESTIGATION", "GENERAL"]).default("GENERAL"),
  position: z.string().min(1, "Position is required"),
  startAt: z.string().min(1, "Start date is required"),
  endAt: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});

interface ManagementFormProps {
  initialData?: any;
  onSuccess: () => void;
}

export function ManagementForm({
  initialData,
  onSuccess,
}: ManagementFormProps) {
  const { t } = useTranslation();
  const { data: usersResponse } = useGetUsersQuery({});
  const users = usersResponse?.data || [];
  const [createManagement, { isLoading: isCreating }] =
    useCreateManagementMutation();
  const [updateManagement, { isLoading: isUpdating }] =
    useUpdateManagementMutation();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      userId: initialData?.userId?._id || "unselected",
      name: initialData?.name || "",
      committeeType: initialData?.committeeType || "GENERAL",
      position: initialData?.position || "",
      startAt: initialData?.startAt
        ? new Date(initialData.startAt).toISOString().split("T")[0]
        : "",
      endAt: initialData?.endAt
        ? new Date(initialData.endAt).toISOString().split("T")[0]
        : undefined,
      isActive: initialData ? initialData.isActive : true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const payload = {
      ...values,
      userId: values.userId === "unselected" ? undefined : values.userId,
    };
    try {
      if (initialData) {
        await updateManagement({ id: initialData._id, ...payload }).unwrap();
        toast.success(t("management.toastUpdateSuccess"));
      } else {
        await createManagement(payload).unwrap();
        toast.success(t("management.toastCreateSuccess"));
      }
      onSuccess();
    } catch (error) {
      toast.error(t("management.toastGeneralError"));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="userId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("management.userLabel")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder={t("management.userPlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  <SelectItem value="unselected">{t("management.userNoneOption")}</SelectItem>
                  {users?.map((user: any) => (
                    <SelectItem key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("management.nameLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("management.namePlaceholder")} {...field} className="rounded-xl h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="committeeType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("management.committeeTypeLabel")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder={t("management.committeeTypePlaceholder")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  <SelectItem value="GENERAL">{t("management.committeeGeneral")}</SelectItem>
                  <SelectItem value="ADVISORY">{t("management.committeeAdvisory")}</SelectItem>
                  <SelectItem value="INVESTIGATION">{t("management.committeeInvestigation")}</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="position"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("management.positionLabel")}</FormLabel>
              <FormControl>
                <Input placeholder={t("management.positionPlaceholder")} {...field} className="rounded-xl h-11" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("management.startDateLabel")}</FormLabel>
                <FormControl>
                  <Input type="date" {...field} className="rounded-xl h-11" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="endAt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("management.endDateLabel")}</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field} 
                    value={field.value || ""} 
                    className="rounded-xl h-11" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-2xl border p-4 bg-muted/20">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-xs font-bold">{t("management.activeCheckboxLabel")}</FormLabel>
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full rounded-xl h-12 cursor-pointer font-bold"
          disabled={isCreating || isUpdating}
        >
          {(isCreating || isUpdating) && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          {initialData ? t("management.submitBtnUpdate") : t("management.submitBtnCreate")}
        </Button>
      </form>
    </Form>
  );
}
