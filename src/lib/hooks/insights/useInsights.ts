import { useState, useCallback } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { useAppToast } from "@/components/common/toast/useToast";
import { useTranslation } from "react-i18next";

export interface Insight {
  id: string;
  type: "PATTERN" | "ACHIEVEMENT" | "WARNING";
  typeIcon: string;
  title: string;
  description: string;
  metric: string;
  actionable: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
  priorityColor: string;
  timestamp: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  impact: "POSITIVE" | "NEUTRAL" | "NEGATIVE";
  impactIcon: string;
  estimatedResult: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  difficultyColor: string;
}

export interface Anomaly {
  id: string;
  type: string;
  severity: "LOW" | "MEDIUM" | "HIGH";
  budgetId: string;
  categoryId: string;
  message: string;
  details: string;
  suggestedAction: string;
  timestamp: string;
}

export interface Gamification {
  totalPoints: number;
  pointsFormatted: string;
  level: number;
  nextLevelPoints: number;
  pointsToNextLevel: number;
  levelProgressPercentage: number;
  currentStreak: number;
  streakMessage: string;
  achievements: Achievement[];
  badges: Badge[];
}

export interface Achievement {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

export interface Badge {
  id: string;
  type: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt?: string;
  isUnlocked: boolean;
}

// API Response wrapper
interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const INSIGHTS_BASE = "/personal/analytics/insights";
const SUGGESTIONS_BASE = "/personal/analytics/suggestions";
const ANOMALIES_BASE = "/personal/analytics/anomalies";
const GAMIFICATION_BASE = "/personal/analytics/gamification";
const DASHBOARD_BASE = "/personal/analytics/dashboard";

export function useInsights() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useAppToast();
  const { t } = useTranslation("common");

  // Get all insights
  const getInsights = useCallback(async (): Promise<Insight[]> => {
    try {
      setLoading(true);
      setError(null);
      const response =
        await axiosClient.get<ApiResponse<Insight[]>>(INSIGHTS_BASE);
      return response.data?.data || [];
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        t("insights.fetch_failed") ||
        "Failed to fetch insights";
      setError(errorMsg);
      showError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [t, showError]);

  // Get all suggestions
  const getSuggestions = useCallback(async (): Promise<Suggestion[]> => {
    try {
      setLoading(true);
      setError(null);
      const response =
        await axiosClient.get<ApiResponse<Suggestion[]>>(SUGGESTIONS_BASE);
      return response.data?.data || [];
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        t("suggestions.fetch_failed") ||
        "Failed to fetch suggestions";
      setError(errorMsg);
      showError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [t, showError]);

  // Get anomalies
  const getAnomalies = useCallback(async (): Promise<Anomaly[]> => {
    try {
      setLoading(true);
      setError(null);
      const response =
        await axiosClient.get<ApiResponse<Anomaly[]>>(ANOMALIES_BASE);
      return response.data?.data || [];
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message ||
        t("anomalies.fetch_failed") ||
        "Failed to fetch anomalies";
      setError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [t, showError]);

  // Get gamification stats
  const getGamification =
    useCallback(async (): Promise<Gamification | null> => {
      try {
        setLoading(true);
        setError(null);
        const response =
          await axiosClient.get<ApiResponse<Gamification>>(GAMIFICATION_BASE);
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message ||
          t("gamification.fetch_failed") ||
          "Failed to fetch gamification data";
        setError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    }, [t, showError]);

  // Get all dashboard data (insights + suggestions + anomalies + gamification)
  const getDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [insights, suggestions, anomalies, gamification] =
        await Promise.all([
          getInsights(),
          getSuggestions(),
          getAnomalies(),
          getGamification(),
        ]);
      return { insights, suggestions, anomalies, gamification };
    } catch (err: any) {
      const errorMsg = "Failed to fetch dashboard data";
      setError(errorMsg);
      showError(errorMsg);
      return {
        insights: [],
        suggestions: [],
        anomalies: [],
        gamification: null,
      };
    } finally {
      setLoading(false);
    }
  }, [getInsights, getSuggestions, getAnomalies, getGamification, showError]);

  return {
    loading,
    error,
    getInsights,
    getSuggestions,
    getAnomalies,
    getGamification,
    getDashboardData,
  };
}
