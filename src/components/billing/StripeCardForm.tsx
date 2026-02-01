"use client";

import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useTranslation } from "react-i18next";
import {
  useBilling,
  type SubscriptionData,
} from "@/lib/hooks/billing/useBilling";
import { AppButton } from "@/components/common/AppButton";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface StripeCardFormProps {
  subscriptionData: SubscriptionData;
  clientSecret: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

// Form validation schema
const cardFormSchema = z.object({
  cardholderName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: "16px",
      color: "#ebebeb",
      "::placeholder": {
        color: "#9ca3af",
      },
      fontFamily: '"system-ui", "Segoe UI"',
      iconColor: "#3b82f6",
      backgroundColor: "transparent",
    },
    invalid: {
      color: "#dc2626",
      iconColor: "#dc2626",
    },
  },
  hidePostalCode: true,
};

export function StripeCardForm({
  subscriptionData,
  clientSecret,
  onSuccess,
  onError,
}: StripeCardFormProps) {
  const { t } = useTranslation();
  const stripe = useStripe();
  const elements = useElements();
  const {
    createSubscription,
    pollSubscriptionInfo,
    loading: billingLoading,
  } = useBilling();

  const [cardError, setCardError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      cardholderName: "",
      email: "",
    },
  });

  const handleCardChange = useCallback((event: any) => {
    if (event.error) {
      setCardError(event.error.message);
    } else {
      setCardError(null);
    }
  }, []);

  const handleSubmit = useCallback(
    async (values: CardFormValues) => {
      if (!stripe || !elements) {
        setCardError("Stripe not loaded");
        return;
      }

      setProcessing(true);
      setCardError(null);

      try {
        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
          throw new Error("Card element not found");
        }

        // Bước 1: Confirm card setup
        const { setupIntent, error: setupError } =
          await stripe.confirmCardSetup(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: values.cardholderName,
                email: values.email,
              },
            },
          });

        if (setupError) {
          setCardError(setupError.message || "Card setup failed");
          onError?.(setupError.message || "Card setup failed");
          return;
        }

        if (!setupIntent.payment_method) {
          throw new Error("No payment method returned");
        }

        const paymentMethodId = setupIntent.payment_method as string;

        // Bước 2: Tạo subscription
        const subscriptionResult = await createSubscription(
          subscriptionData,
          paymentMethodId,
        );

        if (!subscriptionResult) {
          setCardError("Failed to create subscription");
          return;
        }

        // Bước 3: Xử lý paymentClientSecret nếu có
        if (subscriptionResult.paymentClientSecret) {
          const { paymentIntent, error: paymentError } =
            await stripe.confirmCardPayment(
              subscriptionResult.paymentClientSecret,
              {
                payment_method: paymentMethodId,
              },
            );

          if (paymentError) {
            setCardError(paymentError.message || "Payment failed");
            onError?.(paymentError.message || "Payment failed");
            return;
          }
        }

        // Bước 4: Poll subscription info
        const finalInfo = await pollSubscriptionInfo(subscriptionData);

        if (finalInfo?.status === "active") {
          onSuccess?.();
        } else {
          setCardError("Subscription may be pending, please check later");
        }
      } catch (err: any) {
        const msg = err.message || "Payment processing failed";
        setCardError(msg);
        onError?.(msg);
      } finally {
        setProcessing(false);
      }
    },
    [
      stripe,
      elements,
      clientSecret,
      subscriptionData,
      createSubscription,
      pollSubscriptionInfo,
      onSuccess,
      onError,
    ],
  );

  const isLoading = processing || billingLoading;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-600 rounded-xl p-4 mb-6 shadow-lg">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {t("billing.payment.title", "Payment Details")}
          </h3>
          <p className="text-blue-100 text-sm mt-1">
            {t("billing.payment.subtitle", "Secure payment processing")}
          </p>
        </div>

        {/* Cardholder Name */}
        <FormField
          control={form.control}
          name="cardholderName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {t("billing.payment.cardholderName", "Cardholder Name")}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="John Doe"
                  disabled={isLoading}
                  className="border-2 border-blue-200 dark:border-blue-800 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 bg-blue-50 dark:bg-blue-950/30 text-foreground transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Email */}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {t("billing.payment.email", "Email Address")}
              </FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  disabled={isLoading}
                  className="border-2 border-indigo-200 dark:border-indigo-800 focus:border-indigo-500 dark:focus:border-indigo-400 focus:ring-2 focus:ring-indigo-300 dark:focus:ring-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-foreground transition-all duration-200"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Card Element */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            {t("billing.payment.cardDetails", "Card Details")}
          </Label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-xl opacity-75 group-hover:opacity-100 blur transition duration-1000"></div>
            <div className="relative p-5 border-2 border-transparent bg-white dark:bg-slate-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-200">
              <CardElement
                options={CARD_ELEMENT_OPTIONS}
                onChange={handleCardChange}
              />
            </div>
          </div>
          {cardError && (
            <p className="text-xs font-medium text-red-600 dark:text-red-400 animate-pulse">
              {cardError}
            </p>
          )}
        </div>

        {/* Error Message */}
        {cardError && (
          <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/40 dark:to-pink-950/40 border-2 border-red-300 dark:border-red-800 rounded-lg shadow-md">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p className="text-sm font-medium text-red-700 dark:text-red-300">
                {cardError}
              </p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4 px-2">
          <AppButton
            type="submit"
            disabled={!stripe || isLoading}
            loading={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 dark:from-blue-600 dark:via-indigo-600 dark:to-purple-600 hover:shadow-lg hover:shadow-blue-500/50 dark:hover:shadow-blue-600/50 text-white font-bold text-sm py-2.5 rounded-lg transition-all duration-200"
          >
            {isLoading
              ? t("billing.payment.processing", "Processing...")
              : t("billing.payment.payNow", "Pay Now")}
          </AppButton>
        </div>

        {/* Helper Text */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3">
          <p className="text-xs font-medium text-green-700 dark:text-green-400 text-center flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            {t(
              "billing.payment.securePayment",
              "Your payment is secure and encrypted",
            )}
          </p>
        </div>
      </form>
    </Form>
  );
}
