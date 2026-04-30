// src/app/store/authSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type Role = "ORG_MEMBER" | "ORG_ADMIN" | "SUPER_ADMIN" | "TESTER";

export interface User {
  id: string;
  email: string;
  fullName?: string;
  roles: Role[];
  permissions: string[];
}

interface AuthState {
  user: User | null;
  status: "loading" | "authenticated" | "unauthenticated";
}

const initialState: AuthState = {
  user: null,
  status: "loading", // 🔥 quan trọng: load từ server
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      console.log("🔄 Redux: setUser()", action.payload.email);
      state.user = action.payload;
      state.status = "authenticated";
    },
    clearUser(state) {
      console.log("🔄 Redux: clearUser() - setting status to unauthenticated");
      state.user = null;
      state.status = "unauthenticated";
    },
    setStatus(state, action: PayloadAction<AuthState["status"]>) {
      state.status = action.payload;
    },
  },
});

export const { setUser, clearUser, setStatus } = authSlice.actions;
export default authSlice.reducer;
