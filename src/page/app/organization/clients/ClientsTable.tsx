import { Edit3, Mail, MoreHorizontal, Phone, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type Client,
  type ClientStage,
  clientStageTranslationKeys,
} from "@/features/organization-clients/clients.types";

const stageClass: Record<ClientStage, string> = {
  LEAD: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  QUALIFIED: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  PROPOSAL: "bg-violet-500/10 text-violet-700 dark:text-violet-300",
  NEGOTIATION: "bg-amber-500/10 text-amber-700 dark:text-amber-300",
  WON: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  LOST: "bg-rose-500/10 text-rose-700 dark:text-rose-300",
};

interface ClientsTableProps {
  clients: Client[];
  loading: boolean;
  submitting: boolean;
  onEdit: (client: Client) => void;
  onDelete: (client: Client) => void;
}

export function ClientsTable({
  clients,
  loading,
  submitting,
  onEdit,
  onDelete,
}: ClientsTableProps) {
  const { t } = useTranslation("common");

  if (loading) {
    return (
      <div className="space-y-3 p-4">
        {Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className="h-14 w-full" />)}
      </div>
    );
  }

  if (!clients.length) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 dark:bg-slate-800">
          <MoreHorizontal className="h-5 w-5 text-slate-500" />
        </div>
        <h3 className="mt-4 font-semibold">{t("organization.clients.noClients")}</h3>
        <p className="mt-1 text-sm text-slate-500">{t("organization.clients.noClientsDescription")}</p>
      </div>
    );
  }

  return (
    <>
    <div className="hidden overflow-x-auto md:block">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="border-y border-slate-200 bg-slate-50/70 text-xs font-medium text-slate-500 dark:border-slate-800 dark:bg-slate-950/60">
          <tr>
            <th className="px-5 py-3">{t("organization.clients.client")}</th>
            <th className="px-5 py-3">{t("organization.clients.contact")}</th>
            <th className="px-5 py-3">{t("organization.clients.owner")}</th>
            <th className="px-5 py-3">{t("organization.clients.stage")}</th>
            <th className="px-5 py-3 text-right">{t("organization.clients.actions")}</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-b border-slate-100 transition-colors hover:bg-slate-50/70 dark:border-slate-800 dark:hover:bg-slate-800/40">
              <td className="px-5 py-4">
                <p className="font-semibold text-slate-900 dark:text-white">{client.name}</p>
                <p className="mt-1 text-xs text-slate-500">{client.industry || client.type}</p>
              </td>
              <td className="px-5 py-4">
                {client.email && <p className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300"><Mail className="h-3.5 w-3.5" />{client.email}</p>}
                {client.phone && <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500"><Phone className="h-3.5 w-3.5" />{client.phone}</p>}
                {!client.email && !client.phone && <span className="text-slate-400">—</span>}
              </td>
              <td className="px-5 py-4">
                <p className="font-medium">{client.ownerName}</p>
                <p className="mt-1 text-xs text-slate-500">{client.ownerEmail}</p>
              </td>
              <td className="px-5 py-4">
                <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${stageClass[client.stage]}`}>
                  {t(clientStageTranslationKeys[client.stage])}
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <Button variant="ghost" size="icon" onClick={() => onEdit(client)} aria-label={t("organization.clients.edit", { name: client.name })}>
                  <Edit3 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" disabled={submitting} onClick={() => onDelete(client)} aria-label={t("organization.clients.delete", { name: client.name })} className="text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/40">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <div className="divide-y divide-slate-100 md:hidden dark:divide-slate-800">
      {clients.map((client) => (
        <article key={client.id} className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate font-semibold text-slate-900 dark:text-white">{client.name}</p>
              <p className="mt-1 text-xs text-slate-500">{client.industry || client.type}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${stageClass[client.stage]}`}>{t(clientStageTranslationKeys[client.stage])}</span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div><p className="text-slate-500">{t("organization.clients.contact")}</p><p className="mt-1 truncate font-medium">{client.email || client.phone || "—"}</p></div>
            <div><p className="text-slate-500">{t("organization.clients.owner")}</p><p className="mt-1 truncate font-medium">{client.ownerName}</p></div>
          </div>
          <div className="flex justify-end gap-1">
            <Button variant="outline" size="sm" onClick={() => onEdit(client)}>{t("organization.clients.edit", { name: "" }).trim()}</Button>
            <Button variant="ghost" size="sm" disabled={submitting} onClick={() => onDelete(client)} className="text-rose-600">{t("organization.clients.delete", { name: "" }).trim()}</Button>
          </div>
        </article>
      ))}
    </div>
    </>
  );
}
