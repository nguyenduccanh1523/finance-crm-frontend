import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateTransaction } from "@/lib/hooks/transactions/useTransactions";
import { useGetFinanceTags } from "@/lib/hooks/tags/useFinanceTags";
import { Badge } from "@/components/ui/badge";

interface CreateTransactionFormProps {
  accounts: Array<{ id: string; name: string; currency: string }>;
  categories: Array<{ id: string; name: string; icon?: string }>;
  onSuccess?: () => void;
  onClose?: () => void;
}

export function CreateTransactionForm({
  accounts,
  categories,
  onSuccess,
  onClose,
}: CreateTransactionFormProps) {
  const { createTransaction, loading, error } = useCreateTransaction();
  const { global, workspace } = useGetFinanceTags();

  const [formData, setFormData] = useState({
    accountId: "",
    type: "EXPENSE" as "EXPENSE" | "INCOME" | "TRANSFER",
    amountCents: "",
    occurredAt: new Date().toLocaleDateString("sv-SE"), // Get local date in YYYY-MM-DD format
    categoryId: "",
    note: "",
    counterparty: "",
    tagIds: [] as string[],
    transferAccountId: "",
    exchangeRate: "1",
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const allTags = [...global, ...workspace];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Get selected account to determine currency
      const selectedAccount = accounts.find(
        (acc) => acc.id === formData.accountId,
      );
      const currency = selectedAccount?.currency || "USD";

      // Parse amount based on currency
      const noDecimalCurrencies = ["VND", "JPY", "KRW", "PHP", "IDR", "THB"];
      const amountValue = parseInt(formData.amountCents);
      const amountCents = noDecimalCurrencies.includes(currency)
        ? amountValue
        : amountValue * 100;

      const payload = {
        ...formData,
        amountCents,
        occurredAt: `${formData.occurredAt}T00:00:00Z`, // Keep local date, convert to ISO
        tagIds: selectedTags,
      } as any;

      // Only include exchangeRate if type is TRANSFER and value is not 1
      if (formData.type === "TRANSFER" && formData.exchangeRate !== "1") {
        payload.exchangeRate = parseFloat(formData.exchangeRate);
      }

      // Only include transferAccountId if type is TRANSFER
      if (formData.type !== "TRANSFER") {
        delete payload.transferAccountId;
      }

      // Remove exchangeRate if not TRANSFER
      if (formData.type !== "TRANSFER") {
        delete payload.exchangeRate;
      }

      await createTransaction(payload);

      if (onSuccess) onSuccess();

      // Reset form
      setFormData({
        accountId: "",
        type: "EXPENSE",
        amountCents: "",
        occurredAt: new Date().toLocaleDateString("sv-SE"),
        categoryId: "",
        note: "",
        counterparty: "",
        tagIds: [],
        transferAccountId: "",
        exchangeRate: "1",
      });
      setSelectedTags([]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Account</Label>
          <Select
            value={formData.accountId}
            onValueChange={(value) =>
              setFormData({ ...formData, accountId: value })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select account" />
            </SelectTrigger>
            <SelectContent>
              {accounts.map((acc) => (
                <SelectItem key={acc.id} value={acc.id}>
                  {acc.name} ({acc.currency})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Type</Label>
          <Select
            value={formData.type}
            onValueChange={(value: any) =>
              setFormData({ ...formData, type: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="EXPENSE">Expense</SelectItem>
              <SelectItem value="INCOME">Income</SelectItem>
              <SelectItem value="TRANSFER">Transfer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Amount</Label>
          <Input
            type="number"
            step="0.01"
            value={formData.amountCents}
            onChange={(e) =>
              setFormData({ ...formData, amountCents: e.target.value })
            }
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Date</Label>
          <Input
            type="date"
            value={formData.occurredAt}
            onChange={(e) =>
              setFormData({ ...formData, occurredAt: e.target.value })
            }
            required
          />
        </div>
      </div>

      {formData.type === "TRANSFER" && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Transfer To Account</Label>
            <Select
              value={formData.transferAccountId}
              onValueChange={(value) =>
                setFormData({ ...formData, transferAccountId: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select destination account" />
              </SelectTrigger>
              <SelectContent>
                {accounts
                  .filter((acc) => acc.id !== formData.accountId)
                  .map((acc) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Exchange Rate</Label>
            <Input
              type="number"
              step="0.0001"
              value={formData.exchangeRate}
              onChange={(e) =>
                setFormData({ ...formData, exchangeRate: e.target.value })
              }
              placeholder="1.00"
              defaultValue="1"
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label>Category</Label>
        <Select
          value={formData.categoryId}
          onValueChange={(value) =>
            setFormData({ ...formData, categoryId: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                <span className="flex items-center gap-2">
                  {cat.icon && <span>{cat.icon}</span>}
                  {cat.name}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Counterparty</Label>
        <Input
          value={formData.counterparty}
          onChange={(e) =>
            setFormData({ ...formData, counterparty: e.target.value })
          }
          placeholder="e.g., Restaurant ABC"
          required
        />
      </div>

      <div className="space-y-2">
        <Label>Note</Label>
        <Textarea
          value={formData.note}
          onChange={(e) => setFormData({ ...formData, note: e.target.value })}
          placeholder="Add notes..."
          className="resize-none"
        />
      </div>

      <div className="space-y-2">
        <Label>Tags</Label>
        <div className="flex flex-wrap gap-2">
          {allTags.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.id) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => toggleTag(tag.id)}
              style={{
                backgroundColor: selectedTags.includes(tag.id)
                  ? tag.color
                  : "transparent",
                borderColor: tag.color,
                color: selectedTags.includes(tag.id) ? "white" : "inherit",
              }}
            >
              {tag.name}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" disabled={loading} className="flex-1">
          {loading ? "Creating..." : "Create Transaction"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={onClose}
          className="px-6"
        >
          Close
        </Button>
      </div>
    </form>
  );
}
