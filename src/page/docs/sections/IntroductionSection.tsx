import { Lightbulb, Target, Wallet, TrendingUp } from "lucide-react";

export function IntroductionSection() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Welcome to Finance CRM
        </h1>
        <p className="text-lg text-muted-foreground leading-relaxed">
          A comprehensive financial management platform designed to help you
          track, analyze, and optimize your personal finances with ease.
        </p>
      </div>

      {/* QUICK STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { number: "50K+", label: "Active Users" },
          { number: "100M+", label: "Transactions Tracked" },
          { number: "99.9%", label: "Uptime" },
          { number: "24/7", label: "Support" },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-6 text-center"
          >
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stat.number}
            </p>
            <p className="text-sm text-muted-foreground mt-2">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* FEATURES */}
      <div className="space-y-6 mt-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <Wallet className="h-6 w-6" />,
              title: "Smart Expense Tracking",
              description:
                "Automatically categorize and track all your expenses with AI-powered insights",
            },
            {
              icon: <Target className="h-6 w-6" />,
              title: "Financial Goals",
              description:
                "Set and achieve your financial goals with personalized plans and tracking",
            },
            {
              icon: <TrendingUp className="h-6 w-6" />,
              title: "Advanced Analytics",
              description:
                "Visualize spending patterns and identify opportunities to save money",
            },
            {
              icon: <Lightbulb className="h-6 w-6" />,
              title: "Smart Insights",
              description:
                "Get actionable recommendations to improve your financial health",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 mt-1 p-2 bg-blue-100 dark:bg-blue-950 rounded-lg text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div className="space-y-6 mt-12 border-t dark:border-slate-700 pt-12">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          How It Works
        </h2>
        <div className="space-y-4">
          {[
            {
              step: "01",
              title: "Connect Your Accounts",
              description:
                "Link your bank accounts and financial services securely",
            },
            {
              step: "02",
              title: "Automatic Categorization",
              description:
                "Transactions are automatically categorized and tagged",
            },
            {
              step: "03",
              title: "Get Insights",
              description:
                "Receive personalized insights about your spending habits",
            },
            {
              step: "04",
              title: "Optimize & Save",
              description:
                "Follow recommendations to optimize your financial strategy",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-6 items-start">
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {item.step}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-2">Ready to Get Started?</h3>
        <p className="text-blue-100 mb-6">
          Join thousands of users managing their finances smarter with Finance
          CRM
        </p>
        <button className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
          Get Started Free
        </button>
      </div>
    </div>
  );
}
