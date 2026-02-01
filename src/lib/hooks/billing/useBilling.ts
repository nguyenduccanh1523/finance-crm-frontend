import { useState, useCallback } from "react";
import { axiosClient } from "@/lib/api/axiosClient";

export type PaymentScope = "PERSONAL" | "ORG";

type ApiResponse<T> = {
  statusCode: number;
  message: string;
  data: T;
};

export interface SubscriptionData {
  planCode: "starter" | "pro" | "enterprise";
  interval: "MONTH" | "YEAR";
  scope: PaymentScope;
  orgId?: string;
}

export interface SetupIntentResponse {
  clientSecret: string;
  publishableKey?: string;
}

export interface SubscriptionResponse {
  subscriptionId: string;
  paymentClientSecret?: string;
  status: "active" | "pending" | "failed";
  message?: string;
}

export interface SubscriptionInfoResponse {
  planCode: string;
  interval: string;
  status: string;
  features: {
    flags: Record<string, boolean>;
  };
}

export function useBilling() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Bước 1: Lấy setup-intent từ server (chỉ gửi scope/orgId)
   */
  const getSetupIntent = useCallback(
    async (
      subscriptionData: SubscriptionData,
    ): Promise<SetupIntentResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        // Chỉ gửi scope và orgId
        const payload: any = {
          scope: subscriptionData.scope,
        };

        if (subscriptionData.scope === "ORG" && subscriptionData.orgId) {
          payload.orgId = subscriptionData.orgId;
        }

        const response = await axiosClient.post<
          ApiResponse<SetupIntentResponse>
        >("/billing/stripe/setup-intent", payload);

        return response.data.data;
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to get setup intent";
        setError(errMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Bước 2: Tạo subscription với paymentMethodId
   * Gửi: planCode, interval, scope, orgId (nếu ORG), paymentMethodId
   */
  const createSubscription = useCallback(
    async (
      subscriptionData: SubscriptionData,
      paymentMethodId: string,
    ): Promise<SubscriptionResponse | null> => {
      try {
        setLoading(true);
        setError(null);

        const payload: any = {
          planCode: subscriptionData.planCode,
          interval: subscriptionData.interval,
          scope: subscriptionData.scope,
          paymentMethodId,
        };

        // Thêm orgId nếu scope là ORG
        if (subscriptionData.scope === "ORG" && subscriptionData.orgId) {
          payload.orgId = subscriptionData.orgId;
        }

        const response = await axiosClient.post<SubscriptionResponse>(
          "/billing/subscriptions",
          payload,
        );
        
        return response.data;
      } catch (err: any) {
        const errMsg =
          err.response?.data?.message ||
          err.message ||
          "Failed to create subscription";
        setError(errMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /**
   * Bước 3: Poll subscription info (sau thanh toán)
   */
  const getSubscriptionInfo = useCallback(
    async (
      planCode?: string,
      interval?: string,
      scope?: string,
    ): Promise<SubscriptionInfoResponse | null> => {
      try {
        const params = new URLSearchParams();
        if (planCode) params.append("planCode", planCode);
        if (interval) params.append("interval", interval);
        if (scope) params.append("scope", scope);

        const response = await axiosClient.get<SubscriptionInfoResponse>(
          `/billing/me/subscription?${params.toString()}`,
        );

        return response.data;
      } catch (err: any) {
        // Silent fail for polling
        return null;
      }
    },
    [],
  );

  /**
   * Poll subscription tối đa 3 lần
   */
  const pollSubscriptionInfo = useCallback(
    async (subscriptionData: SubscriptionData, maxAttempts = 3) => {
      for (let i = 0; i < maxAttempts; i++) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Chờ 1s

        const info = await getSubscriptionInfo(
          subscriptionData.planCode,
          subscriptionData.interval,
          subscriptionData.scope,
        );

        if (info?.status === "active") {
          return info;
        }
      }

      return null;
    },
    [getSubscriptionInfo],
  );

  return {
    loading,
    error,
    getSetupIntent,
    createSubscription,
    getSubscriptionInfo,
    pollSubscriptionInfo,
  };
}
