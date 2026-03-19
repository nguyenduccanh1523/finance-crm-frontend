import { useCallback, useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";

export interface Transaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  workspaceId: string;
  accountId: string;
  transactionTags: any[];
  type: "EXPENSE" | "INCOME" | "TRANSFER";
  amountCents: string;
  currency: string;
  occurredAt: string;
  categoryId: string;
  note: string;
  counterparty: string;
  transferAccountId: string | null;
  tags: Array<{
    id: string;
    name: string;
    color: string;
  }>;
  account?: {
    id: string;
    name: string;
    type: string;
    currency: string;
    openingBalanceCents: string;
    currentBalanceCents: string;
  };
  category?: {
    id: string;
    name: string;
    icon?: string;
  };
}

export interface TransactionsResponse {
  statusCode: number;
  message: string;
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface GetTransactionsParams {
  from: string;
  to: string;
  type?: "EXPENSE" | "INCOME" | "TRANSFER";
  accountId?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "ASC" | "DESC";
}

export interface CreateTransactionParams {
  accountId: string;
  type: "EXPENSE" | "INCOME" | "TRANSFER";
  amountCents: number;
  occurredAt: string;
  categoryId: string;
  note: string;
  counterparty: string;
  tagIds: string[];
  transferAccountId?: string;  exchangeRate?: number;}

export interface UpdateTransactionParams {
  tagIds?: string[];
}

export function useGetTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTransactions = useCallback(
    async (params: GetTransactionsParams) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.get<TransactionsResponse>(
          "/personal/transactions",
          {
            params,
          },
        );
        const data = response.data;
        setTransactions(data.data || []);
        setPagination(data.pagination);
        return data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ?? "Failed to fetch transactions";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    transactions,
    pagination,
    loading,
    error,
    fetchTransactions,
    setError,
  };
}

export function useCreateTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTransaction = useCallback(
    async (data: CreateTransactionParams) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.post<{
          data: Transaction;
        }>("/personal/transactions", data);
        return response.data.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ?? "Failed to create transaction";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { createTransaction, loading, error, setError };
}

export function useUpdateTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTransaction = useCallback(
    async (id: string, data: UpdateTransactionParams) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.patch<{
          data: Transaction;
        }>(`/personal/transactions/${id}`, data);
        return response.data.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ?? "Failed to update transaction";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateTransaction, loading, error, setError };
}

export function useDeleteTransaction() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTransaction = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.delete(`/personal/transactions/${id}`);
      return response.data;
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ?? "Failed to delete transaction";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTransaction, loading, error, setError };
}
