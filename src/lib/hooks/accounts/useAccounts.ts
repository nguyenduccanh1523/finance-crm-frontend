import { useCallback, useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";

export interface Account {
  id: string;
  name: string;
  type: "BANK" | "CASH" | "CREDIT_CARD" | "INVESTMENT" | "OTHER";
  currency: string;
  openingBalanceCents: number;
  currentBalanceCents?: number;
  createdAt?: string;
  updatedAt?: string;
}

export function useGetAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/personal/accounts");
      const data = Array.isArray(response.data.data)
        ? response.data.data
        : Array.isArray(response.data)
          ? response.data
          : [];
      setAccounts(data);
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to fetch accounts";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { accounts, setAccounts, loading, error, fetchAccounts };
}

export function useCreateAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAccount = useCallback(
    async (data: {
      name: string;
      type: string;
      currency: string;
      openingBalanceCents: number;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.post("/personal/accounts", data);
        return response.data.data || response.data;
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Failed to create account";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { createAccount, loading, error, setError };
}

export function useUpdateAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateAccount = useCallback(
    async (
      id: string,
      data: {
        name: string;
        type: string;
        currency: string;
        openingBalanceCents: number;
      },
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.patch(
          `/personal/accounts/${id}`,
          data,
        );
        return response.data.data || response.data;
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Failed to update account";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateAccount, loading, error, setError };
}

export function useDeleteAccount() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteAccount = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.delete(`/personal/accounts/${id}`);
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to delete account";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteAccount, loading, error, setError };
}
