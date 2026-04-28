import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/app/store";
import { axiosClient } from "@/lib/api/axiosClient";
import { setUser, clearUser } from "@/app/store/authSlice";

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    async function loadUser() {
      try {
        console.log("🚀 AppInitializer: Calling /auth/me...");
        const res = await axiosClient.get("/auth/me");
        console.log("✅ AppInitializer: /auth/me success", res.data.data);
        dispatch(setUser(res.data.data));
      } catch (err) {
        console.error("❌ AppInitializer: /auth/me error", err);
        // 🔥 dispatch clearUser trực tiếp để đảm bảo status update
        console.log(
          "📍 AppInitializer: catch block - Dispatching clearUser...",
        );
        dispatch(clearUser());
        // 💤 Thêm small delay để Redux state update được dispatch
        await new Promise((resolve) => setTimeout(resolve, 50));
        console.log("✅ AppInitializer: clearUser dispatched after delay");
      }
    }
    loadUser();
  }, []);

  return children;
}
