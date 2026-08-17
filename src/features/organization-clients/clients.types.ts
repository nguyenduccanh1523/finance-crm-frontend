export type ClientType = "COMPANY" | "PERSON";

export type ClientStage =
  | "LEAD"
  | "QUALIFIED"
  | "PROPOSAL"
  | "NEGOTIATION"
  | "WON"
  | "LOST";

export const clientStageTranslationKeys: Record<ClientStage, string> = {
  LEAD: "organization.clients.stages.LEAD",
  QUALIFIED: "organization.clients.stages.QUALIFIED",
  PROPOSAL: "organization.clients.stages.PROPOSAL",
  NEGOTIATION: "organization.clients.stages.NEGOTIATION",
  WON: "organization.clients.stages.WON",
  LOST: "organization.clients.stages.LOST",
};

export interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  industry: string | null;
  website: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  stage: ClientStage;
  estimatedValueCents: string;
  ownerMembershipId: string;
  ownerName: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface ClientOwner {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface ClientMetadata {
  stages: ClientStage[];
  types: ClientType[];
  owners: ClientOwner[];
}

export interface ClientSummary {
  totalClients: number;
  newLeads: number;
  followUp: number;
  wonClients: number;
  totalEstimatedValueCents: string;
}

export interface ClientListQuery {
  page: number;
  limit: number;
  q?: string;
  stage?: ClientStage;
  type?: ClientType;
  ownerMembershipId?: string;
  sortBy?: "name" | "stage" | "createdAt" | "updatedAt";
  order?: "ASC" | "DESC";
}

export interface ClientListResponse {
  data: Client[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ClientInput {
  name: string;
  type: ClientType;
  stage: ClientStage;
  industry?: string | null;
  website?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  ownerMembershipId?: string;
  estimatedValueCents?: string;
}
