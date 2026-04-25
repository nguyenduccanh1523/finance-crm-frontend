import { useEffect, useState, useRef, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  AlertCircle,
  CheckCircle,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { DeleteConfirmDialog } from "@/components/common/DeleteConfirmDialog";
import { useAppToast } from "@/components/common/toast/useToast";
import { BudgetDetailDialog } from "@/components/budgets/BudgetDetailDialog";
import {
  useBudgets,
  type Budget,
  type BudgetAnalytic,
} from "@/lib/hooks/budgets/useBudgets";
import { useGetFinanceCategories } from "@/lib/hooks/categories/useFinanceCategories";
import { useGetAccounts } from "@/lib/hooks/accounts/useAccounts";

interface FormData {
  categoryId: string;
  accountId: string;
  periodMonth: string;
  amountLimitCents: number;
  alertThresholdPercent: number;
}

const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => {
  const date = new Date(2026, i, 1);
  return {
    value: date.toISOString().split("T")[0].slice(0, 7) + "-01",
    label: date.toLocaleString("en-US", { month: "long", year: "numeric" }),
  };
});

function getStatusBadge(status: string) {
  switch (status) {
    case "ON_TRACK":
      return <Badge className="bg-green-500/20 text-green-700">On Track</Badge>;
    case "WARNING":
      return <Badge className="bg-amber-500/20 text-amber-700">Warning</Badge>;
    case "EXCEEDED":
      return <Badge className="bg-red-500/20 text-red-700">Exceeded</Badge>;
    default:
      return null;
  }
}

