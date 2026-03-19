import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  useGetTransactions,
  useDeleteTransaction,
  type Transaction,
} from "@/lib/hooks/transactions/useTransactions";
import { useGetAccounts } from "@/lib/hooks/accounts/useAccounts";
import { useGetFinanceCategories } from "@/lib/hooks/categories/useFinanceCategories";
import { CreateTransactionForm } from "@/components/transactions/CreateTransactionForm";
import { EditTransactionTagsDialog } from "@/components/transactions/EditTransactionTagsDialog";
import { MoreHorizontal, Plus, Trash2, Tags } from "lucide-react";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";

const TRANSACTION_TYPES = [
  { value: "all", label: "All Types" },
  { value: "EXPENSE", label: "Expense" },
  { value: "INCOME", label: "Income" },
  { value: "TRANSFER", label: "Transfer" },
];

export function TransactionsPage() {
  const { transactions, pagination, loading, fetchTransactions, error } =
    useGetTransactions();
  const { deleteTransaction } = useDeleteTransaction();
  const { accounts, fetchAccounts } = useGetAccounts();
  const {
    global: globalCategories,
    workspace: workspaceCategories,
    fetchCategories,
  } = useGetFinanceCategories();

  const allCategories = [...globalCategories, ...workspaceCategories];
  const accountsList = accounts.map((acc) => ({
    id: acc.id,
    name: acc.name,
    currency: acc.currency,
  }));

  const [selectedAccount, setSelectedAccount] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [fromDate, setFromDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    return date.toISOString().split("T")[0];
  });
  const [toDate, setToDate] = useState(() => {
    const date = new Date();
    date.setMonth(date.getMonth() + 1, 0);
    return date.toISOString().split("T")[0];
  });
  const [currentPage, setCurrentPage] = useState(1);

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [editTagsOpen, setEditTagsOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const loadTransactions = async (pageNum = 1) => {
    try {
      const params: any = {
        from: `${fromDate}T00:00:00Z`,
        to: `${toDate}T23:59:59Z`,
        page: pageNum,
        limit: 20,
        sortBy: "occurredAt",
        order: "DESC",
      };

      if (selectedAccount !== "all") {
        params.accountId = selectedAccount;
      }

      if (selectedType !== "all") {
        params.type = selectedType;
      }

      await fetchTransactions(params);
      setCurrentPage(pageNum);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTransactions();
    fetchAccounts().catch(console.error);
    fetchCategories().catch(console.error);
  }, []);

  const handleFilterChange = () => {
    setCurrentPage(1);
    loadTransactions(1);
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    try {
      await deleteTransaction(transactionToDelete.id);
      setDeleteConfirmOpen(false);
      setTransactionToDelete(null);
      loadTransactions(currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (amountCents: string, currency: string) => {
    // Currencies without decimal places
    const noDecimalCurrencies = ["VND", "JPY", "KRW", "PHP", "IDR", "THB"];

    if (noDecimalCurrencies.includes(currency)) {
      return `${parseInt(amountCents).toLocaleString("vi-VN")} ${currency}`;
    }

    const amount = parseInt(amountCents) / 100;
    return `${amount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })} ${currency}`;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "EXPENSE":
        return "🔴";
      case "INCOME":
        return "🟢";
      case "TRANSFER":
        return "🔵";
      default:
        return "⚪";
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Transactions</h1>
          <p className="text-gray-500 mt-1">
            Manage your financial transactions
          </p>
        </div>

        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" />
              New Transaction
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Create New Transaction</DrawerTitle>
              <DrawerDescription>
                Add a new transaction to your account
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-6 pb-6">
              <CreateTransactionForm
                accounts={accountsList}
                categories={allCategories.map((cat) => ({
                  id: cat.id,
                  name: cat.name,
                  icon: cat.icon,
                }))}
                onSuccess={() => {
                  setDrawerOpen(false);
                  loadTransactions(1);
                }}
                onClose={() => setDrawerOpen(false)}
              />
            </div>
          </DrawerContent>
        </Drawer>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Account</label>
              <Select
                value={selectedAccount}
                onValueChange={setSelectedAccount}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Accounts</SelectItem>
                  {accountsList.map((acc: any) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Type</label>
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TRANSACTION_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">From</label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">To</label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <div className="flex items-end">
              <Button onClick={handleFilterChange} className="w-full">
                Apply Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              Transaction List
              <span className="text-gray-500 font-normal ml-2 text-sm">
                ({pagination.total} total)
              </span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">Loading transactions...</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-gray-500">No transactions found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b">
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Account</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
                    >
                      <TableCell className="font-medium text-gray-900 dark:text-white">
                        {new Date(transaction.occurredAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.counterparty}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {transaction.note}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.account?.name || "N/A"}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {transaction.account?.currency}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className="text-lg">
                            {transaction.category?.icon || "📁"}
                          </span>
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {transaction.category?.name || "N/A"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold">
                        {transaction.type === "EXPENSE" && (
                          <span className="text-red-600 dark:text-red-400">
                            -
                            {formatCurrency(
                              transaction.amountCents,
                              transaction.account?.currency ||
                                transaction.currency,
                            )}
                          </span>
                        )}
                        {transaction.type === "INCOME" && (
                          <span className="text-green-600 dark:text-green-400">
                            +
                            {formatCurrency(
                              transaction.amountCents,
                              transaction.account?.currency ||
                                transaction.currency,
                            )}
                          </span>
                        )}
                        {transaction.type === "TRANSFER" && (
                          <span className="text-blue-600 dark:text-blue-400">
                            {formatCurrency(
                              transaction.amountCents,
                              transaction.account?.currency ||
                                transaction.currency,
                            )}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            transaction.type === "EXPENSE"
                              ? "destructive"
                              : transaction.type === "INCOME"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {getTypeIcon(transaction.type)} {transaction.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {transaction.tags && transaction.tags.length > 0 ? (
                            transaction.tags.map((tag) => (
                              <Badge
                                key={tag.id}
                                variant="outline"
                                className="text-xs"
                                style={{ borderColor: tag.color }}
                              >
                                {tag.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-gray-400 dark:text-gray-500 text-sm">
                              -
                            </span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => {
                                setEditingTransaction(transaction);
                                setEditTagsOpen(true);
                              }}
                              className="gap-2"
                            >
                              <Tags className="w-4 h-4" />
                              Edit Tags
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => {
                                setTransactionToDelete(transaction);
                                setDeleteConfirmOpen(true);
                              }}
                              className="gap-2 text-red-600"
                            >
                              <Trash2 className="w-4 h-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 flex justify-center items-center gap-4">
              <Button
                variant="outline"
                onClick={() => loadTransactions(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm text-gray-600">
                Page {currentPage} of {pagination.totalPages}
              </div>
              <Button
                variant="outline"
                onClick={() => loadTransactions(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Tags Dialog */}
      <EditTransactionTagsDialog
        transaction={editingTransaction}
        open={editTagsOpen}
        onOpenChange={setEditTagsOpen}
        onSuccess={() => loadTransactions(currentPage)}
      />

      {/* Delete Confirm Dialog */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Transaction"
        description={`Are you sure you want to delete this transaction? This action cannot be undone.`}
        itemName={transactionToDelete?.counterparty || "Transaction"}
        onConfirm={handleDelete}
      />
    </div>
  );
}
