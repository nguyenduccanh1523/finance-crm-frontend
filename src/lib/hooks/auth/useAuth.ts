import { useCallback, useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { useAppDispatch } from "@/app/store";
import { setUser } from "@/app/store/authSlice";

export function useLogin() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: login (BE set cookie)
      await axiosClient.post("/auth/login", { email, password });

      // Step 2: fetch profile
      const profile = await axiosClient.get("/auth/me");
      const user = profile.data.data;

      dispatch(setUser(user));
      return user;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Login failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  return { login, loading, error, setError };
}

export function useRequestOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestOtp = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.post("/auth/request-otp", { email });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Request OTP failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { requestOtp, loading, error, setError };
}

export function useResendOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const resendOtp = useCallback(async (email: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.post("/auth/resend-otp", { email });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Resend OTP failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { resendOtp, loading, error, setError };
}

export function useVerifyOtp() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const verifyOtp = useCallback(async (email: string, otp: string) => {
    setLoading(true);
    setError(null);
    try {
      await axiosClient.post("/auth/verify-otp", { email, otp });
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Verify OTP failed";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { verifyOtp, loading, error, setError };
}

export function useCompleteRegistration() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const completeRegistration = useCallback(
    async (params: { email: string; fullName: string; password: string }) => {
      setLoading(true);
      setError(null);
      try {
        // ĐỔI endpoint này cho đúng với BE của bạn
        await axiosClient.post("/auth/register", {
          email: params.email,
          fullName: params.fullName,
          password: params.password,
        });
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Registration failed";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { completeRegistration, loading, error, setError };
}
