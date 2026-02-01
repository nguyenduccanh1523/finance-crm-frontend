"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { X } from "lucide-react";
import { ENV } from "@/app/config/env";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  PaymentMethodSelector,
  type PaymentMethod,
} from "./PaymentMethodSelector";
import { StripeCardForm } from "./StripeCardForm";
import {
  useBilling,
  type SubscriptionData,
} from "@/lib/hooks/billing/useBilling";

interface PaymentDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  plan: {
    name: string;
    price_monthly: number;
    price_annual: number;
  };
  planCode: "starter" | "pro" | "enterprise";
  interval: "MONTH" | "YEAR";
  scope: "PERSONAL" | "ORG";
  orgId?: string;
}

export function PaymentDrawer({
  isOpen,
  onClose,
  plan,
  planCode,
  interval,
  scope,
  orgId,
}: PaymentDrawerProps) {
  const { t } = useTranslation();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { getSetupIntent } = useBilling();
  const setupIntentCalledRef = useRef(false);

  console.log("pk:", ENV.STRIPE_PUBLISHABLE_KEY);
  console.log("clientSecret:", clientSecret);

  // Memoize stripePromise
  const stripePromise = useMemo(
    () => loadStripe(ENV.STRIPE_PUBLISHABLE_KEY),
    [],
  );

  const priceDisplay =
    plan.price_monthly === 0
      ? "Free"
      : interval === "MONTH"
        ? `$${plan.price_monthly}/${t("billing.month", "month")}`
        : `$${plan.price_annual}/${t("billing.year", "year")}`;

  // Fetch setup intent khi drawer mở
  useEffect(() => {
    if (!isOpen) {
      setClientSecret(null);
      setupIntentCalledRef.current = false; // Reset flag khi đóng
      return;
    }

    // Prevent double call nếu đã gọi rồi
    if (setupIntentCalledRef.current) {
      return;
    }

    setupIntentCalledRef.current = true; // Mark as called

    const fetchSetupIntent = async () => {
      setLoading(true);
      const subscriptionData: SubscriptionData = {
        planCode,
        interval,
        scope,
        orgId,
      };

      const result = await getSetupIntent(subscriptionData);
      if (result) {
        setClientSecret(result.clientSecret);
      } else {
        // For development: use a dummy clientSecret that bypasses Stripe iframe requirement
        console.warn("Failed to get setup intent from server, using test mode");
        setClientSecret("test_mode_for_development");
      }
      setLoading(false);
    };

    fetchSetupIntent();
  }, [isOpen, planCode, interval, scope, orgId, getSetupIntent]);

  const handlePaymentSuccess = () => {
    onClose();
    // TODO: Redirect hoặc show success message
  };

  const handlePaymentError = (error: string) => {
    // Error sẽ được hiển thị trong form
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
        <DialogHeader>
          <div className="flex items-start justify-between w-full pr-8">
            <div className="space-y-2 flex-1">
              <DialogTitle className="text-2xl">
                {t("billing.payment.checkoutTitle", "Complete Your Purchase")}
              </DialogTitle>
              <DialogDescription>
                {plan.name} - {priceDisplay}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto custom-scroll px-0.5">
          <div className="space-y-6 py-6 pr-2">
            {/* Order Summary */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {plan.name}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {priceDisplay}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600 dark:text-gray-400">
                  {t("billing.payment.interval", "Billing Period")}
                </span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {interval === "MONTH"
                    ? t("billing.payment.monthly", "Monthly")
                    : t("billing.payment.annual", "Annual")}
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <PaymentMethodSelector
              selected={paymentMethod}
              onSelect={setPaymentMethod}
            />

            {/* Loading State */}
            {loading && paymentMethod === "card" && (
              <div className="flex flex-col items-center justify-center py-12 space-y-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t("billing.payment.loadingForm", "Loading payment form...")}
                </p>
              </div>
            )}

            {/* Payment Form - Show when card method selected AND clientSecret loaded */}
            {paymentMethod === "card" && clientSecret && !loading && (
              <>
                {clientSecret === "test_mode_for_development" ? (
                  // Fallback form for testing when Stripe fails
                  <div className="space-y-4 border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                    <p className="text-sm text-yellow-800 dark:text-yellow-200">
                      ⚠️ Development Mode: Card form not loaded. Please
                      implement backend setup-intent endpoint.
                    </p>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Card Holder Name
                        </label>
                        <input
                          type="text"
                          placeholder="John Doe"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="john@example.com"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Card Number
                        </label>
                        <input
                          type="text"
                          placeholder="4242 4242 4242 4242"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  // Real Stripe form
                  <Elements
                    stripe={stripePromise}
                    options={{
                      clientSecret,
                    }}
                  >
                    <StripeCardForm
                      subscriptionData={{
                        planCode,
                        interval,
                        scope,
                        orgId,
                      }}
                      clientSecret={clientSecret}
                      onSuccess={handlePaymentSuccess}
                      onError={handlePaymentError}
                    />
                  </Elements>
                )}
              </>
            )}

            {/* Security Note */}
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {t(
                "billing.payment.securityNote",
                "🔒 Your payment information is encrypted and secure",
              )}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
