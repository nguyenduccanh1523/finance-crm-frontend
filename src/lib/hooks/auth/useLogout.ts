import { useCallback } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { useAppDispatch } from "@/app/store";
import { clearUser } from "@/app/store/authSlice";

export function useLogout() {
  const dispatch = useAppDispatch();

  const logout = useCallback(async () => {
    try {
      console.log("🚪 useLogout: Calling /auth/logout...");
      await axiosClient.post("/auth/logout");
      console.log("✅ useLogout: /auth/logout success");
    } catch (err) {
      console.error("❌ Logout error:", err);
    } finally {
      console.log("📍 useLogout: Dispatching clearUser...");
      dispatch(clearUser());
      console.log("✅ useLogout: clearUser dispatched");

      localStorage.removeItem("user");
      sessionStorage.removeItem("user");

      console.log("🔄 useLogout: Hard redirecting to /auth/login...");
      // ✅ Hard redirect - bypass React render cycle
      window.location.href = "/auth/login";
    }
  }, [dispatch]);

  return { logout };
}
