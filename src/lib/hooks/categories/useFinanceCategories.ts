import { useCallback, useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";

export type CategoryKind = "INCOME" | "EXPENSE";
export type CategoryScope = "global" | "workspace";

export interface FinanceCategory {
  id: string;
  workspaceId: string | null;
  name: string;
  kind: CategoryKind;
  icon: string;
  scope: CategoryScope;
  createdAt: string;
}

export interface CategoriesResponse {
  global: FinanceCategory[];
  workspace: FinanceCategory[];
}

export function useGetFinanceCategories() {
  const [global, setGlobal] = useState<FinanceCategory[]>([]);
  const [workspace, setWorkspace] = useState<FinanceCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/personal/categories");
      const data = response.data.data || response.data;
      setGlobal(data.global || []);
      setWorkspace(data.workspace || []);
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to fetch categories";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    global,
    setGlobal,
    workspace,
    setWorkspace,
    loading,
    error,
    fetchCategories,
  };
}

export function useCreateFinanceCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = useCallback(
    async (data: {
      name: string;
      kind: CategoryKind;
      icon: string;
      sortOrder?: number;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.post("/personal/categories", data);
        return response.data.data || response.data;
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Failed to create category";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { createCategory, loading, error, setError };
}

export function useUpdateFinanceCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCategory = useCallback(
    async (
      id: string,
      data: { name?: string; kind?: CategoryKind; icon?: string },
    ) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.patch(
          `/personal/categories/${id}`,
          data,
        );
        return response.data.data || response.data;
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Failed to update category";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateCategory, loading, error, setError };
}

export function useDeleteFinanceCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCategory = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.delete(`/personal/categories/${id}`);
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to delete category";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteCategory, loading, error, setError };
}
