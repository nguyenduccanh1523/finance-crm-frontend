import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useUpdateTransaction,
  type Transaction,
} from "@/lib/hooks/transactions/useTransactions";
import { useGetFinanceTags } from "@/lib/hooks/tags/useFinanceTags";

interface EditTransactionTagsDialogProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function EditTransactionTagsDialog({
  transaction,
  open,
  onOpenChange,
  onSuccess,
}: EditTransactionTagsDialogProps) {
  const { updateTransaction, loading, error } = useUpdateTransaction();
  const { global, workspace } = useGetFinanceTags();

  const [selectedTags, setSelectedTags] = useState<string[]>(
    transaction?.tags?.map((t) => t.id) || [],
  );

  const allTags = [...global, ...workspace];

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId],
    );
  };

  const handleSave = async () => {
    if (!transaction) return;

    try {
      await updateTransaction(transaction.id, { tagIds: selectedTags });
      if (onSuccess) onSuccess();
      onOpenChange(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Tags</DialogTitle>
          <DialogDescription className="text-xs mt-2">
            Transaction: <span className="font-semibold">{transaction.counterparty}</span>
            <br />
            Amount: <span className="font-semibold">{transaction.amountCents}</span> ({transaction.currency || "USD"})
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-sm text-red-600 flex items-start gap-2">
            <span className="text-red-400 font-semibold">⚠</span>
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 max-h-48 overflow-y-auto">
            <div className="flex flex-wrap gap-2">
              {allTags.length > 0 ? (
                allTags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer hover:shadow-md transition-shadow px-3 py-1.5"
                    onClick={() => toggleTag(tag.id)}
                    style={{
                      backgroundColor: selectedTags.includes(tag.id)
                        ? tag.color
                        : "transparent",
                      borderColor: tag.color,
                      color: selectedTags.includes(tag.id) ? "white" : "inherit",
                      border: `2px solid ${tag.color}`,
                    }}
                  >
                    {selectedTags.includes(tag.id) && (
                      <span className="mr-1">✓</span>
                    )}
                    {tag.name}
                  </Badge>
                ))
              ) : (
                <p className="text-sm text-gray-500">No tags available</p>
              )}
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950 rounded-lg p-3 text-sm">
              <p className="text-blue-900 dark:text-blue-100">
                <strong>{selectedTags.length}</strong> tag{selectedTags.length !== 1 ? "s" : ""} selected
              </p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={loading} className="gap-2">
              {loading ? (
                <>
                  <span className="inline-block animate-spin">⌛</span>
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
