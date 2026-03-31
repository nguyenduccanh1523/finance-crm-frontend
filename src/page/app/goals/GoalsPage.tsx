import { useEffect, useState, useRef, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Zap,
  ChevronRight,
  Target,
  BarChart3,
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
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { GoalTransactionHistory } from "@/components/goals/GoalTransactionHistory";
import { AllocationReceipt } from "@/components/goals/AllocationReceipt";
import {
  useGoals,
  type Goal,
  type GoalAnalytic,
} from "@/lib/hooks/goals/useGoals";
import { useGetAccounts } from "@/lib/hooks/accounts/useAccounts";

interface FormData {
  name: string;
  description: string;
  targetAmountCents: number;
  targetDate: string;
  accountId: string;
  currentAmountCents: number;
}

interface TransactionData {
  amountCents: number;
}

function getGoalStatus(analytic: GoalAnalytic) {
  switch (analytic.status) {
    case "ON_TRACK":
      return {
        badge: <Badge className="bg-blue-500/20 text-blue-700">On Track</Badge>,
        icon: "📊",
      };
    case "AHEAD":
      return {
        badge: <Badge className="bg-green-500/20 text-green-700">Ahead</Badge>,
        icon: "🚀",
      };
    case "BEHIND":
      return {
        badge: <Badge className="bg-amber-500/20 text-amber-700">Behind</Badge>,
        icon: "⚠️",
      };
    default:
      return { badge: null, icon: "📌" };
  }
}

function ProgressBar({
  current,
  target,
  animated = true,
}: {
  current: number;
  target: number;
  animated?: boolean;
}) {
  const percentage = Math.min((current / target) * 100, 100);
  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
      <div
        className={`bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all ${animated ? "duration-500" : ""}`}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

export function GoalsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [goalToDeleteName, setGoalToDeleteName] = useState<string>("");
  const [goalsAnalytics, setGoalsAnalytics] = useState<GoalAnalytic[]>([]);
  const [selectedGoalForTransaction, setSelectedGoalForTransaction] =
    useState<GoalAnalytic | null>(null);
  const [selectedGoalForHistory, setSelectedGoalForHistory] =
    useState<GoalAnalytic | null>(null);
  const hasInitialized = useRef(false);
  const [transactionType, setTransactionType] = useState<
    "allocate" | "withdraw" | null
  >(null);
  const [allocateDrawerOpen, setAllocateDrawerOpen] = useState(false);
  const [withdrawDrawerOpen, setWithdrawDrawerOpen] = useState(false);
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    targetAmountCents: 0,
    targetDate: "",
    accountId: "",
    currentAmountCents: 0,
  });

  const [transactionData, setTransactionData] = useState<TransactionData>({
    amountCents: 0,
  });

  const {
    loading,
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    allocateToGoal,
    withdrawFromGoal,
    getGoalsAnalytics,
  } = useGoals();
  const { accounts = [] } = useGetAccounts();
  const { showSuccess, showError } = useAppToast();

  const [goals, setGoals] = useState<Goal[]>([]);

  const fetchGoals = useCallback(async () => {
    const data = await getGoals();
    setGoals(data);

    // Fetch analytics
    const analytics = await getGoalsAnalytics();
    if (analytics) {
      setGoalsAnalytics(analytics);
    }
  }, [getGoals, getGoalsAnalytics]);

  // Initial fetch
  useEffect(() => {
    if (!hasInitialized.current) {
      hasInitialized.current = true;
      fetchGoals();
    }
  }, [fetchGoals]);

  const filteredGoals = goalsAnalytics.filter((goal) =>
    goal.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleOpenDialog = () => {
    setIsEditMode(false);
    setSelectedGoal(null);
    setFormData({
      name: "",
      description: "",
      targetAmountCents: 0,
      targetDate: "",
      accountId: accounts?.[0]?.id || "",
      currentAmountCents: 0,
    });
    setIsOpenDialog(true);
  };

  const handleEditGoal = (goal: Goal) => {
    setIsEditMode(true);
    setSelectedGoal(goal);
    setFormData({
      name: goal.name,
      description: goal.description || "",
      targetAmountCents: goal.targetAmountCents,
      targetDate: goal.targetDate,
      accountId: goal.accountId,
      currentAmountCents: goal.currentAmountCents,
    });
    setIsOpenDialog(true);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.targetDate || !formData.accountId) {
      showError("Please fill in all required fields");
      return;
    }

    if (isEditMode && selectedGoal) {
      const success = await updateGoal(selectedGoal.id, {
        name: formData.name,
        description: formData.description,
        targetAmountCents: formData.targetAmountCents,
        targetDate: formData.targetDate,
      });
      if (success) {
        await fetchGoals();
        setIsOpenDialog(false);
      }
    } else {
      const result = await createGoal(formData);
      if (result) {
        await fetchGoals();
        setIsOpenDialog(false);
      }
    }
  };

  const handleDeleteClick = (goal: Goal, goalName: string) => {
    setGoalToDelete(goal);
    setGoalToDeleteName(goalName);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (goalToDelete) {
      const success = await deleteGoal(goalToDelete.id);
      if (success) {
        await fetchGoals();
        setDeleteConfirmOpen(false);
        setGoalToDelete(null);
      }
    }
  };

  const handleAllocate = async () => {
    if (!selectedGoalForTransaction) return;

    const original = goals.find(
      (g) => g.id === selectedGoalForTransaction.goalId,
    );
    if (!original) return;

    const result = await allocateToGoal(original.id, transactionData);
    if (result) {
      await fetchGoals();
      setSelectedGoalForTransaction(null);
      setTransactionType(null);
      setTransactionData({ amountCents: 0 });
    }
  };

  const handleWithdraw = async () => {
    if (!selectedGoalForTransaction) return;

    const original = goals.find(
      (g) => g.id === selectedGoalForTransaction.goalId,
    );
    if (!original) return;

    const result = await withdrawFromGoal(original.id, transactionData);
    if (result) {
      await fetchGoals();
      setSelectedGoalForTransaction(null);
      setTransactionType(null);
      setTransactionData({ amountCents: 0 });
    }
  };

  // Total goals summary
  const totalGoals = filteredGoals.length;
  const aheadGoals = filteredGoals.filter((g) => g.status === "AHEAD").length;
  const behindGoals = filteredGoals.filter((g) => g.status === "BEHIND").length;

  return (
    <div className="flex flex-col gap-8">
      {/* HEADER */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">
          🎯 Financial Goals
        </h1>
        <p className="text-muted-foreground">
          Track and manage your financial objectives with smart insights
        </p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-indigo-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Goals in progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ahead on Track
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {aheadGoals}
              <span className="text-lg ml-1">🚀</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Exceeding progress
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Behind Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">
              {behindGoals}
              <span className="text-lg ml-1">⚠️</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Need attention</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {totalGoals - aheadGoals - behindGoals}
              <span className="text-lg ml-1">✅</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">On Track</p>
          </CardContent>
        </Card>
      </div>

      {/* CONTROLS */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search goals..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={handleOpenDialog}
          className="gap-2 bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          New Goal
        </Button>
      </div>

      {/* GOALS CARDS */}
      {filteredGoals.length > 0 ? (
        <div className="space-y-4">
          {filteredGoals.map((goal) => {
            const goalStatus = getGoalStatus(goal);
            return (
              <Card
                key={goal.goalId}
                className="hover:shadow-lg transition-shadow overflow-hidden"
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-3xl">{goalStatus.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-lg">{goal.name}</CardTitle>
                          {goalStatus.badge}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Target: {goal.estimatedCompletionDate} •{" "}
                          {goal.daysLeft} days left
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const original = goals.find(
                            (g) => g.id === goal.goalId,
                          );
                          if (original) handleEditGoal(original);
                        }}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          const original = goals.find(
                            (g) => g.id === goal.goalId,
                          );
                          if (original) handleDeleteClick(original, goal.name);
                        }}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Section */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Progress</span>
                        <span className="text-sm font-bold">
                          {goal.percentageAchieved}%
                        </span>
                      </div>
                      <ProgressBar
                        current={parseInt(
                          goal.currentAmountFormatted.replace(/[^\d.-]/g, ""),
                        )}
                        target={parseInt(
                          goal.targetAmountFormatted.replace(/[^\d.-]/g, ""),
                        )}
                      />
                    </div>

                    {/* Amount Info */}
                    <div className="grid grid-cols-4 gap-3 text-center">
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-xs text-muted-foreground">Current</p>
                        <p className="font-semibold text-sm">
                          {goal.currentAmountFormatted}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-xs text-muted-foreground">Target</p>
                        <p className="font-semibold text-sm">
                          {goal.targetAmountFormatted}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-xs text-muted-foreground">Needed</p>
                        <p className="font-semibold text-sm">
                          {goal.amountNeededFormatted}
                        </p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <p className="text-xs text-muted-foreground">
                          Velocity
                        </p>
                        <p className="font-semibold text-sm">
                          {goal.velocityPerDayFormatted}
                        </p>
                      </div>
                    </div>

                    {/* Motivational Message */}
                    <div className="bg-indigo-50 dark:bg-indigo-950 rounded-lg p-3 border-l-4 border-indigo-500">
                      <p className="text-sm text-indigo-900 dark:text-indigo-100">
                        💡 {goal.motivationalMessage}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2 flex-wrap">
                      <Drawer
                        open={
                          allocateDrawerOpen &&
                          selectedGoalForTransaction?.goalId === goal.goalId
                        }
                        onOpenChange={(open) => {
                          setAllocateDrawerOpen(open);
                          if (open) {
                            setSelectedGoalForTransaction(goal);
                            setTransactionType("allocate");
                            setTransactionData({ amountCents: 0 });
                          } else {
                            setTransactionData({ amountCents: 0 });
                          }
                        }}
                      >
                        <DrawerTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2"
                          >
                            <Zap className="w-4 h-4" />
                            Allocate
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Allocate to {goal.name}</DrawerTitle>
                            <DrawerDescription>
                              Transfer money from account to this goal
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="px-4 py-6">
                            <AllocationReceipt
                              type="allocate"
                              goalName={goal.name}
                              amount={transactionData.amountCents}
                              currency="VND"
                              isLoading={loading}
                              onAmountChange={(amountCents) =>
                                setTransactionData({ amountCents })
                              }
                              onCancel={() => setAllocateDrawerOpen(false)}
                              onConfirm={() => {
                                handleAllocate();
                                setAllocateDrawerOpen(false);
                              }}
                            />
                          </div>
                        </DrawerContent>
                      </Drawer>

                      <Drawer
                        open={
                          withdrawDrawerOpen &&
                          selectedGoalForTransaction?.goalId === goal.goalId
                        }
                        onOpenChange={(open) => {
                          setWithdrawDrawerOpen(open);
                          if (open) {
                            setSelectedGoalForTransaction(goal);
                            setTransactionType("withdraw");
                            setTransactionData({ amountCents: 0 });
                          } else {
                            setTransactionData({ amountCents: 0 });
                          }
                        }}
                      >
                        <DrawerTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2"
                          >
                            <ChevronRight className="w-4 h-4" />
                            Withdraw
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Withdraw from {goal.name}</DrawerTitle>
                            <DrawerDescription>
                              Transfer money from goal back to account
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="px-4 py-6">
                            <AllocationReceipt
                              type="withdraw"
                              goalName={goal.name}
                              amount={transactionData.amountCents}
                              currency="VND"
                              isLoading={loading}
                              onAmountChange={(amountCents) =>
                                setTransactionData({ amountCents })
                              }
                              onCancel={() => setWithdrawDrawerOpen(false)}
                              onConfirm={() => {
                                handleWithdraw();
                                setWithdrawDrawerOpen(false);
                              }}
                            />
                          </div>
                        </DrawerContent>
                      </Drawer>

                      <Drawer
                        open={
                          historyDrawerOpen &&
                          selectedGoalForHistory?.goalId === goal.goalId
                        }
                        onOpenChange={(open) => {
                          setHistoryDrawerOpen(open);
                          if (open) {
                            setSelectedGoalForHistory(goal);
                          }
                        }}
                      >
                        <DrawerTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 gap-2"
                          >
                            <BarChart3 className="w-4 h-4" />
                            History
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="max-h-[80vh] overflow-y-auto">
                          <DrawerHeader>
                            <DrawerTitle>Transaction History</DrawerTitle>
                            <DrawerDescription>
                              View all allocations and withdrawals for this goal
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="px-4 pb-6">
                            {selectedGoalForHistory && (
                              <GoalTransactionHistory
                                goalId={selectedGoalForHistory.goalId}
                                goalName={selectedGoalForHistory.name}
                              />
                            )}
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="text-center py-12">
          <Target className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No goals created yet</p>
          <Button onClick={handleOpenDialog} variant="outline" className="mt-4">
            Create your first goal
          </Button>
        </Card>
      )}

      {/* CREATE/EDIT DIALOG */}
      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Goal" : "Create New Goal"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update your financial goal details"
                : "Set up a new financial objective"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Goal Name *</label>
              <Input
                placeholder="e.g., MacBook, Vacation"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <Input
                placeholder="Optional description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Account *</label>
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
              <label className="text-sm font-medium">Target Amount (₫) *</label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={formData.targetAmountCents / 100}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    targetAmountCents: Number(e.target.value) * 100,
                  })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Target Date *</label>
              <Input
                type="date"
                value={formData.targetDate}
                onChange={(e) =>
                  setFormData({ ...formData, targetDate: e.target.value })
                }
              />
            </div>

            <div>
              <label className="text-sm font-medium">Starting Amount (₫)</label>
              <Input
                type="number"
                placeholder="Current amount"
                value={formData.currentAmountCents / 100}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    currentAmountCents: Number(e.target.value) * 100,
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
              className="bg-indigo-600 hover:bg-indigo-700"
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
        title="Delete Goal"
        description="Are you sure you want to delete this goal? This action cannot be undone."
        itemName={goalToDeleteName}
        onConfirm={handleConfirmDelete}
        isLoading={loading}
      />
    </div>
  );
}
