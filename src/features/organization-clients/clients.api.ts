import { axiosClient } from "@/lib/api/axiosClient";
import type {
  ApiResponse,
  Client,
  ClientInput,
  ClientListQuery,
  ClientMetadata,
  ClientSummary,
} from "./clients.types";

type ListApiResponse = ApiResponse<Client[]> & {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

const basePath = "/business/clients";

export const clientsApi = {
  async list(query: ClientListQuery) {
    const response = await axiosClient.get<ListApiResponse>(basePath, {
      params: query,
    });
    return { data: response.data.data, pagination: response.data.pagination };
  },

  async summary() {
    const response = await axiosClient.get<ApiResponse<ClientSummary>>(
      `${basePath}/summary`,
    );
    return response.data.data;
  },

  async metadata() {
    const response = await axiosClient.get<ApiResponse<ClientMetadata>>(
      `${basePath}/metadata`,
    );
    return response.data.data;
  },

  async create(input: ClientInput) {
    const response = await axiosClient.post<ApiResponse<Client>>(basePath, input);
    return response.data.data;
  },

  async update(id: string, input: ClientInput) {
    const response = await axiosClient.patch<ApiResponse<Client>>(
      `${basePath}/${id}`,
      input,
    );
    return response.data.data;
  },

  async remove(id: string) {
    await axiosClient.delete(`${basePath}/${id}`);
  },
};
