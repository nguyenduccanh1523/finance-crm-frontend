import { useState } from "react";
import { Plus, Edit2, Trash2, Search, Eye, EyeOff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockAccounts = [
  {
    id: 1,
    accountName: "Main Account",
    accountNumber: "****1234",
    bankName: "Vietcombank",
    balance: 25500.5,
    currency: "VND",
    status: "active",
    lastTransaction: "2025-03-04",
    type: "Checking",
  },
  {
    id: 2,
    accountName: "Savings Account",
    accountNumber: "****5678",
    bankName: "Techcombank",
    balance: 450000.0,
    currency: "VND",
    status: "active",
    lastTransaction: "2025-03-02",
    type: "Savings",
  },
  {
    id: 3,
    accountName: "Business Account",
    accountNumber: "****9012",
    bankName: "MB Bank",
    balance: 185750.75,
    currency: "VND",
    status: "active",
    lastTransaction: "2025-03-05",
    type: "Business",
  },
  {
    id: 4,
    accountName: "Investment Account",
    accountNumber: "****3456",
    bankName: "VPBank",
    balance: 0.0,
    currency: "VND",
    status: "inactive",
    lastTransaction: "2025-02-15",
    type: "Investment",
  },
];

export function AccountPage() {
  const [accounts, setAccounts] = useState(mockAccounts);
  const [searchTerm, setSearchTerm] = useState("");
  const [showBalance, setShowBalance] = useState<Record<number, boolean>>({});

  const filteredAccounts = accounts.filter(
    (acc) =>
      acc.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.bankName.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = (id: number) => {
    setAccounts(accounts.filter((acc) => acc.id !== id));
  };

  const toggleBalance = (id: number) => {
    setShowBalance((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="flex-1 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Wallet & Accounts
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your bank accounts and wallet
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={18} />
          Add Account
        </Button>
      </div>

      {/* Summary Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Total Balance
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {totalBalance.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            })}
          </p>
        </div>
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Active Accounts
          </p>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400">
            {accounts.filter((a) => a.status === "active").length}
          </p>
        </div>
        <div className="p-6 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Total Accounts
          </p>
          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {accounts.length}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <Input
          placeholder="Search accounts..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-900">
              <TableHead>Account Name</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Account Number</TableHead>
              <TableHead>Account Type</TableHead>
              <TableHead className="text-right">Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-sm">Last Transaction</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.length > 0 ? (
              filteredAccounts.map((account) => (
                <TableRow
                  key={account.id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    {account.accountName}
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400">
                    {account.bankName}
                  </TableCell>
                  <TableCell className="font-mono text-sm text-gray-600 dark:text-gray-400">
                    {account.accountNumber}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800"
                    >
                      {account.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {showBalance[account.id]
                          ? account.balance.toLocaleString("vi-VN", {
                              style: "currency",
                              currency: "VND",
                            })
                          : "•••••••"}
                      </span>
                      <button
                        onClick={() => toggleBalance(account.id)}
                        className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition"
                      >
                        {showBalance[account.id] ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </button>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        account.status === "active"
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }
                    >
                      {account.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-600 dark:text-gray-400 text-sm">
                    {account.lastTransaction}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <button className="p-2 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition text-green-600 dark:text-green-400">
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(account.id)}
                        className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition text-red-600 dark:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-8 text-gray-500"
                >
                  No accounts found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
