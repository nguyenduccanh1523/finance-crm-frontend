import { useState, useEffect } from "react";
import type { RecurringRule } from "@/lib/hooks/recurring-rules/useRecurringRules";
import { useRecurringRules } from "@/lib/hooks/recurring-rules/useRecurringRules";
import { useGetAccounts } from "@/lib/hooks/accounts/useAccounts";
import { CreateRecurringRuleForm } from "@/components/recurring-rules/CreateRecurringRuleForm";
import { RecurringRuleList } from "@/components/recurring-rules/RecurringRuleList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, X } from "lucide-react";

const CURRENCIES = ["VND", "USD", "EUR", "JPY"];

export function RecurringRulesPage() {
  const [rules, setRules] = useState<RecurringRule[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingRule, setEditingRule] = useState<RecurringRule | null>(null);
  const { getRecurringRules, loading } = useRecurringRules();
  const { accounts, fetchAccounts } = useGetAccounts();

  // Load recurring rules and accounts on mount (only once)
  useEffect(() => {
    const loadData = async () => {
      const [rulesData] = await Promise.all([
        getRecurringRules(),
        fetchAccounts(),
      ]);
      setRules(rulesData);
    };
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty deps - chỉ chạy 1 lần khi component mount

  const handleRefresh = async () => {
    const data = await getRecurringRules();
    setRules(data);
  };

  const handleCreateSuccess = async () => {
    await handleRefresh();
    setIsCreating(false);
    setEditingRule(null);
  };

  const handleEdit = (rule: RecurringRule) => {
    setEditingRule(rule);
    setIsCreating(true);
    // Scroll to form
    setTimeout(() => {
      const formElement = document.getElementById("recurring-rule-form");
      formElement?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingRule(null);
  };

  const handleDelete = (ruleId: string) => {
    setRules(rules.filter((r) => r.id !== ruleId));
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Recurring Rules</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1.5">
            Manage automatic recurring transactions daily, weekly, monthly, or
            yearly
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingRule(null);
            setIsCreating(!isCreating);
            setTimeout(() => {
              const formElement = document.getElementById(
                "recurring-rule-form",
              );
              formElement?.scrollIntoView({ behavior: "smooth" });
            }, 100);
          }}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          {isCreating && editingRule ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel Editing
            </>
          ) : isCreating ? (
            <>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="w-4 h-4 mr-2" />
              Create Rule
            </>
          )}
        </Button>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Total Rules
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rules.length}</div>
            <p className="text-xs text-gray-500 mt-1">Active recurring rules</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {rules.filter((r) => r.type === "INCOME").length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recurring income transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
              Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {rules.filter((r) => r.type === "EXPENSE").length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Recurring expense transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div id="recurring-rule-form" className="scroll-mt-4">
          <CreateRecurringRuleForm
            accounts={accounts.map((acc) => ({ id: acc.id, name: acc.name }))}
            currencies={CURRENCIES}
            editingRule={editingRule}
            onSuccess={handleCreateSuccess}
            onCancel={handleCancel}
          />
        </div>
      )}

      {/* Rules List */}
      {loading ? (
        <Card>
          <CardContent className="p-12 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          </CardContent>
        </Card>
      ) : (
        <RecurringRuleList
          rules={rules}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onRefresh={handleRefresh}
        />
      )}

      {/* Tips Card */}
      <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
        <CardHeader>
          <CardTitle className="text-base">💡 Usage Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-blue-900 dark:text-blue-300">
          <p>
            • <strong>Recurring Income:</strong> Monthly salary, periodic
            bonuses, etc.
          </p>
          <p>
            • <strong>Recurring Expenses:</strong> Rent, insurance, loan
            payments, etc.
          </p>
          <p>
            • <strong>Customization:</strong> You can edit the amount and next
            run date anytime
          </p>
          <p>
            • <strong>Automatic:</strong> Transactions will be automatically
            created on the correct date and time
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
