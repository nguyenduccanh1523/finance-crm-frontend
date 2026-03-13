import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader,
  DollarSign,
  Landmark,
  CreditCard,
  TrendingUp,
  Eye,
  EyeOff,
  Wallet,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AlertCircle as AlertIcon } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppToast } from "@/components/common/toast/useToast";
import {
  useGetAccounts,
  useCreateAccount,
  useUpdateAccount,
  useDeleteAccount,
  type Account,
} from "@/lib/hooks/accounts/useAccounts";

const ACCOUNT_TYPES = ["BANK", "CASH", "CREDIT_CARD", "INVESTMENT", "OTHER"];
const CURRENCIES = [
  "USD",
  "EUR",
  "VND",
  "GBP",
  "JPY",
  "CNY",
  "AUD",
  "CAD",
  "CHF",
  "SGD",
];

type AccountTypeIcon = {
  [key: string]: React.ReactElement;
};

const ACCOUNT_TYPE_ICONS: AccountTypeIcon = {
  BANK: <Landmark size={20} className="text-blue-600 dark:text-blue-400" />,
  CASH: <DollarSign size={20} className="text-green-600 dark:text-green-400" />,
  CREDIT_CARD: (
    <CreditCard size={20} className="text-purple-600 dark:text-purple-400" />
  ),
  INVESTMENT: (
    <TrendingUp size={20} className="text-orange-600 dark:text-orange-400" />
  ),
  OTHER: <Landmark size={20} className="text-gray-600 dark:text-gray-400" />,
};

