"use client";

import { Check } from "lucide-react";

export interface TierCardProps {
  plan: {
    name: string;
    description: string;
    price_monthly: number;
    price_annual: number;
    cta: string;
    features: string[];
    highlighted?: boolean;
  };
  priceLabel: string;
  alternativePrice: string;
  icon: React.ReactNode;
  planCode?: "starter" | "pro" | "enterprise" | "community";
  interval?: "MONTH" | "YEAR";
  onGetStarted?: (planCode: string, interval: string) => void;
}

export function TierCard({
  plan,
  priceLabel,
  alternativePrice,
  icon,
  planCode = "starter",
  interval = "MONTH",
  onGetStarted,
}: TierCardProps) {
  const isHighlighted = plan.highlighted === true;

  return (
    <div
      className={`group relative rounded-2xl transition-all duration-500 transform ${
        isHighlighted
          ? "lg:scale-105 md:scale-100 hover:shadow-2xl"
          : "hover:shadow-xl"
      }`}
    >
      {/* GRADIENT BORDER EFFECT */}
      <div
        className={`absolute inset-0 rounded-2xl transition-all duration-300 ${
          isHighlighted
            ? "bg-gradient-to-br from-blue-500/20 to-indigo-500/20"
            : "bg-transparent"
        }`}
      />

      {/* HIGHLIGHT BADGE */}
      {isHighlighted && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 text-xs font-bold rounded-bl-2xl z-10 animate-bounce">
          ⭐ Most Popular
        </div>
      )}

      {/* CARD CONTENT */}
      <div
        className={`h-full p-6 md:p-8 flex flex-col relative z-5 transition-all duration-300 ${
          isHighlighted
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/40 dark:to-indigo-900/40 border-2 border-blue-400 dark:border-blue-500 shadow-xl"
            : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg hover:border-blue-300 dark:hover:border-blue-600"
        }`}
      >
        {/* TIER ICON */}
        <div className="mb-4 text-blue-600 dark:text-blue-400 transform transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12">
          {icon}
        </div>

        {/* PLAN NAME */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {plan.name}
        </h3>

        {/* DESCRIPTION */}
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6 flex-grow">
          {plan.description}
        </p>

        {/* PRICE - FIX OVERFLOW */}
        <div className="mb-8 pb-6 border-b border-gray-200 dark:border-gray-700">
          <div className="min-h-[3.5rem] flex items-baseline overflow-hidden">
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white leading-tight break-words">
              {priceLabel}
            </span>
          </div>
          {plan.price_monthly > 0 && (
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2">
              {alternativePrice}
            </p>
          )}
        </div>

        {/* CTA BUTTON */}
        <button
          onClick={() => onGetStarted?.(planCode, interval)}
          className={`w-full py-3 px-4 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 active:scale-95 mb-8 ${
            isHighlighted
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl dark:from-blue-500 dark:to-indigo-500 dark:hover:from-blue-600 dark:hover:to-indigo-600"
              : "bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white border border-gray-300 dark:border-gray-600"
          }`}
        >
          {plan.cta}
        </button>

        {/* FEATURES */}
        <div className="space-y-4 flex-1">
          {plan.features.map((feature: string, idx: number) => (
            <div
              key={idx}
              className="flex items-start gap-3 animate-fadeIn"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <Check className="h-5 w-5 text-green-500 dark:text-green-400 flex-shrink-0 mt-0.5 animate-scaleIn" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
