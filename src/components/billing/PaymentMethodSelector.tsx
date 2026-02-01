"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { CreditCard, AlertCircle } from "lucide-react";

export type PaymentMethod = "card" | "momo" | "zalopay" | "shopeepay";

interface PaymentMethodSelectorProps {
  selected: PaymentMethod;
  onSelect: (method: PaymentMethod) => void;
}

const PAYMENT_METHODS: Array<{
  id: PaymentMethod;
  label: string;
  icon: string;
  badge?: string;
  description?: string;
}> = [
  {
    id: "card",
    label: "Credit/Debit Card",
    icon: "💳",
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "momo",
    label: "MoMo",
    icon: "🔴",
    badge: "coming-soon",
    description: "Mobile wallet payment",
  },
  {
    id: "zalopay",
    label: "Zalopay",
    icon: "💙",
    badge: "coming-soon",
    description: "Digital wallet payment",
  },
  {
    id: "shopeepay",
    label: "ShopeePay",
    icon: "🛍️",
    badge: "coming-soon",
    description: "E-commerce wallet",
  },
];

export function PaymentMethodSelector({
  selected,
  onSelect,
}: PaymentMethodSelectorProps) {
  const { t } = useTranslation();
  const [showAlert, setShowAlert] = useState(false);

  const handleSelect = (method: PaymentMethod) => {
    if (method !== "card") {
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000);
      return;
    }
    onSelect(method);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t("billing.payment.selectMethod", "Select Payment Method")}
      </h3>

      {/* Alert for coming soon */}
      {showAlert && (
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700 dark:text-blue-300">
            {t(
              "billing.payment.comingSoon",
              "This payment method is coming soon. Please use Credit/Debit Card for now.",
            )}
          </p>
        </div>
      )}

      {/* Payment Methods Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {PAYMENT_METHODS.map((method) => (
          <button
            key={method.id}
            onClick={() => handleSelect(method.id)}
            disabled={method.id !== "card"}
            className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
              selected === method.id
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
            } ${
              method.id !== "card"
                ? "opacity-60 cursor-not-allowed"
                : "cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
            }`}
          >
            {/* Badge */}
            {method.badge === "coming-soon" && (
              <div className="absolute top-2 right-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 text-xs px-2 py-1 rounded-full font-semibold">
                {t("billing.payment.comingSoon", "Coming Soon")}
              </div>
            )}

            <div className="text-left space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-2xl">{method.icon}</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {method.label}
                </span>
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {method.description}
              </p>
            </div>

            {/* Checkmark */}
            {selected === method.id && (
              <div className="absolute bottom-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                ✓
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