export function AccountPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [visibleBalances, setVisibleBalances] = useState<
    Record<string, boolean>
  >({});
  const [showTotalBalance, setShowTotalBalance] = useState(true);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    type: "BANK",
    currency: "USD",
    openingBalanceCents: 0,
  });
  const hasInitialized = useRef(false);

  const { accounts, setAccounts, loading, fetchAccounts } = useGetAccounts();
  const { createAccount, loading: createLoading } = useCreateAccount();
  const { updateAccount, loading: updateLoading } = useUpdateAccount();
  const { deleteAccount, loading: deleteLoading } = useDeleteAccount();
  const { showSuccess, showError } = useAppToast();

  useEffect(() => {
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    fetchAccounts().catch((err) => {
      console.error("Failed to load accounts:", err);
    });
  }, [fetchAccounts]);

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.currency.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenDialog = (account?: Account) => {
    if (account) {
      setIsEditMode(true);
      setSelectedAccount(account);
      setFormData({
        name: account.name,
        type: account.type,
        currency: account.currency,
        openingBalanceCents: account.openingBalanceCents,
      });
    } else {
      setIsEditMode(false);
      setSelectedAccount(null);
      setFormData({
        name: "",
        type: "BANK",
        currency: "USD",
        openingBalanceCents: 0,
      });
    }
    setIsOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setIsOpenDialog(false);
    setFormData({
      name: "",
      type: "BANK",
      currency: "USD",
      openingBalanceCents: 0,
    });
    setSelectedAccount(null);
    setIsEditMode(false);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      showError("Account name is required");
      return;
    }

    try {
      if (isEditMode && selectedAccount) {
        const updated = await updateAccount(selectedAccount.id, {
          name: formData.name,
          type: formData.type,
          currency: formData.currency,
          openingBalanceCents: formData.openingBalanceCents,
        });

        setAccounts(
          accounts.map((acc) =>
            acc.id === selectedAccount.id ? updated : acc,
          ),
        );
        showSuccess("Account updated successfully");
      } else {
        const newAccount = await createAccount({
          name: formData.name,
          type: formData.type,
          currency: formData.currency,
          openingBalanceCents: formData.openingBalanceCents,
        });

        setAccounts([...accounts, newAccount]);
        showSuccess("Account created successfully");
      }

      handleCloseDialog();
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "An error occurred. Please try again.";
      showError(errorMsg);
    }
  };

  const handleDelete = async (id: string) => {
    setAccountToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!accountToDelete) return;

    try {
      await deleteAccount(accountToDelete);
      setAccounts(accounts.filter((acc) => acc.id !== accountToDelete));
      showSuccess("Account deleted successfully");
      setDeleteConfirmOpen(false);
      setAccountToDelete(null);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || "Failed to delete account";
      showError(errorMsg);
    }
  };

  const toggleBalance = (id: string) => {
    setVisibleBalances((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatCurrency = (cents: number) => {
    return (cents / 100).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  // Calculate total balance per currency
  const totalsByCurrency = accounts.reduce(
    (acc, account) => {
      const balance = Math.round(
        Number(account.currentBalanceCents ?? account.openingBalanceCents) || 0,
      );
      const currency = account.currency;
      acc[currency] = Math.round((acc[currency] || 0) + balance);
      return acc;
    },
    {} as Record<string, number>,
  );

  const currencyTotals = Object.entries(totalsByCurrency)
    .sort(([currencyA], [currencyB]) => currencyA.localeCompare(currencyB))
    .map(([currency, total]) => ({ currency, total }));

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin w-8 h-8 mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading accounts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 space-y-8">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl">
              <Wallet size={28} className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              My Accounts
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your bank accounts and financial assets
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg"
          disabled={loading || createLoading}
        >
          <Plus size={18} />
          Add Account
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Currency Totals */}
        <Card className="lg:col-span-2 p-6 border-0 shadow-md bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Balance by Currency
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowTotalBalance(!showTotalBalance)}
                className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-lg transition text-gray-400 hover:text-blue-600"
                title={showTotalBalance ? "Hide totals" : "Show totals"}
              >
                {showTotalBalance ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
              <div className="p-2 bg-blue-100 dark:bg-blue-900/40 rounded-lg">
                <DollarSign
                  size={20}
                  className="text-blue-600 dark:text-blue-400"
                />
              </div>
            </div>
          </div>
          {currencyTotals.length > 0 ? (
            <div className="space-y-3">
              {currencyTotals.map(({ currency, total }) => (
                <div
                  key={currency}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg"
                >
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                    {currency}
                  </span>
                  {showTotalBalance ? (
                    <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {formatCurrency(total)}
                    </span>
                  ) : (
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-24 animate-pulse"></div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-600 dark:text-gray-400">
              No accounts
            </p>
          )}
        </Card>

        {/* Active Accounts */}
        <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Active Accounts
            </p>
            <div className="p-2 bg-green-100 dark:bg-green-900/40 rounded-lg">
              <Landmark
                size={20}
                className="text-green-600 dark:text-green-400"
              />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {accounts.length}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            {currencyTotals.length} currencies in use
          </p>
        </Card>

        {/* Account Types */}
        <Card className="p-6 border-0 shadow-md bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/40 dark:to-pink-950/40">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Account Types
            </p>
            <div className="p-2 bg-purple-100 dark:bg-purple-900/40 rounded-lg">
              <CreditCard
                size={20}
                className="text-purple-600 dark:text-purple-400"
              />
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            {new Set(accounts.map((a) => a.type)).size}
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
            Different types in use
          </p>
        </Card>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={20}
        />
        <Input
          placeholder="Search by name or currency..."
          className="pl-12 py-3 text-base border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-blue-500 focus:ring-0"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
        />
      </div>

      {/* Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map((account) => (
            <Card
              key={account.id}
              className="group border-0 shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900"
            >
              {/* Card Header */}
              <div className="p-6 space-y-4">
                {/* Top Row: Icon & Name & Menu */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-3 bg-white dark:bg-gray-700 rounded-xl shadow-sm group-hover:shadow-md transition">
                      {ACCOUNT_TYPE_ICONS[account.type] ||
                        ACCOUNT_TYPE_ICONS.OTHER}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 dark:text-white">
                        {account.name}
                      </p>
                      <div className="flex gap-1 mt-1">
                        <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-0 text-xs font-semibold">
                          {account.type}
                        </Badge>
                        <Badge className="bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-0 text-xs font-semibold">
                          {account.currency}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Balance Section */}
                <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Current Balance
                    </p>
                    <button
                      onClick={() => toggleBalance(account.id)}
                      className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-lg transition text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      title={
                        visibleBalances[account.id]
                          ? "Hide balance"
                          : "Show balance"
                      }
                    >
                      {visibleBalances[account.id] ? (
                        <Eye size={18} />
                      ) : (
                        <EyeOff size={18} />
                      )}
                    </button>
                  </div>

                  {account.currentBalanceCents !== undefined ? (
                    visibleBalances[account.id] ? (
                      <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                        {formatCurrency(account.currentBalanceCents)}
                      </p>
                    ) : (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded-lg w-32 animate-pulse"></div>
                      </div>
                    )
                  ) : (
                    <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                      {formatCurrency(account.openingBalanceCents)}
                    </p>
                  )}

                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Opening:{" "}
                    {visibleBalances[account.id]
                      ? formatCurrency(account.openingBalanceCents)
                      : "••••"}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleOpenDialog(account)}
                    disabled={updateLoading || deleteLoading}
                    className="flex-1 px-3 py-2.5 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-600 dark:text-blue-400 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium text-sm"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    disabled={deleteLoading || updateLoading}
                    className="flex-1 px-3 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 dark:text-red-400 rounded-lg transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium text-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </Card>
          ))
        ) : (
          <div className="col-span-full">
            <Card className="p-12 border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900/50">
              <div className="text-center">
                <div className="p-4 bg-gray-200 dark:bg-gray-800 rounded-full w-16 mx-auto mb-4">
                  <AlertCircle
                    size={32}
                    className="text-gray-600 dark:text-gray-400 m-auto"
                  />
                </div>
                <p className="text-gray-600 dark:text-gray-400 font-medium">
                  {searchTerm
                    ? "No accounts found matching your search"
                    : "No accounts yet"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {searchTerm
                    ? "Try adjusting your search terms"
                    : "Click 'Add Account' to create your first account"}
                </p>
              </div>
            </Card>
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isOpenDialog} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader className="border-b pb-4">
            <DialogTitle className="text-xl">
              {isEditMode ? "✏️ Edit Account" : "➕ Add New Account"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update your account details below"
                : "Create a new financial account to track"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Account Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Account Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Tài khoản VCB"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={createLoading || updateLoading}
                className="border-2 focus:border-blue-500 focus:ring-0"
              />
            </div>

            {/* Account Type */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Account Type <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.type}
                onValueChange={(value) =>
                  setFormData({ ...formData, type: value })
                }
                disabled={createLoading || updateLoading}
              >
                <SelectTrigger className="border-2 focus:border-blue-500">
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  {ACCOUNT_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Currency */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Currency <span className="text-red-500">*</span>
              </label>
              <Select
                value={formData.currency}
                onValueChange={(value) =>
                  setFormData({ ...formData, currency: value })
                }
                disabled={createLoading || updateLoading}
              >
                <SelectTrigger className="border-2 focus:border-blue-500">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((currency) => (
                    <SelectItem key={currency} value={currency}>
                      {currency}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Opening Balance */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Opening Balance <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                placeholder="0.00"
                value={(formData.openingBalanceCents / 100).toLocaleString(
                  "en-US",
                  {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  },
                )}
                onChange={(e) => {
                  const value = e.target.value.replace(/,/g, "");
                  const numValue = parseFloat(value || "0");
                  if (!isNaN(numValue)) {
                    setFormData({
                      ...formData,
                      openingBalanceCents: Math.round(numValue * 100),
                    });
                  }
                }}
                disabled={createLoading || updateLoading}
                className="border-2 focus:border-blue-500 focus:ring-0"
              />
            </div>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={handleCloseDialog}
              disabled={createLoading || updateLoading}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={createLoading || updateLoading}
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-2"
            >
              {(createLoading || updateLoading) && (
                <Loader size={16} className="animate-spin" />
              )}
              {isEditMode ? "Update Account" : "Create Account"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                <AlertIcon
                  size={24}
                  className="text-red-600 dark:text-red-400"
                />
              </div>
              <DialogTitle className="text-xl">Delete Account</DialogTitle>
            </div>
            <DialogDescription className="text-base mt-2">
              Are you sure you want to delete this account?
            </DialogDescription>
          </DialogHeader>

          <div className="py-4 bg-red-50 dark:bg-red-900/10 rounded-lg p-4 border border-red-200 dark:border-red-900/40">
            <p className="text-sm text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Warning:</span> This action cannot
              be undone. All data associated with this account will be
              permanently deleted.
            </p>
          </div>

          <DialogFooter className="border-t pt-4">
            <Button
              variant="outline"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setAccountToDelete(null);
              }}
              disabled={deleteLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={confirmDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700 gap-2"
            >
              {deleteLoading && <Loader size={16} className="animate-spin" />}
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
