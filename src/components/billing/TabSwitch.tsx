"use client";

import { useTranslation } from "react-i18next";

type TabType = "personal" | "organization";

interface TabSwitchProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabSwitch({ activeTab, onTabChange }: TabSwitchProps) {
  const { t } = useTranslation();
  const billing = t("billing", { returnObjects: true }) as any;

  return (
    <div className="flex gap-3 p-1 bg-white dark:bg-gray-700 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-600 transform transition-all duration-300 hover:shadow-xl">
      <button
        onClick={() => onTabChange("personal")}
        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
          activeTab === "personal"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-100"
            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        }`}
      >
        {billing.tab.personal}
      </button>
      <button
        onClick={() => onTabChange("organization")}
        className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
          activeTab === "organization"
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg scale-100"
            : "text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        }`}
      >
        {billing.tab.organization}
      </button>
    </div>
  );
}
