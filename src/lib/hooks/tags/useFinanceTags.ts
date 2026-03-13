import { useCallback, useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";

export type TagScope = "global" | "workspace";

export interface FinanceTag {
  id: string;
  workspaceId: string | null;
  name: string;
  color: string;
  scope: TagScope;
  createdAt: string;
}

export interface TagsResponse {
  global: FinanceTag[];
  workspace: FinanceTag[];
}

export function useGetFinanceTags() {
  const [global, setGlobal] = useState<FinanceTag[]>([]);
  const [workspace, setWorkspace] = useState<FinanceTag[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/personal/tags");
      const data = response.data.data || response.data;
      setGlobal(data.global || []);
      setWorkspace(data.workspace || []);
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to fetch tags";
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
    fetchTags,
  };
}

export function useCreateFinanceTag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTag = useCallback(
    async (data: { name: string; color: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.post("/personal/tags", data);
        return response.data.data || response.data;
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Failed to create tag";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { createTag, loading, error, setError };
}

export function useUpdateFinanceTag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateTag = useCallback(
    async (id: string, data: { name?: string; color?: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.patch(`/personal/tags/${id}`, data);
        return response.data.data || response.data;
      } catch (err: any) {
        const msg = err?.response?.data?.message ?? "Failed to update tag";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateTag, loading, error, setError };
}

export function useDeleteFinanceTag() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteTag = useCallback(async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.delete(`/personal/tags/${id}`);
      return response.data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to delete tag";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteTag, loading, error, setError };
}
