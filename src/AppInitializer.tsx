import { useEffect } from "react";
import { useAppDispatch } from "@/app/store";
import { axiosClient } from "@/lib/api/axiosClient";
import { setUser, setStatus, clearUser } from "@/app/store/authSlice";

interface AppInitializerProps {
  children: React.ReactNode;
}

export function AppInitializer({ children }: AppInitializerProps) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    async function loadUser() {
      try {
        dispatch(setStatus("loading"));
        const res = await axiosClient.get("/auth/me");
        dispatch(setUser(res.data.data));
      } catch (err) {
        dispatch(clearUser());
      }
    }
    loadUser();
  }, []);

  return children;
}
