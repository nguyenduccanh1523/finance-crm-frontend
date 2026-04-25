import { Check } from "lucide-react";

export function PricingSection() {
  const plans = [
    {
      name: "Starter",
      description: "Perfect for getting started",
      price: 0,
      period: "Forever Free",
      icon: "🚀",
      color: "blue",
      features: [
        "Up to 5,000 transactions/month",
        "Basic expense tracking",
        "1 account connection",
        "Community support",
        "Basic reports",
        "Transaction categorization",
      ],
      cta: "Get Started",
      highlighted: false,
    },
    {
      name: "Pro",
      description: "For serious users",
      price: 9.99,
      period: "/month",
      icon: "⚡",
      color: "purple",
      features: [
        "Unlimited transactions",
        "Advanced analytics & insights",
        "Up to 5 account connections",
        "Priority email support",
        "Custom categories & tags",
        "Recurring rules",
        "Budget management",
        "Financial goals tracking",
        "Mobile app access",
        "API access (read-only)",
      ],
      cta: "Start Free Trial",
      highlighted: true,
    },
    {
      name: "Business",
      description: "For teams & enterprises",
      price: 29.99,
      period: "/month",
      icon: "👥",
      color: "emerald",
      features: [
        "Everything in Pro",
        "Unlimited account connections",
        "Multiple user accounts (up to 5)",
        "Advanced security features",
        "Dedicated support",
        "Advanced API access",
        "Custom integrations",
        "Data export & reports",
        "Compliance certifications",
        "Custom analytics",
        "White-label options",
      ],
      cta: "Contact Sales",
      highlighted: false,
    },
  ];

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Simple, Transparent Pricing
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Choose the perfect plan for your financial management needs. Always
          cancel anytime, no hidden fees.
        </p>
      </div>

      {/* BILLING TOGGLE */}
      <div className="flex justify-center items-center gap-4">
        <button className="px-6 py-2 text-sm font-medium rounded-lg border-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-white dark:bg-slate-900">
          Monthly
        </button>
        <button className="px-6 py-2 text-sm font-medium rounded-lg border border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800">
          Annually{" "}
          <span className="text-green-600 dark:text-green-400 ml-2">
            Save 20%
          </span>
        </button>
      </div>

      {/* PRICING CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
        {plans.map((plan, i) => (
          <div
            key={i}
            className={`rounded-xl border transition-all duration-300 ${
              plan.highlighted
                ? "border-blue-500 dark:border-blue-400 ring-2 ring-blue-500 dark:ring-blue-400 shadow-lg scale-105"
                : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
            } overflow-hidden`}
          >
            {/* BADGE */}
            {plan.highlighted && (
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold py-2 text-center uppercase tracking-wider">
                ⭐ Most Popular
              </div>
            )}

            <div
              className={`bg-gradient-to-br p-8 ${
                plan.highlighted
                  ? "from-blue-50 to-slate-50 dark:from-blue-950/30 dark:to-slate-900"
                  : "from-white to-slate-50 dark:from-slate-900 dark:to-slate-800"
              }`}
            >
              {/* PLAN NAME */}
              <div className="flex items-center gap-2 mb-4">
                <span className="text-3xl">{plan.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {plan.description}
                  </p>
                </div>
              </div>

              {/* PRICING */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">
                    ${plan.price.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>

              {/* CTA BUTTON */}
              <button
                className={`w-full py-2.5 rounded-lg font-semibold transition-colors mb-6 ${
                  plan.highlighted
                    ? "bg-blue-600 text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                    : "border-2 border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                {plan.cta}
              </button>

              {/* FEATURES */}
              <div className="space-y-3 border-t dark:border-slate-700 pt-6">
                {plan.features.map((feature, j) => (
                  <div key={j} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ADD-ONS */}
      <div className="space-y-6 border-t dark:border-slate-700 pt-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Optional Add-ons
        </h2>
        <p className="text-muted-foreground">
          Enhance your plan with additional features
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "Advanced Analytics",
              description: "Deeper financial insights and predictive analytics",
              price: "$4.99/month",
            },
            {
              name: "Custom Reports",
              description: "Generate and schedule custom financial reports",
              price: "$3.99/month",
            },
            {
              name: "Premium API Access",
              description: "Full API access with higher rate limits",
              price: "$19.99/month",
            },
            {
              name: "Team Collaboration",
              description: "Add unlimited team members to your workspace",
              price: "$9.99/month",
            },
          ].map((addon, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-4 hover:border-slate-300 dark:hover:border-slate-600 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-white">
                    {addon.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    {addon.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-slate-700">
                <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                  {addon.price}
                </span>
                <button className="text-sm px-3 py-1 rounded border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                  Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="space-y-6 border-t dark:border-slate-700 pt-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Pricing FAQs
        </h2>

        <div className="space-y-4">
          {[
            {
              q: "Can I change my plan anytime?",
              a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.",
            },
            {
              q: "Is there a free trial?",
              a: "Yes! Pro and Business plans include a 14-day free trial. No credit card required to start.",
            },
            {
              q: "What payment methods do you accept?",
              a: "We accept all major credit/debit cards, PayPal, and bank transfers for annual subscriptions.",
            },
            {
              q: "Can I get a refund?",
              a: "We offer a 30-day money-back guarantee if you're not satisfied with the service.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-4"
            >
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {item.q}
              </h4>
              <p className="text-sm text-muted-foreground mt-2">{item.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">Ready to upgrade?</h3>
        <p className="text-blue-100 mb-6">
          Start your free trial today. No credit card required.
        </p>
        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
          Start Free Trial
        </button>
      </div>
    </div>
  );
}
