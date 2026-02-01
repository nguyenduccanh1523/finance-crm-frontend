"use client";

import { useTranslation } from "react-i18next";

type PeriodType = "monthly" | "annual";

interface PeriodToggleProps {
  activePeriod: PeriodType;
  onPeriodChange: (period: PeriodType) => void;
}

export function PeriodToggle({
  activePeriod,
  onPeriodChange,
}: PeriodToggleProps) {
  const { t } = useTranslation();
  const billing = t("billing", { returnObjects: true }) as any;

  return (
    <div className="flex items-center gap-6 bg-white dark:bg-gray-700 p-2 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600">
      <button
        onClick={() => onPeriodChange("monthly")}
        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
          activePeriod === "monthly"
            ? "text-blue-600 dark:text-blue-300 font-bold"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        {billing.period.monthly}
      </button>

      {/* SMOOTH TOGGLE SWITCH */}
      <div
        onClick={() =>
          onPeriodChange(activePeriod === "monthly" ? "annual" : "monthly")
        }
        className="relative w-14 h-7 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer transition-colors duration-300 hover:bg-gray-400 dark:hover:bg-gray-500"
      >
        <div
          className={`absolute top-0.5 left-0.5 w-6 h-6 bg-white dark:bg-gray-200 rounded-full transition-all duration-500 transform ${
            activePeriod === "annual" ? "translate-x-7" : "translate-x-0"
          }`}
        />
      </div>

      <button
        onClick={() => onPeriodChange("annual")}
        className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
          activePeriod === "annual"
            ? "text-blue-600 dark:text-blue-300 font-bold"
            : "text-gray-600 dark:text-gray-400"
        }`}
      >
        {billing.period.annual}
      </button>

      {activePeriod === "annual" && (
        <div className="ml-4 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 text-sm font-bold rounded-full animate-pulse transform transition-all duration-300">
          {billing.period.save} 💰
        </div>
      )}
    </div>
  );
}
