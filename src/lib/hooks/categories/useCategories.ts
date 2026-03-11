import { useCallback, useState } from "react";
import { axiosClient } from "@/lib/api/axiosClient";

export interface Category {
  id: number;
  name: string;
  description: string;
  count: number;
}

export function useGetCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.get("/categories");
      const data = response.data.data || response.data;
      setCategories(Array.isArray(data) ? data : []);
      return data;
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? "Failed to fetch categories";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { categories, setCategories, loading, error, fetchCategories };
}

export function useCreateCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = useCallback(
    async (data: { name: string; description: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.post("/categories", data);
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

export function useUpdateCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCategory = useCallback(
    async (id: number, data: { name: string; description: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await axiosClient.put(`/categories/${id}`, data);
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

export function useDeleteCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCategory = useCallback(async (id: number) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axiosClient.delete(`/categories/${id}`);
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
