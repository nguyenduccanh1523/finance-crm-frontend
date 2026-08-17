import { axiosClient } from "@/lib/api/axiosClient";
import type {
  ApiResponse,
  OrganizationDashboardData,
  OrganizationOption,
} from "./dashboard.types";

export const organizationDashboardApi = {
  async getDashboard() {
    const response = await axiosClient.get<
      ApiResponse<OrganizationDashboardData>
    >("/business/dashboard");
    return response.data.data;
  },

  async getOrganizations() {
    const response =
      await axiosClient.get<ApiResponse<OrganizationOption[]>>(
        "/organizations",
      );
    return response.data.data;
  },

  async selectOrganization(organizationId: string) {
    const response = await axiosClient.post<ApiResponse<OrganizationOption>>(
      `/organizations/${organizationId}/select`,
    );
    return response.data.data;
  },
};
