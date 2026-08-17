import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Filter,
  Plus,
  RefreshCw,
  Search,
  UsersRound,
  UserRoundCheck,
  Trophy,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useClients } from "@/features/organization-clients/useClients";
import { clientStageTranslationKeys } from "@/features/organization-clients/clients.types";
import type {
  Client,
  ClientStage,
  ClientType,
} from "@/features/organization-clients/clients.types";
import { ClientFormDialog } from "./ClientFormDialog";
import { ClientsTable } from "./ClientsTable";

function SummaryCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  icon: typeof UsersRound;
}) {
  return (
    <Card className="rounded-2xl border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-950 dark:text-white">{value}</p>
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  );
}

export function ClientsPage() {
  const { t } = useTranslation("common");
  const [filterOpen, setFilterOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client>();
  const {
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
    reload,
    saveClient,
    deleteClient,
  } = useClients();

  const openCreate = () => {
    setEditingClient(undefined);
    setFormOpen(true);
  };

  const openEdit = (client: Client) => {
    setEditingClient(client);
    setFormOpen(true);
  };

  const confirmDelete = (client: Client) => {
    if (window.confirm(t("organization.clients.deleteConfirm", { name: client.name }))) {
      void deleteClient(client);
    }
  };

  return (
    <div className="space-y-5 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
        <div className="flex items-start gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
            <UsersRound className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 dark:text-white">{t("organization.clients.title")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("organization.clients.description")}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-[280px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder={t("organization.clients.searchPlaceholder")} className="h-10 rounded-xl bg-white pl-9 dark:bg-slate-900" />
          </div>
          <Button variant="outline" className="h-10 rounded-xl" onClick={() => setFilterOpen((current) => !current)}>
            <Filter className="mr-2 h-4 w-4" />{t("organization.clients.filter")}
          </Button>
          <Button className="h-10 rounded-xl shadow-lg shadow-primary/20" onClick={openCreate}>
            <Plus className="mr-2 h-4 w-4" />{t("organization.clients.add")}
          </Button>
        </div>
      </div>

      {filterOpen && (
        <Card className="grid gap-3 rounded-2xl border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_1fr_1.3fr_auto] dark:border-slate-800 dark:bg-slate-900/80">
          <select value={stage || ""} onChange={(event) => { setPage(1); setStage((event.target.value || undefined) as ClientStage | undefined); }} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="">{t("organization.clients.allStages")}</option>
            {metadata.stages.map((item) => <option key={item} value={item}>{t(clientStageTranslationKeys[item])}</option>)}
          </select>
          <select value={type || ""} onChange={(event) => { setPage(1); setType((event.target.value || undefined) as ClientType | undefined); }} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="">{t("organization.clients.allTypes")}</option>
            <option value="COMPANY">COMPANY</option>
            <option value="PERSON">PERSON</option>
          </select>
          <select value={ownerMembershipId || ""} onChange={(event) => { setPage(1); setOwnerMembershipId(event.target.value || undefined); }} className="h-10 rounded-xl border border-input bg-background px-3 text-sm">
            <option value="">{t("organization.clients.allOwners")}</option>
            {metadata.owners.map((owner) => <option key={owner.id} value={owner.id}>{owner.name}</option>)}
          </select>
          <Button variant="ghost" onClick={resetFilters} className="h-10 rounded-xl">{t("organization.clients.clearFilters")}</Button>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryCard label={t("organization.clients.total")} value={summary.totalClients} icon={UsersRound} />
        <SummaryCard label={t("organization.clients.newLeads")} value={summary.newLeads} icon={UserRoundCheck} />
        <SummaryCard label={t("organization.clients.followUp")} value={summary.followUp} icon={Workflow} />
        <SummaryCard label={t("organization.clients.won")} value={summary.wonClients} icon={Trophy} />
      </div>

      <Card className="overflow-hidden rounded-2xl border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4 dark:border-slate-800">
          <div>
            <h3 className="font-semibold">{t("organization.clients.list")}</h3>
            <p className="mt-1 text-xs text-slate-500">{t("organization.clients.results", { count: pagination.total })}</p>
          </div>
          <Button variant="ghost" size="sm" className="rounded-xl" onClick={() => void reload()} disabled={loading}>
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />{t("organization.clients.refresh")}
          </Button>
        </div>

        {error ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
            <p className="font-semibold">{t("organization.clients.loadErrorTitle")}</p>
            <p className="mt-1 max-w-md text-sm text-slate-500">{error}</p>
            <Button className="mt-4 rounded-xl" onClick={() => void reload()}><RefreshCw className="mr-2 h-4 w-4" />{t("organization.clients.retry")}</Button>
          </div>
        ) : (
          <ClientsTable clients={clients} loading={loading} submitting={submitting} onEdit={openEdit} onDelete={confirmDelete} />
        )}

        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-3 dark:border-slate-800">
            <p className="text-sm text-slate-500">{t("organization.clients.page", { page, totalPages: pagination.totalPages })}</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1 || loading} onClick={() => setPage(page - 1)}>{t("organization.clients.previous")}</Button>
              <Button variant="outline" size="sm" disabled={page >= pagination.totalPages || loading} onClick={() => setPage(page + 1)}>{t("organization.clients.next")}</Button>
            </div>
          </div>
        )}
      </Card>

      <ClientFormDialog open={formOpen} client={editingClient} metadata={metadata} submitting={submitting} onOpenChange={setFormOpen} onSave={saveClient} />
    </div>
  );
}
