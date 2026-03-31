import { useState, useCallback } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { useAppToast } from "@/components/common/toast/useToast";
import { useTranslation } from "react-i18next";

export interface Budget {
  id: string;
  workspaceId: string;
  accountId: string;
  periodMonth: string;
  categoryId: string;
  amountLimitCents: number;
  currency: string;
  alertThresholdPercent: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetAnalytic {
  budgetId: string;
  categoryId: string;
  categoryName: string;
  limitCents: number;
  limitFormatted: string;
  spentCents: number;
  spentFormatted: string;
  percentageUsed: number;
  remainingCents: number;
  remainingFormatted: string;
  status: "ON_TRACK" | "WARNING" | "EXCEEDED";
  statusColor: string;
  prediction: {
    predictedSpendFormatted: string;
    overagePercentage: number;
    isOverBudget: boolean;
    trendDirection: "UP" | "DOWN" | "STABLE";
    trendIcon: string;
    confidence: number;
    message: string;
  };
  daysLeftInMonth: number;
}

export interface BudgetAnalyticResponse {
  totalBudgetCents: number;
  totalSpentCents: number;
  totalRemainingCents: number;
  averageUtilization: string;
  budgetsOnTrack: number;
  budgetsWarning: number;
  budgetsExceeded: number;
  spendingTrend: "UP" | "DOWN" | "STABLE";
  trendPercentage: number;
  details: BudgetAnalytic[];
}

export interface CreateBudgetPayload {
  categoryId: string;
  periodMonth: string;
  amountLimitCents: number;
  accountId?: string;
  alertThresholdPercent?: number;
}

export interface UpdateBudgetPayload {
  amountLimitCents?: number;
  alertThresholdPercent?: number;
}

// API Response wrapper
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const API_BASE = "/personal/budgets";
const ANALYTICS_BASE = "/personal/analytics/budgets";

export function useBudgets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useAppToast();
  const { t } = useTranslation("common");

  // Get all budgets
  const getBudgets = useCallback(async (): Promise<Budget[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get<ApiResponse<Budget[]>>(API_BASE);
      return response.data?.data || [];
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        t("budget.fetch_failed") ||
        "Failed to fetch budgets";
      setError(errorMsg);
      showError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [t, showError]);

  // Get single budget
  const getBudget = useCallback(
    async (id: string): Promise<Budget | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get<ApiResponse<Budget>>(
          `${API_BASE}/${id}`,
        );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("budget.fetch_failed") ||
          "Failed to fetch budget";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, showError],
  );

  // Create budget
  const createBudget = useCallback(
    async (payload: CreateBudgetPayload): Promise<Budget | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.post<ApiResponse<Budget>>(
          API_BASE,
          payload,
        );
        showSuccess(
          t("budget.created_success") || "Budget created successfully",
        );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("budget.create_failed") ||
          "Failed to create budget";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  // Update budget
  const updateBudget = useCallback(
    async (
      id: string,
      payload: UpdateBudgetPayload,
    ): Promise<Budget | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.patch<ApiResponse<Budget>>(
          `${API_BASE}/${id}`,
          payload,
        );
        showSuccess(
          t("budget.updated_success") || "Budget updated successfully",
        );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("budget.update_failed") ||
          "Failed to update budget";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  // Delete budget
  const deleteBudget = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await axiosClient.delete(`${API_BASE}/${id}`);
        showSuccess(
          t("budget.deleted_success") || "Budget deleted successfully",
        );
        return true;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("budget.delete_failed") ||
          "Failed to delete budget";
        setError(errorMsg);
        showError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  // Get budgets analytics
  const getBudgetsAnalytics =
    useCallback(async (): Promise<BudgetAnalyticResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const response =
          await axiosClient.get<ApiResponse<BudgetAnalyticResponse>>(
            ANALYTICS_BASE,
          );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("budget.analytics_failed") ||
          "Failed to fetch budget analytics";
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    }, [t]);

  return {
    loading,
    error,
    getBudgets,
    getBudget,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetsAnalytics,
  };
}
