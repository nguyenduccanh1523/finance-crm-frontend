import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useBudgets,
  type Budget,
  type BudgetAnalytic,
} from "@/lib/hooks/budgets/useBudgets";
import { useGetAccounts } from "@/lib/hooks/accounts/useAccounts";

interface BudgetDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  budget: BudgetAnalytic | null;
  budgetData: Budget | null;
}

export function BudgetDetailDialog({
  open,
  onOpenChange,
  budget,
  budgetData,
}: BudgetDetailDialogProps) {
  const { getLinkedBudgetTransactions } = useBudgets();
  const { accounts } = useGetAccounts();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const accountInfo = accounts.find((acc) => acc.id === budgetData?.accountId);

  useEffect(() => {
    if (open && budget) {
      loadTransactions();
    }
  }, [open, budget?.budgetId]);

  const loadTransactions = async () => {
    if (!budget?.budgetId) return;
    setLoading(true);
    try {
      const data = await getLinkedBudgetTransactions(budget.budgetId);
      setTransactions(data);
    } catch (err) {
      console.error("Failed to load transactions:", err);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amountCents: string | number, currency: string) => {
    const noDecimalCurrencies = ["VND", "JPY", "KRW", "PHP", "IDR", "THB"];
    const amount =
      typeof amountCents === "string" ? parseInt(amountCents) : amountCents;

    if (noDecimalCurrencies.includes(currency)) {
      return `${amount.toLocaleString("vi-VN")} ${currency}`;
    }
    return `${(amount / 100).toLocaleString("vi-VN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!budget) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            💰 {budget.categoryName} Budget Details
          </DialogTitle>
          <DialogDescription>
            Detailed information about your budget and linked transactions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Budget Limit
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold">{budget.limitFormatted}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Amount Spent
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-red-600">
                  {budget.spentFormatted}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Remaining
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-green-600">
                  {budget.remainingFormatted}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">
                  Usage Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="font-bold">{budget.percentageUsed}%</span>
                  <Badge
                    className={
                      budget.status === "ON_TRACK"
                        ? "bg-green-100 text-green-800"
                        : budget.status === "WARNING"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }
                  >
                    {budget.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Information */}
          {accountInfo && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Account Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Account Name</p>
                    <p className="font-medium">{accountInfo.name}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Currency</p>
                    <p className="font-medium">{accountInfo.currency}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Account Type</p>
                    <p className="font-medium">{accountInfo.type || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Balance</p>
                    <p className="font-medium">
                      {formatCurrency(
                        accountInfo.currentBalanceCents,
                        accountInfo.currency,
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Prediction */}
          {budget.prediction && (
            <Card className="bg-blue-50 dark:bg-blue-950">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <span>{budget.prediction.trendIcon}</span>
                  Budget Prediction
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-sm">{budget.prediction.message}</p>
                  <p className="text-sm text-muted-foreground">
                    Predicted end-of-month spend:{" "}
                    <strong>{budget.prediction.predictedSpendFormatted}</strong>
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Confidence:{" "}
                    <strong>
                      {(budget.prediction.confidence * 100).toFixed(0)}%
                    </strong>
                  </p>
                  {budget.prediction.isOverBudget && (
                    <p className="text-sm text-red-600">
                      ⚠️ Projected overage:{" "}
                      {budget.prediction.overagePercentage.toFixed(1)}%
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Linked Transactions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Linked Transactions ({transactions.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-2">
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ) : transactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Note</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.map((txn) => (
                        <TableRow key={txn.id}>
                          <TableCell className="text-sm">
                            {formatDate(txn.occurredAt)}
                          </TableCell>
                          <TableCell className="text-sm">
                            {txn.category?.name || "N/A"}
                          </TableCell>
                          <TableCell className="text-sm max-w-xs truncate">
                            {txn.note || "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium text-red-600">
                            -{formatCurrency(txn.amountCents, txn.currency)}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {txn.type}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No transactions linked to this budget yet
                </p>
              )}
            </CardContent>
          </Card>

          {/* Summary */}
          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle className="text-base">Summary</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p>
                <span className="text-muted-foreground">Period:</span>{" "}
                {budget.daysLeftInMonth} days left
              </p>
              <p>
                <span className="text-muted-foreground">
                  Days remaining in month:
                </span>{" "}
                {budget.daysLeftInMonth} days
              </p>
              <p>
                <span className="text-muted-foreground">
                  Total transactions:
                </span>{" "}
                {transactions.length}
              </p>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
