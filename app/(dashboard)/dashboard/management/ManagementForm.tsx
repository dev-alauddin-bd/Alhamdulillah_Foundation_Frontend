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
        toast.success("রেকর্ড আপডেট করা হয়েছে");
      } else {
        await createManagement(payload).unwrap();
        toast.success("নতুন সদস্য নিয়োগ সফল হয়েছে");
      }
      onSuccess();
    } catch (error) {
      toast.error("একটি ত্রুটি ঘটেছে");
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
              <FormLabel>সংশ্লিষ্ট ইউজার (যদি থাকে)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="ইউজার সিলেক্ট করুন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  <SelectItem value="unselected">ইউজার ছাড়া যুক্ত করুন</SelectItem>
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
              <FormLabel>সদস্যের নাম</FormLabel>
              <FormControl>
                <Input placeholder="নাম লিখুন" {...field} className="rounded-xl h-11" />
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
              <FormLabel>কমিটির ধরন</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="rounded-xl h-11">
                    <SelectValue placeholder="ধরন বেছে নিন" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="rounded-xl">
                  <SelectItem value="GENERAL">বোর্ড অফ মেম্বার</SelectItem>
                  <SelectItem value="ADVISORY">উপদেষ্টা পরিষদ</SelectItem>
                  <SelectItem value="INVESTIGATION">তদন্ত কমিটি</SelectItem>
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
              <FormLabel>পদবী</FormLabel>
              <FormControl>
                <Input placeholder="যেমন: সভাপতি, কোষাধ্যক্ষ" {...field} className="rounded-xl h-11" />
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
                <FormLabel>নিয়োগের তারিখ</FormLabel>
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
                <FormLabel>শেষের তারিখ</FormLabel>
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
                <FormLabel className="text-xs font-bold">বর্তমান সক্রিয় সদস্য</FormLabel>
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
          {initialData ? "পরিবর্তন এপ্লাই করুন" : "নিয়োগ সম্পন্ন করুন"}
        </Button>
      </form>
    </Form>
  );
}
