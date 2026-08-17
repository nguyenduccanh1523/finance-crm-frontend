import { useCallback, useEffect, useMemo, useState } from "react";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { clientsApi } from "./clients.api";
import type {
  Client,
  ClientInput,
  ClientListQuery,
  ClientMetadata,
  ClientSummary,
  ClientType,
  ClientStage,
} from "./clients.types";

const emptySummary: ClientSummary = {
  totalClients: 0,
  newLeads: 0,
  followUp: 0,
  wonClients: 0,
  totalEstimatedValueCents: "0",
};

const emptyMetadata: ClientMetadata = { stages: [], types: [], owners: [] };

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof AxiosError) {
    const message = error.response?.data?.message;
    return Array.isArray(message) ? message.join(", ") : message || fallback;
  }
  return fallback;
}

export function useClients() {
  const { t } = useTranslation("common");
  const [clients, setClients] = useState<Client[]>([]);
  const [summary, setSummary] = useState<ClientSummary>(emptySummary);
  const [metadata, setMetadata] = useState<ClientMetadata>(emptyMetadata);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>();
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState<ClientStage>();
  const [type, setType] = useState<ClientType>();
  const [ownerMembershipId, setOwnerMembershipId] = useState<string>();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 350);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const query = useMemo<ClientListQuery>(
    () => ({
      page,
      limit: pagination.limit,
      ...(search ? { q: search } : {}),
      ...(stage ? { stage } : {}),
      ...(type ? { type } : {}),
      ...(ownerMembershipId ? { ownerMembershipId } : {}),
      sortBy: "updatedAt",
      order: "DESC",
    }),
    [ownerMembershipId, page, pagination.limit, search, stage, type],
  );

  const loadList = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const [listResult, summaryResult] = await Promise.all([
        clientsApi.list(query),
        clientsApi.summary(),
      ]);
      setClients(listResult.data);
      setPagination(listResult.pagination);
      setSummary(summaryResult);
    } catch (requestError) {
      setError(getErrorMessage(requestError, t("organization.clients.loadListError")));
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadMetadata = useCallback(async () => {
    try {
      setMetadata(await clientsApi.metadata());
    } catch (requestError) {
      setError(getErrorMessage(requestError, t("organization.clients.loadMetadataError")));
    }
  }, []);

  useEffect(() => {
    void loadList();
  }, [loadList]);

  useEffect(() => {
    void loadMetadata();
    const handleContextChanged = () => {
      setPage(1);
      void loadMetadata();
    };
    window.addEventListener("organization-context-changed", handleContextChanged);
    return () =>
      window.removeEventListener(
        "organization-context-changed",
        handleContextChanged,
      );
  }, [loadMetadata]);

  const resetFilters = () => {
    setSearchInput("");
    setSearch("");
    setStage(undefined);
    setType(undefined);
    setOwnerMembershipId(undefined);
    setPage(1);
  };

  const saveClient = async (input: ClientInput, client?: Client) => {
    setSubmitting(true);
    try {
      if (client) {
        await clientsApi.update(client.id, input);
        toast.success(t("organization.clients.updated"));
      } else {
        await clientsApi.create(input);
        toast.success(t("organization.clients.created"));
      }
      await loadList();
      return true;
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, t("organization.clients.saveError")));
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteClient = async (client: Client) => {
    setSubmitting(true);
    try {
      await clientsApi.remove(client.id);
      toast.success(t("organization.clients.deleted", { name: client.name }));
      if (clients.length === 1 && page > 1) setPage((current) => current - 1);
      else await loadList();
    } catch (requestError) {
      toast.error(getErrorMessage(requestError, t("organization.clients.deleteError")));
    } finally {
      setSubmitting(false);
    }
  };

  return {
    clients,
    summary,
    metadata,
    loading,
    submitting,
    error,
    page,
    pagination,
    searchInput,
    stage,
    type,
    ownerMembershipId,
    setPage,
    setSearchInput,
    setStage,
    setType,
    setOwnerMembershipId,
    resetFilters,
    reload: loadList,
    saveClient,
    deleteClient,
  };
}
