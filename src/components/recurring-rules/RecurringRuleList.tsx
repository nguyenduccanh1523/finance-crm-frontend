import { useState } from "react";
import type { RecurringRule } from "@/lib/hooks/recurring-rules/useRecurringRules";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Edit2,
  Trash2,
  Calendar,
  DollarSign,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  formatNextRunAtDisplay,
  getDetailedRRuleDescription,
} from "@/lib/utils/rrule";
import { useRecurringRules } from "@/lib/hooks/recurring-rules/useRecurringRules";

interface RecurringRuleListProps {
  rules: RecurringRule[];
  loading?: boolean;
  onEdit?: (rule: RecurringRule) => void;
  onDelete?: (ruleId: string) => void;
  onRefresh?: () => void;
}

export function RecurringRuleList({
  rules,
  loading = false,
  onEdit,
  onDelete,
  onRefresh,
}: RecurringRuleListProps) {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);
  const { deleteRecurringRule, loading: deleteLoading } = useRecurringRules();

  const handleDeleteClick = (ruleId: string) => {
    setSelectedRuleId(ruleId);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedRuleId) return;
    const success = await deleteRecurringRule(selectedRuleId);
    if (success) {
      setDeleteConfirmOpen(false);
      setSelectedRuleId(null);
      onDelete?.(selectedRuleId);
      onRefresh?.();
    }
  };

  if (rules.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <Calendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            No recurring rules yet
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-sm mt-2">
            Create your first recurring rule to start automatic transactions
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Recurring Rules</CardTitle>
          <CardDescription>Manage your automatic transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-slate-900">
                <TableRow>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Pattern</TableHead>
                  <TableHead>Next Run</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rules.map((rule) => {
                  const nextRunDate = new Date(rule.nextRunAt);
                  const isUpcoming =
                    nextRunDate.getTime() > new Date().getTime();

                  return (
                    <TableRow
                      key={rule.id}
                      className="hover:bg-gray-50 dark:hover:bg-slate-900"
                    >
                      {/* Type */}
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={
                            rule.type === "INCOME"
                              ? "bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-300 border-green-200 dark:border-green-900"
                              : "bg-red-50 dark:bg-red-950 text-red-700 dark:text-red-300 border-red-200 dark:border-red-900"
                          }
                        >
                          {rule.type === "INCOME" ? "Income" : "Expense"}
                        </Badge>
                      </TableCell>

                      {/* Amount */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="font-semibold">
                            {(rule.amountCents / 100).toLocaleString("vi-VN")}
                          </span>
                          <span className="text-xs text-gray-500">
                            {rule.currency}
                          </span>
                        </div>
                      </TableCell>

                      {/* RRULE */}
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="text-sm font-medium dark:text-gray-300">
                            {getDetailedRRuleDescription(rule.rrule)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 font-mono mt-1">
                            {rule.rrule}
                          </p>
                        </div>
                      </TableCell>

                      {/* Next Run Date */}
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                          <span className="text-sm dark:text-gray-300">
                            {formatNextRunAtDisplay(rule.nextRunAt)}
                          </span>
                        </div>
                      </TableCell>

                      {/* Status */}
                      <TableCell>
                        <Badge
                          variant={isUpcoming ? "default" : "secondary"}
                          className={
                            isUpcoming
                              ? "bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-300"
                          }
                        >
                          {isUpcoming ? "Scheduled" : "Expired"}
                        </Badge>
                      </TableCell>

                      {/* Actions */}
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit?.(rule)}
                            disabled={loading || deleteLoading}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteClick(rule.id)}
                            disabled={loading || deleteLoading}
                          >
                            {deleteLoading ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Delete Recurring Rule
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this recurring rule? This action
              cannot be undone. Future recurring transactions will not be
              created.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleteLoading && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Delete
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
