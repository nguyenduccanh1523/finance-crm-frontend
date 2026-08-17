import { useCallback, useEffect, useState } from "react";
import { AxiosError } from "axios";
import { organizationDashboardApi } from "./dashboard.api";
import type {
  OrganizationDashboardData,
  OrganizationOption,
} from "./dashboard.types";

interface DashboardErrorBody {
  message?: string | { message?: string; code?: string };
  code?: string;
}

function getDashboardError(error: unknown) {
  const axiosError = error as AxiosError<DashboardErrorBody>;
  const body = axiosError.response?.data;
  const nestedMessage =
    typeof body?.message === "object" ? body.message.message : undefined;
  const nestedCode =
    typeof body?.message === "object" ? body.message.code : undefined;

  return {
    code: body?.code || nestedCode,
    message:
      nestedMessage ||
      (typeof body?.message === "string" ? body.message : undefined) ||
      "Không thể tải dữ liệu dashboard. Vui lòng thử lại.",
  };
}

export function useOrganizationDashboard() {
  const [dashboard, setDashboard] = useState<OrganizationDashboardData | null>(
    null,
  );
  const [organizations, setOrganizations] = useState<OrganizationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectingOrganization, setSelectingOrganization] = useState(false);
  const [error, setError] = useState<{ code?: string; message: string } | null>(
    null,
  );

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      setDashboard(await organizationDashboardApi.getDashboard());
    } catch (requestError) {
      const dashboardError = getDashboardError(requestError);
      setError(dashboardError);

      if (dashboardError.code === "ORG_CONTEXT_REQUIRED") {
        try {
          setOrganizations(await organizationDashboardApi.getOrganizations());
        } catch {
          setOrganizations([]);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const selectOrganization = useCallback(
    async (organizationId: string) => {
      setSelectingOrganization(true);
      try {
        await organizationDashboardApi.selectOrganization(organizationId);
        window.dispatchEvent(new Event("organization-context-changed"));
        await loadDashboard();
      } finally {
        setSelectingOrganization(false);
      }
    },
    [loadDashboard],
  );

  useEffect(() => {
    void loadDashboard();
  }, [loadDashboard]);

  return {
    dashboard,
    organizations,
    loading,
    selectingOrganization,
    error,
    reload: loadDashboard,
    selectOrganization,
  };
}
