import { axiosClient } from "@/lib/api/axiosClient";

const base = "/business/work-management";
export type WorkKind = "projects" | "tasks" | "timesheets";
export const workManagementApi = {
  metadata: async () => (await axiosClient.get(`${base}/metadata`)).data.data,
  list: async (kind: WorkKind) => (await axiosClient.get(`${base}/${kind}`)).data.data,
  projectDetail: async (id: string, page = 1) => (await axiosClient.get(`${base}/projects/${id}/detail`, { params: { page, limit: 10 } })).data.data,
  taskDetail: async (id: string, page = 1) => (await axiosClient.get(`${base}/tasks/${id}/detail`, { params: { page, limit: 10 } })).data.data,
  timesheetDetail: async (id: string) => (await axiosClient.get(`${base}/timesheets/${id}/detail`)).data.data,
  create: async (kind: WorkKind, data: Record<string, unknown>) => (await axiosClient.post(`${base}/${kind}`, data)).data.data,
  update: async (kind: "projects" | "tasks", id: string, data: Record<string, unknown>) => (await axiosClient.patch(`${base}/${kind}/${id}`, data)).data.data,
  remove: async (kind: WorkKind, id: string) => axiosClient.delete(`${base}/${kind}/${id}`),
};
