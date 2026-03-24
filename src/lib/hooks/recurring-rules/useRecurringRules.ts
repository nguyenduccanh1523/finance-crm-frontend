import { useState, useCallback } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { useAppToast } from "@/components/common/toast/useToast";
import { useTranslation } from "react-i18next";

export interface RecurringRule {
  id: string;
  accountId: string;
  type: "INCOME" | "EXPENSE";
  amountCents: number;
  currency: string;
  rrule: string;
  nextRunAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRecurringRulePayload {
  accountId: string;
  type: "INCOME" | "EXPENSE";
  amountCents: number;
  currency: string;
  rrule: string;
  nextRunAt: string;
}

export interface UpdateRecurringRulePayload {
  amountCents?: number;
  rrule?: string;
  nextRunAt?: string;
}

// API Response wrapper
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const API_BASE = "/personal/recurring-rules";

export function useRecurringRules() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError, showSuccess } = useAppToast();
  const { t } = useTranslation("common");

  // Create recurring rule
  const createRecurringRule = useCallback(
    async (
      payload: CreateRecurringRulePayload,
    ): Promise<RecurringRule | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.post<ApiResponse<RecurringRule>>(
          API_BASE,
          payload,
        );
        showSuccess(
          t("recurring_rule.created_success") ||
            "Recurring rule created successfully",
        );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("recurring_rule.create_failed") ||
          "Failed to create recurring rule";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  // Get all recurring rules
  const getRecurringRules = useCallback(async (): Promise<RecurringRule[]> => {
    try {
      setLoading(true);
      setError(null);
      const response =
        await axiosClient.get<ApiResponse<RecurringRule[]>>(API_BASE);
      return Array.isArray(response.data?.data) ? response.data.data : [];
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        t("recurring_rule.fetch_failed") ||
        "Failed to fetch recurring rules";
      setError(errorMsg);
      showError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [t, showError]);

  // Update recurring rule
  const updateRecurringRule = useCallback(
    async (
      ruleId: string,
      payload: UpdateRecurringRulePayload,
    ): Promise<RecurringRule | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.patch<ApiResponse<RecurringRule>>(
          `${API_BASE}/${ruleId}`,
          payload,
        );
        showSuccess(
          t("recurring_rule.updated_success") ||
            "Recurring rule updated successfully",
        );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("recurring_rule.update_failed") ||
          "Failed to update recurring rule";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  // Delete recurring rule
  const deleteRecurringRule = useCallback(
    async (ruleId: string): Promise<boolean> => {
      try {
        setLoading(true);
        setError(null);
        await axiosClient.delete(`${API_BASE}/${ruleId}`);
        showSuccess(
          t("recurring_rule.deleted_success") ||
            "Recurring rule deleted successfully",
        );
        return true;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("recurring_rule.delete_failed") ||
          "Failed to delete recurring rule";
        setError(errorMsg);
        showError(errorMsg);
        return false;
      } finally {
        setLoading(false);
      }
    },
    [t, showSuccess, showError],
  );

  return {
    loading,
    error,
    createRecurringRule,
    getRecurringRules,
    updateRecurringRule,
    deleteRecurringRule,
  };
}
