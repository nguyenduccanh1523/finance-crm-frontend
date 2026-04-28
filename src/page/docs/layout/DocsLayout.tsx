import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen,
  Code,
  CreditCard,
  HelpCircle,
  Zap,
  ArrowLeft,
  Sparkles,
  Brain,
  TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";

interface DocNavItem {
  id: string;
  label: string;
  path: string;
  icon: React.ReactNode;
  badge?: string;
  category: "finance" | "crm";
}

const docNavItems: DocNavItem[] = [
  // Finance Module
  {
    id: "introduction",
    label: "Introduction",
    path: "/docs/finance/introduction",
    icon: <BookOpen className="h-4 w-4" />,
    category: "finance",
  },
  {
    id: "getting-started",
    label: "Getting Started",
    path: "/docs/finance/getting-started",
    icon: <Zap className="h-4 w-4" />,
    badge: "NEW",
    category: "finance",
  },
  {
    id: "features",
    label: "Features",
    path: "/docs/finance/features",
    icon: <Sparkles className="h-4 w-4" />,
    category: "finance",
  },
  {
    id: "exchange-rate",
    label: "Exchange Rate",
    path: "/docs/finance/exchange-rate",
    icon: <TrendingUp className="h-4 w-4" />,
    category: "finance",
  },
  {
    id: "ai-integration",
    label: "AI & Integration",
    path: "/docs/finance/ai-integration",
    icon: <Brain className="h-4 w-4" />,
    badge: "ADVANCED",
    category: "finance",
  },
  {
    id: "api",
    label: "API Documentation",
    path: "/docs/finance/api",
    icon: <Code className="h-4 w-4" />,
    category: "finance",
  },
  {
    id: "pricing",
    label: "Pricing",
    path: "/docs/finance/pricing",
    icon: <CreditCard className="h-4 w-4" />,
    category: "finance",
  },
  {
    id: "faq",
    label: "FAQ",
    path: "/docs/finance/faq",
    icon: <HelpCircle className="h-4 w-4" />,
    category: "finance",
  },
];

const financeItems = docNavItems.filter((item) => item.category === "finance");
const crmItems = docNavItems.filter((item) => item.category === "crm");

export function DocsLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* HEADER */}
      <div className="sticky top-0 z-40 border-b bg-white/80 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="container mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  Finance CRM
                </h1>
                <p className="text-xs text-muted-foreground">
                  Documentation Center
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate("/app")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm font-medium">Back to App</span>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* SIDEBAR - NAVIGATION */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24 space-y-2">
              {/* Finance Section */}
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Finance Module
              </p>
              <nav className="space-y-1">
                {financeItems.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.id}
                      onClick={() => navigate(item.path)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                        isActive
                          ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200"
                          : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
                      )}
                    >
                      <span className="flex-shrink-0">{item.icon}</span>
                      <span className="flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-950 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-200">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* CRM Section (Placeholder for future) */}
              {crmItems.length > 0 && (
                <>
                  <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-8">
                    CRM Module
                  </p>
                  <nav className="space-y-1">
                    {crmItems.map((item) => {
                      const isActive = location.pathname === item.path;
                      return (
                        <button
                          key={item.id}
                          onClick={() => navigate(item.path)}
                          className={cn(
                            "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                            isActive
                              ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200"
                              : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200",
                          )}
                        >
                          <span className="flex-shrink-0">{item.icon}</span>
                          <span className="flex-1 text-left">{item.label}</span>
                          {item.badge && (
                            <span className="inline-flex items-center rounded-full bg-green-100 dark:bg-green-950 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-200">
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </>
              )}

              {/* QUICK LINKS */}
              <div className="mt-8 space-y-4 border-t dark:border-slate-800 pt-6">
                <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Resources
                </p>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                  >
                    → API Reference
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                  >
                    → Sample Code
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-blue-600 dark:text-blue-400 hover:underline rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/30 transition"
                  >
                    → Support
                  </a>
                </div>
              </div>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="lg:col-span-3">
            <div className="rounded-xl border bg-white dark:bg-slate-900 shadow-sm p-8 md:p-10 dark:border-slate-800">
              <Outlet />
            </div>

            {/* FOOTER */}
            <div className="mt-12 border-t dark:border-slate-800 pt-8 pb-4">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Last updated: April 27, 2026
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Finance CRM v1.0.0
                  </p>
                </div>
                <div className="flex gap-4 text-sm">
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Report Issue
                  </a>
                  <span className="text-muted-foreground">•</span>
                  <a
                    href="#"
                    className="text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Suggest Improvement
                  </a>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
