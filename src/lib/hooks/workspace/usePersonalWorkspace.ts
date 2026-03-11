import { useCallback, useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";

export interface PersonalWorkspace {
  id: string;
  name: string;
  description?: string;
  defaultCurrency: string;
  timezone?: string;
  members?: number;
  role?: string;
  status?: string;
  createdAt?: string;
}

export function useGetPersonalWorkspace() {
  const [workspace, setWorkspace] = useState<PersonalWorkspace | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWorkspace = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/personal/workspace/me");
      const data = response.data.data || response.data;
      setWorkspace(data);
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to fetch workspace";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { workspace, setWorkspace, loading, error, fetchWorkspace };
}

export function useUpdatePersonalWorkspace() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateWorkspace = useCallback(
    async (data: {
      name: string;
      defaultCurrency?: string;
      timezone?: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.patch(
          "/personal/workspace/me",
          data,
        );
        return response.data.data || response.data;
      } catch (err: any) {
        const msg =
          err?.response?.data?.message ?? "Failed to update workspace";
        setError(msg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { updateWorkspace, loading, error, setError };
}
