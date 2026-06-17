import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { logout } from "@/redux/features/auth/authSlice";
import { useLogoutUserMutation } from "@/redux/features/auth/authApi";
import baseApi from "@/redux/baseApi";
import { useRouter } from "next/navigation";

export const useAppLogout = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogout = async () => {
    try {
      // 🚀 Attempt backend logout first
      await logoutUser(undefined).unwrap();
    } catch (error: any) {
      const errorMessage =
        error?.data?.message ||
        error?.message ||
        (error?.status ? `HTTP Status ${error.status}` : null) ||
        String(error);
      console.error("Secure logout protocol encountered an error:", errorMessage, error);
    } finally {
      // 🧹 IMMUTABLE CLEANUP SEQUENCE (Always executes)
      dispatch(logout());
      dispatch(baseApi.util.resetApiState());
      
      toast.success("সফলভাবে লগআউট করা হয়েছে 👋", {
        description: "আবার দেখা হবে ইনশাআল্লাহ।"
      });
      
      router.push("/login");
    }
  };

  return handleLogout;
};