import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RRuleSelector } from "./RRuleSelector";
import { useRecurringRules } from "@/lib/hooks/recurring-rules/useRecurringRules";
import type { RecurringRule } from "@/lib/hooks/recurring-rules/useRecurringRules";
import { Loader2, AlertCircle, Check, Wallet } from "lucide-react";

const recurringRuleSchema = z.object({
  accountId: z.string().uuid("Please select an account"),
  type: z.enum(["INCOME", "EXPENSE"]),
  amountCents: z.number().int().positive("Amount must be greater than 0"),
  currency: z.string().min(1, "Please select a currency"),
  rrule: z.string().min(1, "Please select a recurrence pattern"),
  nextRunAt: z.string().min(1, "Please select next run date"),
});

type RecurringRuleFormValues = z.infer<typeof recurringRuleSchema>;

interface CreateRecurringRuleFormProps {
  accounts: Array<{ id: string; name: string }>;
  currencies: string[];
  editingRule?: RecurringRule | null;
  onSuccess?: (rule: RecurringRule) => void;
  onCancel?: () => void;
}

export function CreateRecurringRuleForm({
  accounts,
  currencies,
  editingRule,
  onSuccess,
  onCancel,
}: CreateRecurringRuleFormProps) {
  const { createRecurringRule, updateRecurringRule, loading, error } =
    useRecurringRules();
  const [successMessage, setSuccessMessage] = useState("");

  const form = useForm<RecurringRuleFormValues>({
    resolver: zodResolver(recurringRuleSchema),
    defaultValues: {
      accountId: "",
      type: "INCOME",
      amountCents: 0,
      currency: "VND",
      rrule: "",
      nextRunAt: new Date().toISOString().split("T")[0],
    },
  });

  // Load editing rule if provided
  useEffect(() => {
    if (editingRule) {
      form.reset({
        accountId: editingRule.accountId,
        type: editingRule.type,
        amountCents: editingRule.amountCents,
        currency: editingRule.currency,
        rrule: editingRule.rrule,
        nextRunAt: editingRule.nextRunAt.split("T")[0],
      });
    }
  }, [editingRule, form]);

  const onSubmit = async (data: RecurringRuleFormValues) => {
    try {
      setSuccessMessage("");

      if (editingRule) {
        // Only update changeable fields
        const result = await updateRecurringRule(editingRule.id, {
          amountCents: data.amountCents,
          rrule: data.rrule,
          nextRunAt: data.nextRunAt,
        });
        if (result) {
          setSuccessMessage("Recurring rule updated successfully!");
          setTimeout(() => onSuccess?.(result), 1500);
        }
      } else {
        // Create new
        const result = await createRecurringRule({
          accountId: data.accountId,
          type: data.type,
          amountCents: data.amountCents,
          currency: data.currency,
          rrule: data.rrule,
          nextRunAt: data.nextRunAt,
        });
        if (result) {
          setSuccessMessage("Recurring rule created successfully!");
          form.reset();
          setTimeout(() => onSuccess?.(result), 1500);
        }
      }
    } catch (err) {
      console.error("Form submit error:", err);
    }
  };

  // Format amount display
  const amountCents = form.getValues("amountCents");
  const formattedAmount = useMemo(() => {
    return amountCents ? (amountCents / 100).toLocaleString("vi-VN") : "0";
  }, [amountCents]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>
          {editingRule ? "Edit Recurring Rule" : "Create New Recurring Rule"}
        </CardTitle>
        <CardDescription>
          {editingRule
            ? "Update recurring transaction information"
            : "Set up automatic transactions daily, weekly, monthly, or yearly"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Account Display/Selection */}
              {editingRule ? (
                // Show account info when editing (read-only)
                <FormItem>
                  <FormLabel>Account</FormLabel>
                  <div className="flex items-center gap-2 pt-2">
                    <Wallet className="w-4 h-4 text-gray-500" />
                    <Badge
                      variant="secondary"
                      className="text-base py-1.5 px-3"
                    >
                      {accounts.find((acc) => acc.id === editingRule.accountId)
                        ?.name || "Unknown Account"}
                    </Badge>
                  </div>
                  <FormDescription>
                    Account cannot be changed when editing
                  </FormDescription>
                </FormItem>
              ) : (
                // Show account select when creating
                <FormField
                  control={form.control}
                  name="accountId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Account</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading || !!editingRule}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an account..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accounts.length > 0 ? (
                            accounts.map((acc) => (
                              <SelectItem key={acc.id} value={acc.id}>
                                {acc.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              No accounts available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Type Display/Selection - Read-only if editing */}
              {editingRule ? (
                <FormItem>
                  <FormLabel>Transaction Type</FormLabel>
                  <div className="pt-2">
                    <Badge
                      variant={
                        editingRule.type === "INCOME"
                          ? "default"
                          : "destructive"
                      }
                      className="text-base py-1.5 px-3"
                    >
                      {editingRule.type === "INCOME" ? "Income" : "Expense"}
                    </Badge>
                  </div>
                  <FormDescription>
                    Type cannot be changed when editing
                  </FormDescription>
                </FormItem>
              ) : (
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading || !!editingRule}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="INCOME">Income</SelectItem>
                          <SelectItem value="EXPENSE">Expense</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Amount */}
              <FormField
                control={form.control}
                name="amountCents"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount (VND)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value) || 0)
                          }
                          disabled={loading}
                          className="pr-16"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                          {formattedAmount}
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Enter amount in cents (e.g: 5000000 = 50,000 VND)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Currency Display/Selection - Read-only if editing */}
              {editingRule ? (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <div className="pt-2">
                    <Badge
                      variant="outline"
                      className="text-base font-mono py-1.5 px-3"
                    >
                      {editingRule.currency}
                    </Badge>
                  </div>
                  <FormDescription>
                    Currency cannot be changed when editing
                  </FormDescription>
                </FormItem>
              ) : (
                <FormField
                  control={form.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={loading || !!editingRule}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((curr) => (
                            <SelectItem key={curr} value={curr}>
                              {curr}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Next Run Date */}
              <FormField
                control={form.control}
                name="nextRunAt"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Next Run Date</FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                        disabled={loading}
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </FormControl>
                    <FormDescription>
                      Transaction will automatically run from this date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* RRULE Selector */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-semibold">Recurrence Pattern</h3>
              <FormField
                control={form.control}
                name="rrule"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RRuleSelector
                        value={field.value}
                        onChange={(rrule) => field.onChange(rrule)}
                        disabled={loading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Error Alert */}
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 rounded-md flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  {error}
                </p>
              </div>
            )}

            {/* Success Message */}
            {successMessage && (
              <div className="p-3 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-900 rounded-md flex gap-2">
                <Check className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-green-700 dark:text-green-300">
                  {successMessage}
                </p>
              </div>
            )}

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                {editingRule ? "Update" : "Create Rule"}
              </Button>
              {onCancel && !loading && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
