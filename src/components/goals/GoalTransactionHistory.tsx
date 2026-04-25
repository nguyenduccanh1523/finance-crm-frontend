import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowDownLeft, ArrowUpRight, Loader2 } from "lucide-react";
import {
  useGoalTransactions,
  type GoalTransaction,
} from "@/lib/hooks/goals/useGoalTransactions";

export interface GoalTransactionHistoryProps {
  goalId: string;
  goalName: string;
}

type FilterType = "all" | "allocations" | "withdrawals";

export function GoalTransactionHistory({
  goalId,
}: GoalTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<GoalTransaction[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const { loading, getGoalTransactions } = useGoalTransactions();

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getGoalTransactions(goalId);
      setTransactions(data || []);
    };
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [goalId]);

  const allocations = transactions.filter((t) => t.type === "GOAL_ALLOCATION");
  const withdrawals = transactions.filter((t) => t.type === "GOAL_WITHDRAWAL");

  const filteredTransactions =
    filterType === "all"
      ? transactions
      : filterType === "allocations"
        ? allocations
        : withdrawals;

  const formatAmount = (amountCents: number, currency: string) => {
    const formatted = amountCents.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${formatted} ${currency}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }).format(date);
    } catch {
      return dateString;
    }
  };

  const transactionContent = (txns: GoalTransaction[]) => {
    if (txns.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm">No transactions in this filter</p>
        </div>
      );
    }

    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-xs font-semibold">Date</TableHead>
              <TableHead className="text-xs font-semibold">Account</TableHead>
              <TableHead className="text-xs font-semibold">Type</TableHead>
              <TableHead className="text-right text-xs font-semibold">
                Amount
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {txns.map((tx, idx) => (
              <TableRow
                key={tx.id}
                className={idx % 2 === 0 ? "bg-muted/30" : ""}
              >
                <TableCell className="text-sm text-muted-foreground py-3">
                  {formatDate(tx.createdAt)}
                </TableCell>
                <TableCell className="text-sm font-medium">
                  {tx.account.name}
                </TableCell>
                <TableCell className="text-sm">
                  {tx.type === "GOAL_ALLOCATION" ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <ArrowDownLeft className="w-3 h-3" />
                      <span>Allocate</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-blue-600">
                      <ArrowUpRight className="w-3 h-3" />
                      <span>Withdraw</span>
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-right font-semibold text-sm">
                  {tx.type === "GOAL_ALLOCATION" ? (
                    <span className="text-green-600">
                      +{formatAmount(tx.amountCents, tx.currency)}
                    </span>
                  ) : (
                    <span className="text-blue-600">
                      -{formatAmount(tx.amountCents, tx.currency)}
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6">
      {loading ? (
        <div className="text-center py-12 text-muted-foreground flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin" />
          <p>Loading transactions...</p>
        </div>
      ) : transactions.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="text-center py-12">
            <div className="text-muted-foreground mb-2">💰</div>
            <p className="text-muted-foreground">
              No allocations or withdrawals yet
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Start by allocating funds to this goal
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Statistics Cards */}
          <div className="grid grid-cols-3 gap-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">
                  Total In
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-green-600 flex items-center gap-1">
                  <ArrowDownLeft className="w-4 h-4" />+{allocations.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">
                  Total Out
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-blue-600 flex items-center gap-1">
                  <ArrowUpRight className="w-4 h-4" />-{withdrawals.length}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs text-muted-foreground">
                  Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold text-indigo-600">
                  {transactions.length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filter Buttons */}
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={filterType === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("all")}
                className="text-xs"
              >
                All ({transactions.length})
              </Button>
              <Button
                variant={filterType === "allocations" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("allocations")}
                className="text-xs gap-1"
              >
                <ArrowDownLeft className="w-3 h-3" />
                Allocate ({allocations.length})
              </Button>
              <Button
                variant={filterType === "withdrawals" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterType("withdrawals")}
                className="text-xs gap-1"
              >
                <ArrowUpRight className="w-3 h-3" />
                Withdraw ({withdrawals.length})
              </Button>
            </div>

            {/* Transactions Card */}
            <Card>
              <CardContent className="p-0">
                {transactionContent(filteredTransactions)}
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
