import { useState, useCallback } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { useAppToast } from "@/components/common/toast/useToast";

export interface GoalTransaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  workspaceId: string;
  accountId: string;
  account: {
    id: string;
    name: string;
    type: string;
    currency: string;
  };
  type: "GOAL_ALLOCATION" | "GOAL_WITHDRAWAL";
  amountCents: number;
  currency: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T[];
}

const API_BASE = "/personal/transactions/linked-to-goal";

export function useGoalTransactions() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useAppToast();

  const getGoalTransactions = useCallback(
    async (goalId: string): Promise<GoalTransaction[]> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get<ApiResponse<GoalTransaction>>(
          `${API_BASE}/${goalId}`,
        );
        // Data is wrapped in response.data.data, not response.data.transactions
        return response.data?.data || [];
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || "Failed to fetch goal transactions";
        setError(errorMsg);
        showError(errorMsg);
        return [];
      } finally {
        setLoading(false);
      }
    },
    [showError],
  );

  return {
    loading,
    error,
    getGoalTransactions,
  };
}
