import { useEffect, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { clientStageTranslationKeys } from "@/features/organization-clients/clients.types";
import type {
  Client,
  ClientInput,
  ClientMetadata,
  ClientStage,
  ClientType,
} from "@/features/organization-clients/clients.types";

const fallbackStages: ClientStage[] = [
  "LEAD",
  "QUALIFIED",
  "PROPOSAL",
  "NEGOTIATION",
  "WON",
  "LOST",
];

type FormState = {
  name: string;
  type: ClientType;
  stage: ClientStage;
  industry: string;
  website: string;
  phone: string;
  email: string;
  address: string;
  ownerMembershipId: string;
  estimatedValueVnd: string;
};

const emptyForm: FormState = {
  name: "",
  type: "COMPANY",
  stage: "LEAD",
  industry: "",
  website: "",
  phone: "",
  email: "",
  address: "",
  ownerMembershipId: "",
  estimatedValueVnd: "",
};

function createForm(client?: Client): FormState {
  if (!client) return emptyForm;
  return {
    name: client.name,
    type: client.type,
    stage: client.stage,
    industry: client.industry || "",
    website: client.website || "",
    phone: client.phone || "",
    email: client.email || "",
    address: client.address || "",
    ownerMembershipId: client.ownerMembershipId,
    estimatedValueVnd: String(Number(client.estimatedValueCents || 0) / 100),
  };
}

function optional(value: string, isEditing: boolean) {
  const normalized = value.trim();
  return normalized || (isEditing ? null : undefined);
}

interface ClientFormDialogProps {
  open: boolean;
  client?: Client;
  metadata: ClientMetadata;
  submitting: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (input: ClientInput, client?: Client) => Promise<boolean>;
}

export function ClientFormDialog({
  open,
  client,
  metadata,
  submitting,
  onOpenChange,
  onSave,
}: ClientFormDialogProps) {
  const { t } = useTranslation("common");
  const [form, setForm] = useState<FormState>(() => createForm(client));
  const isEditing = Boolean(client);
  const stages = metadata.stages.length ? metadata.stages : fallbackStages;

  useEffect(() => {
    if (open) setForm(createForm(client));
  }, [client, open]);

  const update = <Key extends keyof FormState>(key: Key, value: FormState[Key]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const vnd = Number(form.estimatedValueVnd || 0);
    if (!Number.isFinite(vnd) || vnd < 0) return;
    const saved = await onSave(
      {
        name: form.name.trim(),
        type: form.type,
        stage: form.stage,
        industry: optional(form.industry, isEditing),
        website: optional(form.website, isEditing),
        phone: optional(form.phone, isEditing),
        email: optional(form.email, isEditing),
        address: optional(form.address, isEditing),
        ...(form.ownerMembershipId
          ? { ownerMembershipId: form.ownerMembershipId }
          : {}),
        estimatedValueCents: String(Math.round(vnd * 100)),
      },
      client,
    );
    if (saved) onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto rounded-2xl border-slate-200 bg-white p-0 dark:border-slate-800 dark:bg-slate-950">
        <form onSubmit={(event) => void submit(event)}>
          <DialogHeader className="border-b border-slate-200 px-6 py-5 dark:border-slate-800">
            <DialogTitle>{isEditing ? t("organization.clients.editTitle") : t("organization.clients.createTitle")}</DialogTitle>
            <DialogDescription>
              {t("organization.clients.formDescription")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-5 sm:grid-cols-2">
            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium">{t("organization.clients.name")} *</span>
              <Input
                required
                value={form.name}
                onChange={(event) => update("name", event.target.value)}
                placeholder="Acme"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">{t("organization.clients.type")} *</span>
              <select
                value={form.type}
                onChange={(event) => update("type", event.target.value as ClientType)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              >
                <option value="COMPANY">COMPANY</option>
                <option value="PERSON">PERSON</option>
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">{t("organization.clients.stage")} *</span>
              <select
                value={form.stage}
                onChange={(event) => update("stage", event.target.value as ClientStage)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              >
                {stages.map((stage) => (
                  <option key={stage} value={stage}>{t(clientStageTranslationKeys[stage])}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">{t("organization.clients.owner")}</span>
              <select
                value={form.ownerMembershipId}
                onChange={(event) => update("ownerMembershipId", event.target.value)}
                className="h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none ring-offset-background focus:ring-2 focus:ring-ring"
              >
                <option value="">{t("organization.clients.assignMe")}</option>
                {metadata.owners.map((owner) => (
                  <option key={owner.id} value={owner.id}>
                    {owner.name} · {owner.role.replace("ORG_", "")}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">{t("organization.clients.estimatedValue")}</span>
              <Input
                min="0"
                type="number"
                value={form.estimatedValueVnd}
                onChange={(event) => update("estimatedValueVnd", event.target.value)}
                placeholder="0"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">{t("organization.clients.email")}</span>
              <Input
                type="email"
                value={form.email}
                onChange={(event) => update("email", event.target.value)}
                placeholder="contact@company.com"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">{t("organization.clients.phone")}</span>
              <Input
                value={form.phone}
                onChange={(event) => update("phone", event.target.value)}
                placeholder="0900 000 000"
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">{t("organization.clients.industry")}</span>
              <Input
                value={form.industry}
                onChange={(event) => update("industry", event.target.value)}
                placeholder="Công nghệ, thương mại..."
              />
            </label>

            <label className="space-y-1.5">
              <span className="text-sm font-medium">{t("organization.clients.website")}</span>
              <Input
                value={form.website}
                onChange={(event) => update("website", event.target.value)}
                placeholder="https://example.com"
              />
            </label>

            <label className="space-y-1.5 sm:col-span-2">
              <span className="text-sm font-medium">{t("organization.clients.address")}</span>
              <Input
                value={form.address}
                onChange={(event) => update("address", event.target.value)}
                placeholder="Địa chỉ liên hệ"
              />
            </label>
          </div>

          <DialogFooter className="border-t border-slate-200 px-6 py-4 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("organization.clients.cancel")}
            </Button>
            <Button disabled={submitting} type="submit">
              {submitting && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? t("organization.clients.saveChanges") : t("organization.clients.create")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