function ProgressBar({ used, total }: { used: number; total: number }) {
  const percentage = Math.min((used / total) * 100, 100);
  let bgColor = "bg-green-500";
  if (percentage > 90) bgColor = "bg-red-500";
  else if (percentage > 70) bgColor = "bg-amber-500";

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className={`${bgColor} h-2 rounded-full transition-all`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function BudgetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);
  const [budgetToDeleteName, setBudgetToDeleteName] = useState<string>("");
  const [budgetAnalytics, setBudgetAnalytics] = useState<any>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [selectedDetailBudget, setSelectedDetailBudget] =
    useState<BudgetAnalytic | null>(null);
  const [selectedDetailBudgetData, setSelectedDetailBudgetData] =
    useState<Budget | null>(null);

  const [formData, setFormData] = useState<FormData>({
    categoryId: "",
    accountId: "",
    periodMonth: new Date().toISOString().split("T")[0].slice(0, 7) + "-01",
    amountLimitCents: 0,
    alertThresholdPercent: 80,
  });

  const hasInitialized = useRef(false);

  const {
    loading,
    getBudgets,
    createBudget,
    updateBudget,
    deleteBudget,
    getBudgetsAnalytics,
  } = useBudgets();
  const { workspace: categories = [], fetchCategories } =
    useGetFinanceCategories();
  const { accounts = [] } = useGetAccounts();
  const { showError } = useAppToast();

  const [budgets, setBudgets] = useState<Budget[]>([]);

  const fetchBudgets = useCallback(async () => {
    const data = await getBudgets();
    setBudgets(data);

    // Fetch analytics
    const analytics = await getBudgetsAnalytics();
    if (analytics) {
      setBudgetAnalytics(analytics);
    }
  }, [getBudgets, getBudgetsAnalytics]);

  // Initial fetch
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchBudgets();
      fetchCategories();
    }
  }, [fetchBudgets, fetchCategories]);

  const filteredBudgets =
    budgetAnalytics?.details?.filter((budget: BudgetAnalytic) =>
      budget.categoryName.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  const handleOpenDialog = () => {
    setIsEditMode(false);
    setSelectedBudget(null);
    setFormData({
      categoryId: "",
      accountId: accounts?.[0]?.id || "",
      periodMonth: new Date().toISOString().split("T")[0].slice(0, 7) + "-01",
      amountLimitCents: 0,
      alertThresholdPercent: 80,
    });
    setIsOpenDialog(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setIsEditMode(true);
    setSelectedBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      accountId: budget.accountId,
      periodMonth: budget.periodMonth,
      amountLimitCents: budget.amountLimitCents,
      alertThresholdPercent: budget.alertThresholdPercent,
    });
    setIsOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.categoryId || !formData.accountId) {
      showError("Please fill in all fields");
      return;
    }

    if (isEditMode && selectedBudget) {
      const success = await updateBudget(selectedBudget.id, {
        amountLimitCents: formData.amountLimitCents,
        alertThresholdPercent: formData.alertThresholdPercent,
      });
      if (success) {
        await fetchBudgets();
        setIsOpenDialog(false);
      }
    } else {
      const result = await createBudget(formData);
      if (result) {
        await fetchBudgets();
        setIsOpenDialog(false);
      }
    }
  };

  const handleDeleteClick = (budget: Budget, categoryName: string) => {
    setBudgetToDelete(budget);
    setBudgetToDeleteName(categoryName);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (budgetToDelete) {
      const success = await deleteBudget(budgetToDelete.id);
      if (success) {
        await fetchBudgets();
        setDeleteConfirmOpen(false);
        setBudgetToDelete(null);
      }
    }
  };

  const handleViewDetails = (budget: BudgetAnalytic) => {
    setSelectedDetailBudget(budget);
    const original = budgets.find((b) => b.id === budget.budgetId);
    setSelectedDetailBudgetData(original || null);
    setDetailDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          💰 Budget Management
        </h1>
        <p className="text-muted-foreground">
          Control your spending and track your budget across categories
        </p>
      </div>

      {/* SUMMARY CARDS */}
      {budgetAnalytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Budget
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {budgetAnalytics.totalBudgetCents
                  ? `₫${budgetAnalytics.totalBudgetCents.toLocaleString("vi-VN")}`
                  : "₫0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {budgetAnalytics.spendingTrend === "UP" && "📈 Trending up"}
                {budgetAnalytics.spendingTrend === "DOWN" && "📉 Trending down"}
                {budgetAnalytics.spendingTrend === "STABLE" && "➡️ Stable"}
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {budgetAnalytics.totalSpentCents
                  ? `₫${budgetAnalytics.totalSpentCents.toLocaleString("vi-VN")}`
                  : "₫0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {budgetAnalytics.averageUtilization}% average
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {budgetAnalytics.totalRemainingCents
                  ? `₫${budgetAnalytics.totalRemainingCents.toLocaleString("vi-VN")}`
                  : "₫0"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Unused amount
              </p>
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mt-1">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium">
                  {budgetAnalytics.budgetsOnTrack}
                </span>
              </div>
              <div className="flex gap-2 mt-2">
                <AlertCircle className="w-5 h-5 text-amber-600" />
                <span className="text-sm font-medium">
                  {budgetAnalytics.budgetsWarning}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* CONTROLS */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search budgets..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={handleOpenDialog}
          className="gap-2 bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          New Budget
        </Button>
      </div>

      {/* BUDGET CARDS GRID */}
      {filteredBudgets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBudgets.map((budget: BudgetAnalytic) => (
            <Card
              key={budget.budgetId}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">
                      {budget.categoryName}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                      {budget.daysLeftInMonth} days left in month
                    </p>
                  </div>
                  {getStatusBadge(budget.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Progress */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Progress</span>
                    <span className="text-sm font-bold">
                      {budget.percentageUsed}%
                    </span>
                  </div>
                  <ProgressBar
                    used={budget.spentCents}
                    total={budget.limitCents}
                  />
                </div>

                {/* Amount Info */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs text-muted-foreground">Limit</p>
                    <p className="font-semibold text-sm">
                      {budget.limitFormatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Spent</p>
                    <p className="font-semibold text-sm text-red-600">
                      {budget.spentFormatted}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Remaining</p>
                    <p className="font-semibold text-sm text-green-600">
                      {budget.remainingFormatted}
                    </p>
                  </div>
                </div>

                {/* Prediction Card */}
                {budget.prediction && (
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="flex items-start gap-2">
                      <span className="text-lg">
                        {budget.prediction.trendIcon}
                      </span>
                      <div className="flex-1">
                        <p className="text-xs font-medium">
                          {budget.prediction.message}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Predicted: {budget.prediction.predictedSpendFormatted}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleViewDetails(budget)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      const original = budgets.find(
                        (b) => b.id === budget.budgetId,
                      );
                      if (original) handleEditBudget(original);
                    }}
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => {
                      const original = budgets.find(
                        (b) => b.id === budget.budgetId,
                      );
                      if (original)
                        handleDeleteClick(original, budget.categoryName);
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="text-center py-12">
          <p className="text-muted-foreground">No budgets created yet</p>
          <Button onClick={handleOpenDialog} variant="outline" className="mt-4">
            Create your first budget
          </Button>
        </Card>
      )}

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Budget" : "Create New Budget"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update your budget settings"
                : "Set up a new budget for a category"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <Select
                value={formData.categoryId}
                onValueChange={(v) =>
                  setFormData({ ...formData, categoryId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((cat: any) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Account</label>
              <Select
                value={formData.accountId}
                onValueChange={(v) =>
                  setFormData({ ...formData, accountId: v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts?.map((acc: any) => (
                    <SelectItem key={acc.id} value={acc.id}>
                      {acc.name} ({acc.currency})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Month</label>
              <Select
                value={formData.periodMonth}
                onValueChange={(v) =>
                  setFormData({ ...formData, periodMonth: v })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MONTH_OPTIONS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium">Budget Limit (₫)</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={formData.amountLimitCents / 100}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    amountLimitCents: Number(e.target.value) * 100,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Alert Threshold (%)</label>
              <Input
                type="number"
                placeholder="Alert at percentage"
                min="0"
                max="100"
                value={formData.alertThresholdPercent}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    alertThresholdPercent: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpenDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* DELETE CONFIRM */}
      <DeleteConfirmDialog
        open={deleteConfirmOpen}
        onOpenChange={setDeleteConfirmOpen}
        title="Delete Budget"
        description="Are you sure you want to delete this budget? This action cannot be undone."
        itemName={budgetToDeleteName}
        onConfirm={handleConfirmDelete}
        isLoading={loading}
      />

      {/* BUDGET DETAIL DIALOG */}
      <BudgetDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        budget={selectedDetailBudget}
        budgetData={selectedDetailBudgetData}
      />
    </div>
  );
}
