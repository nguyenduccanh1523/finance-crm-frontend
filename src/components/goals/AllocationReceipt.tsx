import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowDownLeft, ArrowUpRight, Check, AlertCircle } from "lucide-react";

export interface AllocationReceiptProps {
  type: "allocate" | "withdraw";
  goalName: string;
  accountName?: string;
  amount: number;
  balance?: number;
  newBalance?: number;
  currency?: string;
  onAmountChange?: (amountCents: number) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function AllocationReceipt({
  type,
  goalName,
  accountName,
  amount,
  balance,
  newBalance,
  currency = "VND",
  onAmountChange,
  onConfirm,
  onCancel,
  isLoading = false,
}: AllocationReceiptProps) {
  const [showReceipt, setShowReceipt] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  // Reset form when amount becomes 0 or when component mounts with 0 amount
  useEffect(() => {
    if (amount === 0) {
      setShowReceipt(false);
      setInputValue("");
    }
  }, [amount]);

  const isAllocate = type === "allocate";
  const icon = isAllocate ? (
    <ArrowDownLeft className="w-6 h-6" />
  ) : (
    <ArrowUpRight className="w-6 h-6" />
  );
  const bgColor = isAllocate
    ? "bg-green-500/10 border-green-500/20"
    : "bg-blue-500/10 border-blue-500/20";
  const textColor = isAllocate ? "text-green-700" : "text-blue-700";
  const titleText = isAllocate
    ? `Allocate to ${goalName}`
    : `Withdraw from ${goalName}`;
  const descText = isAllocate
    ? "Transfer money to this goal"
    : "Withdraw money from this goal";

  if (showReceipt) {
    return (
      <Card className={`${bgColor} border-2`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className={`p-2 rounded-lg ${textColor} bg-white/50`}>
              {icon}
            </div>
            Receipt
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Transaction Details */}
          <div className="space-y-3 bg-white dark:bg-slate-950 p-4 rounded-lg">
            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Transaction Type</span>
              <span className="font-medium">
                {isAllocate ? "Allocation" : "Withdrawal"}
              </span>
            </div>

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">
                {isAllocate ? "To Goal" : "From Goal"}
              </span>
              <span className="font-medium">{goalName}</span>
            </div>

            {accountName && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">
                  {isAllocate ? "From Account" : "To Account"}
                </span>
                <span className="font-medium">{accountName}</span>
              </div>
            )}

            <div className="flex justify-between border-b pb-2">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-lg">
                {amount.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{" "}
                {currency}
              </span>
            </div>

            {balance !== undefined && (
              <div className="flex justify-between border-b pb-2">
                <span className="text-muted-foreground">Previous Balance</span>
                <span className="font-medium">
                  {balance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {currency}
                </span>
              </div>
            )}

            {newBalance !== undefined && (
              <div className="flex justify-between pt-2 border-t-2 font-bold text-lg">
                <span className={textColor}>New Balance</span>
                <span className={textColor}>
                  {newBalance.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}{" "}
                  {currency}
                </span>
              </div>
            )}
          </div>

          {/* Warning Message */}
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg flex gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-100">
              Please review the details carefully before confirming.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowReceipt(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Back
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`flex-1 gap-2 ${
                isAllocate
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {isLoading ? (
                <>Confirming...</>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Confirm {isAllocate ? "Allocation" : "Withdrawal"}
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleAmountInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputStr = e.target.value;
    setInputValue(inputStr);

    // Update parent with input value directly (no multiplication)
    if (inputStr === "" || inputStr === ".") {
      if (onAmountChange) {
        onAmountChange(0);
      }
    } else {
      const numValue = Number(inputStr);
      if (!isNaN(numValue) && numValue > 0) {
        if (onAmountChange) {
          onAmountChange(numValue);
        }
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div
            className={`p-3 rounded-lg ${
              isAllocate
                ? "bg-green-100 dark:bg-green-900"
                : "bg-blue-100 dark:bg-blue-900"
            }`}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-xl font-bold">{titleText}</h3>
            <p className="text-sm text-muted-foreground">{descText}</p>
          </div>
        </div>
      </div>

      {/* Input Section */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Amount ({currency})</CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            type="number"
            min="0"
            step="0.01"
            placeholder="Enter amount"
            value={inputValue}
            onChange={handleAmountInput}
            disabled={isLoading}
            className="text-2xl font-bold py-6"
          />
          {amount > 0 && (
            <p className="text-sm text-muted-foreground mt-2">
              Amount:{" "}
              {amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              {currency}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Warning */}
      {amount > 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-3 rounded-lg flex gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-700 dark:text-amber-100">
            Please review the details carefully before confirming.
          </p>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="flex-1"
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          onClick={() => setShowReceipt(true)}
          disabled={amount <= 0 || isLoading}
          className={`flex-1 gap-2 ${
            isAllocate
              ? "bg-green-600 hover:bg-green-700"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {icon}
          Review {isAllocate ? "Allocation" : "Withdrawal"}
        </Button>
      </div>
    </div>
  );
}
