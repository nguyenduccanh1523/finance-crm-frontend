"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Zap, TrendingUp, Shield, BarChart3 } from "lucide-react";
import { useAppSelector } from "@/app/store";
import { TabSwitch } from "@/components/billing/TabSwitch";
import { PeriodToggle } from "@/components/billing/PeriodToggle";
import { TierCard } from "@/components/billing/TierCard";
import { FAQSection } from "@/components/billing/FAQSection";
import { PaymentDrawer } from "@/components/billing/PaymentDrawer";

type TabType = "personal" | "organization";
type PeriodType = "monthly" | "annual";

interface DrawerState {
  isOpen: boolean;
  planCode: "starter" | "pro" | "enterprise" | "community";
  plan: any;
}

export function BillingPage() {
  const { t } = useTranslation();
  const theme = useAppSelector((s) => s.ui.theme);
  const [activeTab, setActiveTab] = useState<TabType>("personal");
  const [activePeriod, setActivePeriod] = useState<PeriodType>("monthly");
  const [drawerState, setDrawerState] = useState<DrawerState>({
    isOpen: false,
    planCode: "starter",
    plan: null,
  });

  const billing = t("billing", { returnObjects: true }) as any;

  const getPlanData = (tier: string) => {
    return billing[activeTab][tier];
  };

  const getPrice = (tier: string) => {
    const plan = getPlanData(tier);
    return activePeriod === "monthly" ? plan.price_monthly : plan.price_annual;
  };

  const getIconForTier = (tier: string) => {
    const icons: Record<string, any> = {
      community: <Zap className="h-8 w-8" />,
      starter: <TrendingUp className="h-8 w-8" />,
      pro: <BarChart3 className="h-8 w-8" />,
      enterprise: <Shield className="h-8 w-8" />,
    };
    return icons[tier] || <Zap className="h-8 w-8" />;
  };

  const tierList =
    activeTab === "personal"
      ? ["community", "starter", "pro", "enterprise"]
      : ["starter", "pro", "enterprise"];

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-16 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${theme === "dark" ? "dark" : ""}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="text-center mb-10 animate-fadeIn">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300 mb-6 pb-3">
            {billing.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {billing.subtitle}
          </p>
        </div>

        {/* TABS & CONTROLS CONTAINER */}
        <div className="flex flex-col items-center gap-8 mb-16">
          <TabSwitch activeTab={activeTab} onTabChange={setActiveTab} />
          <PeriodToggle
            activePeriod={activePeriod}
            onPeriodChange={setActivePeriod}
          />
        </div>

        {/* PRICING CARDS */}
        <div
          className={`grid gap-6 mb-20 ${
            activeTab === "personal"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {tierList.map((tier) => {
            const plan = getPlanData(tier);
            const price = getPrice(tier);
            const priceLabel =
              price === 0
                ? "Free"
                : activePeriod === "monthly"
                  ? `$${price}/month`
                  : `$${price}/year`;
            const alternativePrice =
              activePeriod === "annual"
                ? `≈ $${Math.round(price / 12)}/mo`
                : `≈ $${Math.round(price * 12)}/yr`;

            return (
              <TierCard
                key={tier}
                plan={plan}
                priceLabel={priceLabel}
                alternativePrice={alternativePrice}
                icon={getIconForTier(tier)}
                planCode={
                  tier as "starter" | "pro" | "enterprise" | "community"
                }
                interval={activePeriod === "monthly" ? "MONTH" : "YEAR"}
                onGetStarted={(planCode, interval) => {
                  setDrawerState({
                    isOpen: true,
                    planCode: planCode as
                      | "starter"
                      | "pro"
                      | "enterprise"
                      | "community",
                    plan: plan,
                  });
                }}
              />
            );
          })}
        </div>

        {/* FAQ SECTION */}
        <FAQSection />
      </div>

      {/* PAYMENT DRAWER */}
      {drawerState.plan && (
        <PaymentDrawer
          isOpen={drawerState.isOpen}
          onClose={() => setDrawerState((s) => ({ ...s, isOpen: false }))}
          plan={drawerState.plan}
          planCode={drawerState.planCode}
          interval={activePeriod === "monthly" ? "MONTH" : "YEAR"}
          scope={activeTab === "personal" ? "PERSONAL" : "ORG"}
        />
      )}
    </div>
  );
}
