import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface TransactionPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  transactionData: {
    accountId?: string;
    accountName?: string;
    accountCurrency?: string;
    type?: "EXPENSE" | "INCOME" | "TRANSFER";
    amountCents?: number;
    amountFormatted?: string;
    occurredAt?: string;
    categoryId?: string;
    categoryName?: string;
    note?: string;
    counterparty?: string;
    tagNames?: string[];
    transferAccountName?: string;
    exchangeRate?: number;
  };
}

export function TransactionPreviewDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  transactionData,
}: TransactionPreviewDialogProps) {
  const getTypeColor = (type?: string) => {
    switch (type) {
      case "EXPENSE":
        return "bg-red-100 text-red-800";
      case "INCOME":
        return "bg-green-100 text-green-800";
      case "TRANSFER":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeLabel = (type?: string) => {
    switch (type) {
      case "EXPENSE":
        return "💸 Expense";
      case "INCOME":
        return "💰 Income";
      case "TRANSFER":
        return "↔️ Transfer";
      default:
        return "Transaction";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span>✓</span> Confirm Transaction
          </DialogTitle>
          <DialogDescription>
            Please review the details before confirming
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Transaction Type & Amount */}
          <Card className="border-2">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <Badge className={getTypeColor(transactionData.type)}>
                  {getTypeLabel(transactionData.type)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-center">
                {transactionData.amountFormatted}
              </p>
            </CardContent>
          </Card>

          {/* Account Information */}
          {transactionData.accountName && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {transactionData.accountName}
                  {transactionData.accountCurrency && (
                    <span className="text-muted-foreground text-sm ml-2">
                      ({transactionData.accountCurrency})
                    </span>
                  )}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Category */}
          {transactionData.categoryName && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{transactionData.categoryName}</p>
              </CardContent>
            </Card>
          )}

          {/* Date */}
          {transactionData.occurredAt && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">
                  {new Date(transactionData.occurredAt).toLocaleDateString(
                    "vi-VN",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    },
                  )}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Note */}
          {transactionData.note && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Note
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{transactionData.note}</p>
              </CardContent>
            </Card>
          )}

          {/* Counterparty */}
          {transactionData.counterparty && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Counterparty
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="font-medium">{transactionData.counterparty}</p>
              </CardContent>
            </Card>
          )}

          {/* Tags */}
          {transactionData.tagNames && transactionData.tagNames.length > 0 && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {transactionData.tagNames.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transfer Details */}
          {transactionData.type === "TRANSFER" &&
            transactionData.transferAccountName && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-muted-foreground">
                    Transfer To
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-medium">
                    {transactionData.transferAccountName}
                  </p>
                  {transactionData.exchangeRate &&
                    transactionData.exchangeRate !== 1 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        Exchange Rate: {transactionData.exchangeRate}
                      </p>
                    )}
                </CardContent>
              </Card>
            )}
        </div>

        <DialogFooter className="gap-2 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Back
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-green-600 hover:bg-green-700"
          >
            {isLoading ? "Confirming..." : "Confirm Transaction"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
