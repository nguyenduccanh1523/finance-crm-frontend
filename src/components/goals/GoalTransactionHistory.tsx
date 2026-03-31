import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
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
  goalName,
}: GoalTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<GoalTransaction[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("all");
  const { loading, getGoalTransactions } = useGoalTransactions();

  useEffect(() => {
    const fetchTransactions = async () => {
      const data = await getGoalTransactions(goalId);
      setTransactions(data);
    };
    fetchTransactions();
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
          No transactions yet
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Date</TableHead>
            <TableHead>Account</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {txns.map((tx) => (
            <TableRow key={tx.id}>
              <TableCell className="text-sm">
                {formatDate(tx.createdAt)}
              </TableCell>
              <TableCell>{tx.account.name}</TableCell>
              <TableCell className="text-right font-medium">
                {formatAmount(tx.amountCents, tx.currency)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  return (
    <div className="w-full">
      {loading ? (
        <div className="text-center py-8 text-muted-foreground flex items-center justify-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No allocations or withdrawals yet
        </div>
      ) : (
        <div className="space-y-4">
          {/* Filter Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
              className="text-xs sm:text-sm"
            >
              All ({transactions.length})
            </Button>
            <Button
              variant={filterType === "allocations" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("allocations")}
              className="text-xs sm:text-sm gap-1"
            >
              <ArrowDownLeft className="w-4 h-4" />
              In ({allocations.length})
            </Button>
            <Button
              variant={filterType === "withdrawals" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("withdrawals")}
              className="text-xs sm:text-sm gap-1"
            >
              <ArrowUpRight className="w-4 h-4" />
              Out ({withdrawals.length})
            </Button>
          </div>

          {/* Transactions Table */}
          <div className="border rounded-lg overflow-hidden">
            {transactionContent(filteredTransactions)}
          </div>
        </div>
      )}
    </div>
  );
}
