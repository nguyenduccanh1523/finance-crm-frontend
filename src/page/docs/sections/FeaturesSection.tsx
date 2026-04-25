import {
  BarChart3,
  Wallet,
  Target,
  Lightbulb,
  TrendingUp,
  Calendar,
  Tag,
  Users,
  Settings,
  Brain,
  Zap,
} from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      id: "overview",
      title: "📊 Overview Dashboard",
      icon: <BarChart3 className="h-6 w-6" />,
      color: "blue",
      description: "Complete financial dashboard at a glance",
      details: [
        "Real-time account balance overview across all accounts",
        "Monthly income and expense summary",
        "Budget progress tracking",
        "Spending trend charts",
        "Recent transaction notifications",
      ],
      useCase:
        "Get a complete overview of your financial health in one place, understand your money at a glance.",
    },
    {
      id: "transactions",
      title: "💳 Transactions Management",
      icon: <Wallet className="h-6 w-6" />,
      color: "emerald",
      description: "Manage all your financial transactions",
      details: [
        "Automatic sync from connected bank accounts",
        "AI-powered auto-categorization",
        "Fast search and filtering",
        "Manual add/edit/delete transactions",
        "Custom tagging system",
        "Export transaction data (CSV, PDF)",
      ],
      useCase:
        "Track detailed spending, understand where your money goes, identify unnecessary expenses.",
    },
    {
      id: "budgets",
      title: "💰 Budget Planning",
      icon: <BarChart3 className="h-6 w-4" />,
      color: "purple",
      description: "Smart budget planning and control",
      details: [
        "Set spending limits per category",
        "Real-time budget progress tracking",
        "Alerts when approaching limits",
        "Spending analysis vs budget",
        "Flexible budget adjustment",
        "Detailed monthly budget reports",
      ],
      useCase:
        "Control your spending, ensure responsible budgeting, and save money effectively.",
    },
    {
      id: "goals",
      title: "🎯 Financial Goals",
      icon: <Target className="h-6 w-6" />,
      color: "rose",
      description: "Set and track financial goals",
      details: [
        "Create savings goals (home, vacation, etc.)",
        "Set target amounts and deadlines",
        "Daily progress tracking",
        "Savings increase recommendations",
        "Share goals with family (Pro+)",
        "Completed goals history",
      ],
      useCase:
        "Stay motivated by setting clear goals and tracking progress toward your financial dreams.",
    },
    {
      id: "insights",
      title: "💡 Smart Insights & Analytics",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "amber",
      description: "AI-powered financial intelligence",
      details: [
        "Detect spending trends",
        "Smart savings recommendations",
        "Unusual spending alerts",
        "Compare spending with similar users",
        "Forecast next month spending",
        "Detailed financial reports with charts",
      ],
      useCase:
        "Understand your spending behavior, find ways to save, improve your financial health.",
    },
    {
      id: "exchange-rate",
      title: "💱 Exchange Rate Converter",
      icon: <TrendingUp className="h-6 w-6" />,
      color: "cyan",
      description: "Real-time currency conversion",
      details: [
        "Live, up-to-date exchange rates",
        "Convert between 180+ currencies",
        "Historical rate trends",
        "Rate change alerts",
        "Lock rates for transactions",
        "API access for developers",
      ],
      useCase:
        "Manage international transactions, compare prices globally, make informed currency decisions.",
    },
    {
      id: "recurring-rules",
      title: "📅 Recurring Rules",
      icon: <Calendar className="h-6 w-6" />,
      color: "indigo",
      description: "Automate transaction categorization",
      details: [
        "Create rules for auto-categorization",
        "Identify recurring transactions (bills, salary, etc.)",
        "Easy rule management",
        "Remove unnecessary rules",
        "Set rule priority",
        "Recurring transaction statistics",
      ],
      useCase:
        "Save time by automating categorization, no need for manual tagging every time.",
    },
    {
      id: "categories",
      title: "🏷️ Categories & Tags",
      icon: <Tag className="h-6 w-6" />,
      color: "fuchsia",
      description: "Organize transactions with categories and tags",
      details: [
        "Pre-defined categories (Food, Transport, etc.)",
        "Create custom categories",
        "Add multiple tags per transaction",
        "Fast search by category/tag",
        "Category-based spending reports",
        "Move transactions between categories",
      ],
      useCase: "Organize spending your way, easily analyze expenses by type.",
    },
    {
      id: "workspace",
      title: "👥 Personal Workspace",
      icon: <Users className="h-6 w-6" />,
      color: "lime",
      description: "Manage your personal workspace",
      details: [
        "Configure personal workspace",
        "Share with family or partners (Pro+)",
        "Detailed access control per member",
        "Activity history for all members",
        "Collaborative financial management",
        "Permission and role management",
      ],
      useCase:
        "Manage family finances, share budgets with spouse or business partners.",
    },
    {
      id: "account",
      title: "⚙️ Account Settings",
      icon: <Settings className="h-6 w-6" />,
      color: "sky",
      description: "Manage your account and security",
      details: [
        "Update personal information",
        "Change password and security settings",
        "Enable two-factor authentication (2FA)",
        "Manage connected devices",
        "Customize notifications",
        "Export personal data (GDPR)",
      ],
      useCase:
        "Protect your account, keep information updated, customize your experience.",
    },
  ];

  const colorClasses = {
    blue: "from-blue-100 to-blue-50 dark:from-blue-950/30 dark:to-transparent",
    emerald:
      "from-emerald-100 to-emerald-50 dark:from-emerald-950/30 dark:to-transparent",
    purple:
      "from-purple-100 to-purple-50 dark:from-purple-950/30 dark:to-transparent",
    rose: "from-rose-100 to-rose-50 dark:from-rose-950/30 dark:to-transparent",
    amber:
      "from-amber-100 to-amber-50 dark:from-amber-950/30 dark:to-transparent",
    cyan: "from-cyan-100 to-cyan-50 dark:from-cyan-950/30 dark:to-transparent",
    indigo:
      "from-indigo-100 to-indigo-50 dark:from-indigo-950/30 dark:to-transparent",
    fuchsia:
      "from-fuchsia-100 to-fuchsia-50 dark:from-fuchsia-950/30 dark:to-transparent",
    lime: "from-lime-100 to-lime-50 dark:from-lime-950/30 dark:to-transparent",
    sky: "from-sky-100 to-sky-50 dark:from-sky-950/30 dark:to-transparent",
  };

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Features & Functionality
        </h1>
        <p className="text-lg text-muted-foreground">
          Learn about each Finance CRM feature and how to use them effectively
        </p>
      </div>

      {/* FEATURES LIST */}
      <div className="space-y-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition"
          >
            {/* HEADER */}
            <div
              className={`bg-gradient-to-r ${colorClasses[feature.color as keyof typeof colorClasses]} border-b dark:border-slate-700 p-6`}
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>

            {/* CONTENT */}
            <div className="p-6 space-y-6">
              {/* KEY FEATURES */}
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                  🎯 Key Features:
                </h4>
                <ul className="space-y-2">
                  {feature.details.map((detail, j) => (
                    <li key={j} className="flex gap-3 text-muted-foreground">
                      <Zap className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* USE CASE */}
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4">
                <p className="text-sm">
                  <strong className="text-slate-900 dark:text-white">
                    💭 Use Case:
                  </strong>
                  <span className="text-muted-foreground ml-2">
                    {feature.useCase}
                  </span>
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* INTEGRATION TIPS */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 p-6">
        <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-3 flex items-center gap-2">
          <Brain className="h-5 w-5" />
          💡 Tips for Maximum Effectiveness:
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li>
            ✓ Combine Recurring Rules with Categories for complete automation
          </li>
          <li>✓ Use Insights to identify reducible expenses</li>
          <li>✓ Set Goals alongside Budgets for better progress tracking</li>
          <li>
            ✓ Use Tags for more detailed expense analysis than categories alone
          </li>
          <li>
            ✓ Check Exchange Rates before making international transactions
          </li>
        </ul>
      </div>
    </div>
  );
}
