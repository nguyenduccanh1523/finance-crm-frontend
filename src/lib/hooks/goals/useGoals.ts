import { useState, useCallback } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { useAppToast } from "@/components/common/toast/useToast";
import { useTranslation } from "react-i18next";

export interface Goal {
  id: string;
  workspaceId: string;
  accountId: string;
  name: string;
  description?: string;
  targetAmountCents: number;
  currentAmountCents: number;
  targetDate: string;
  currency: string;
  status: "ACTIVE" | "COMPLETED" | "ABANDONED";
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface GoalAnalytic {
  goalId: string;
  name: string;
  targetAmountFormatted: string;
  currentAmountFormatted: string;
  amountNeededFormatted: string;
  percentageAchieved: number;
  status: "ON_TRACK" | "AHEAD" | "BEHIND";
  statusIcon: string;
  daysLeft: number;
  estimatedCompletionDate: string;
  isAheadSchedule: boolean;
  velocityPerDayFormatted: string;
  motivationalMessage: string;
}

export interface GoalAllocateResponse {
  goalId: string;
  previousBalance: number;
  newBalance: number;
  allocatedAmount: number;
  currency: string;
  accountId: string;
  transactionType: "GOAL_ALLOCATION";
  createdAt: string;
}

export interface GoalWithdrawResponse {
  goalId: string;
  previousBalance: number;
  newBalance: number;
  withdrawnAmount: number;
  currency: string;
  accountId: string;
  transactionType: "GOAL_WITHDRAWAL";
  createdAt: string;
}

export interface CreateGoalPayload {
  name: string;
  description?: string;
  targetAmountCents: number;
  targetDate: string; // "2026-12-08"
  accountId?: string;
  currentAmountCents?: number;
}

export interface UpdateGoalPayload {
  name?: string;
  description?: string;
  targetAmountCents?: number;
  targetDate?: string;
}

export interface GoalTransactionPayload {
  amountCents: number;
}

// API Response wrapper
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const API_BASE = "/personal/goals";
const ANALYTICS_BASE = "/personal/analytics/goals";

export function useGoals() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useAppToast();
  const { t } = useTranslation("common");

  // Get all goals
  const getGoals = useCallback(async (): Promise<Goal[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get<ApiResponse<Goal[]>>(API_BASE);
      return response.data?.data || [];
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        t("goal.fetch_failed") ||
        "Failed to fetch goals";
      setError(errorMsg);
      showError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [t, showError]);

  // Get single goal
  const getGoal = useCallback(
    async (id: string): Promise<Goal | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.get<ApiResponse<Goal>>(
          `${API_BASE}/${id}`,
        );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("goal.fetch_failed") ||
          "Failed to fetch goal";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, showError],
  );

  // Create goal
  const createGoal = useCallback(
    async (payload: CreateGoalPayload): Promise<Goal | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.post<ApiResponse<Goal>>(
          API_BASE,
          payload,
        );
        showSuccess(t("goal.created_success") || "Goal created successfully");
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("goal.create_failed") ||
          "Failed to create goal";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  // Update goal
  const updateGoal = useCallback(
    async (id: string, payload: UpdateGoalPayload): Promise<Goal | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.patch<ApiResponse<Goal>>(
          `${API_BASE}/${id}`,
          payload,
        );
        showSuccess(t("goal.updated_success") || "Goal updated successfully");
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("goal.update_failed") ||
          "Failed to update goal";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  // Delete goal
  const deleteGoal = useCallback(
    async (id: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await axiosClient.delete(`${API_BASE}/${id}`);
        showSuccess(t("goal.deleted_success") || "Goal deleted successfully");
        return true;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("goal.delete_failed") ||
          "Failed to delete goal";
        setError(errorMsg);
        showError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  // Allocate to goal (từ account vào goal)
  const allocateToGoal = useCallback(
    async (
      id: string,
      payload: GoalTransactionPayload,
    ): Promise<GoalAllocateResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.post<
          ApiResponse<GoalAllocateResponse>
        >(`${API_BASE}/${id}/allocate`, payload);
        showSuccess(
          t("goal.allocated_success") || "Amount allocated successfully",
        );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("goal.allocate_failed") ||
          "Failed to allocate to goal";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  // Withdraw from goal (từ goal về account)
  const withdrawFromGoal = useCallback(
    async (
      id: string,
      payload: GoalTransactionPayload,
    ): Promise<GoalWithdrawResponse | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.post<
          ApiResponse<GoalWithdrawResponse>
        >(`${API_BASE}/${id}/withdraw`, payload);
        showSuccess(
          t("goal.withdrawn_success") || "Amount withdrawn successfully",
        );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("goal.withdraw_failed") ||
          "Failed to withdraw from goal";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  // Get goals analytics
  const getGoalsAnalytics = useCallback(async (): Promise<
    GoalAnalytic[] | null
  > => {
    try {
      setLoading(true);
      setError(null);
      const response =
        await axiosClient.get<ApiResponse<GoalAnalytic[]>>(ANALYTICS_BASE);
      return response.data?.data || null;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        t("goal.analytics_failed") ||
        "Failed to fetch goal analytics";
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  }, [t]);

  return {
    loading,
    error,
    getGoals,
    getGoal,
    createGoal,
    updateGoal,
    deleteGoal,
    allocateToGoal,
    withdrawFromGoal,
    getGoalsAnalytics,
  };
}
