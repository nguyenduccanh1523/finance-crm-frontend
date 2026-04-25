import { useState, useCallback } from "react";
import { axiosClient } from "@/lib/api/axiosClient";
import { useAppToast } from "@/components/common/toast/useToast";

export interface Provider {
  key: string;
  name: string;
  country_code: string;
  rate_type: string;
  pivot_currency: string;
  data_url: string;
  terms_url: string | null;
  start_date: string;
  end_date: string;
  publishes_missed: number;
  currencies: string[];
}

export interface Currency {
  iso_code: string;
  iso_numeric: string;
  name: string;
  symbol: string;
  start_date: string;
  end_date: string;
}

export interface ExchangeRateData {
  from: string;
  to: string;
  rate: number;
  date: string;
  providers: string;
  source: string;
  cached: boolean;
}

export interface ConversionResult {
  amount: number;
  from: string;
  to: string;
  rate: number;
  convertedAmount: number;
  date: string;
  providers: string;
  source: string;
  cached: boolean;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

const API_BASE = "/personal-finance/exchange-rate";

export function useExchangeRate() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showError } = useAppToast();

  const getProviders = useCallback(async (): Promise<Provider[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get<ApiResponse<Provider[]>>(
        `${API_BASE}/providers`,
      );
      return response.data?.data || [];
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch providers";
      setError(errorMsg);
      showError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const getCurrencies = useCallback(async (): Promise<Currency[]> => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get<ApiResponse<Currency[]>>(
        `${API_BASE}/currencies`,
      );
      return response.data?.data || [];
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.message || "Failed to fetch currencies";
      setError(errorMsg);
      showError(errorMsg);
      return [];
    } finally {
      setLoading(false);
    }
  }, [showError]);

  const getExchangeRate = useCallback(
    async (
      from: string,
      to: string,
      date?: string,
      providers?: string,
    ): Promise<ExchangeRateData | null> => {
      try {
        setLoading(true);
        setError(null);
        const params = new URLSearchParams();
        params.append("from", from);
        params.append("to", to);
        if (date) params.append("date", date);
        if (providers) params.append("providers", providers);

        const response = await axiosClient.get<ApiResponse<ExchangeRateData>>(
          `${API_BASE}/pair?${params.toString()}`,
        );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || "Failed to fetch exchange rate";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showError],
  );

  const convertCurrency = useCallback(
    async (
      amount: number,
      from: string,
      to: string,
    ): Promise<ConversionResult | null> => {
      try {
        setLoading(true);
        setError(null);
        const response = await axiosClient.post<ApiResponse<ConversionResult>>(
          `${API_BASE}/convert?from=${from}&to=${to}`,
          { amount, from, to },
        );
        return response.data?.data || null;
      } catch (err: any) {
        const errorMsg =
          err.response?.data?.message || "Failed to convert currency";
        setError(errorMsg);
        showError(errorMsg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [showError],
  );

  return {
    loading,
    error,
    getProviders,
    getCurrencies,
    getExchangeRate,
    convertCurrency,
  };
}
