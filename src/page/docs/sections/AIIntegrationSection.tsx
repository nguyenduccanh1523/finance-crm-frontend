import {
  Bot,
  Brain,
  Database,
  Zap,
  Cpu,
  RefreshCw,
  Shield,
  Sparkles,
} from "lucide-react";

export function AIIntegrationSection() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          AI & Advanced Integrations
        </h1>
        <p className="text-lg text-muted-foreground">
          Advanced AI technology to help you manage finances smarter
        </p>
      </div>

      {/* AI FEATURES */}
      <div className="space-y-6 border-b dark:border-slate-700 pb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Brain className="h-6 w-6 text-blue-600" />
          AI-Powered Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "🤖 Smart Categorization",
              description:
                "AI automatically categorizes transactions based on merchant description and history",
              features: [
                "Learn from your categorization patterns",
                "98%+ accuracy rate",
                "Support 50+ languages",
              ],
            },
            {
              title: "📊 Predictive Analytics",
              description:
                "Forecast next month spending based on historical transaction data",
              features: [
                "Forecast accuracy ±10%",
                "Spending trend analysis",
                "Unusual spending alerts",
              ],
            },
            {
              title: "💰 Smart Recommendations",
              description:
                "Get personalized savings recommendations tailored to your spending habits",
              features: [
                "Spending reduction suggestions",
                "Savings opportunities",
                "Personal financial plans",
              ],
            },
            {
              title: "🔍 Anomaly Detection",
              description:
                "Instantly detect unusual transactions or spending patterns",
              features: [
                "Unusual transaction alerts",
                "Fraud prevention",
                "Smart account protection",
              ],
            },
            {
              title: "📈 Expense Insights",
              description:
                "Detailed spending analysis to understand your financial behavior",
              features: [
                "Visual spending charts",
                "Month-over-month comparison",
                "Category-based statistics",
              ],
            },
            {
              title: "🎯 Goal Optimization",
              description:
                "AI suggests optimization strategies to reach your goals faster",
              features: [
                "Smart savings roadmap",
                "Auto-adjust budget",
                "Motivation and rewards",
              ],
            },
          ].map((ai, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 hover:shadow-md transition"
            >
              <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                {ai.title}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {ai.description}
              </p>
              <ul className="space-y-2">
                {ai.features.map((f, j) => (
                  <li
                    key={j}
                    className="flex gap-2 text-xs text-muted-foreground"
                  >
                    <span className="text-blue-600 dark:text-blue-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* RAG TECHNOLOGY */}
      <div className="space-y-6 border-b dark:border-slate-700 pb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Database className="h-6 w-6 text-purple-600" />
          RAG (Retrieval-Augmented Generation)
        </h2>

        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-purple-50 to-slate-50 dark:from-purple-950/20 dark:to-slate-900 p-6">
          <p className="text-muted-foreground mb-6">
            RAG technology combines intelligent data retrieval with generative
            AI to provide accurate answers based on your financial data.
          </p>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  icon: <Database className="h-5 w-5" />,
                  title: "Retrieval Layer",
                  description:
                    "Search relevant financial data from the database",
                },
                {
                  icon: <Sparkles className="h-5 w-5" />,
                  title: "Generation Layer",
                  description:
                    "AI generates intelligent analysis from the data",
                },
                {
                  icon: <RefreshCw className="h-5 w-5" />,
                  title: "Feedback Loop",
                  description:
                    "Continuously improve accuracy based on feedback",
                },
              ].map((step, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4 text-center"
                >
                  <div className="flex justify-center mb-3 text-purple-600 dark:text-purple-400">
                    {step.icon}
                  </div>
                  <h4 className="font-semibold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* USE CASES */}
          <div className="mt-6 space-y-3">
            <h4 className="font-semibold text-slate-900 dark:text-white">
              📌 RAG Use Cases:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                {
                  q: "How much did I spend this month?",
                  a: "RAG finds all this month's transactions, calculates total, and provides analysis",
                },
                {
                  q: "Which category did I spend the most on?",
                  a: "RAG analyzes all transactions, groups by category, and ranks them",
                },
                {
                  q: "How much can I save?",
                  a: "RAG identifies unnecessary spending and suggests savings opportunities",
                },
                {
                  q: "Compare spending vs last month?",
                  a: "RAG retrieves both months' data and provides detailed comparison",
                },
              ].map((qa, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-white dark:bg-slate-800 p-3"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">
                    Q: {qa.q}
                  </p>
                  <p className="text-xs text-muted-foreground">A: {qa.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AGENT API */}
      <div className="space-y-6 border-b dark:border-slate-700 pb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Bot className="h-6 w-6 text-emerald-600" />
          Agent API - Intelligent Automation
        </h2>

        <p className="text-muted-foreground">
          Agent API allows you to create automated agents to perform complex
          financial tasks.
        </p>

        {/* AGENT TYPES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              name: "📊 Analytics Agent",
              description: "Analyze data and generate reports automatically",
              capabilities: [
                "Generate weekly/monthly reports",
                "Analyze spending trends",
                "Send insights via email",
                "Budget alerts",
              ],
              example:
                "Agent runs every Thursday to send you a weekly spending report",
            },
            {
              name: "🤖 Categorization Agent",
              description: "Auto-categorize transactions based on custom rules",
              capabilities: [
                "Categorize new transactions",
                "Adjust categories based on description",
                "Learn from manual categorization",
                "Batch process transactions",
              ],
              example:
                "Agent automatically tags all transactions from @company.com as 'Business'",
            },
            {
              name: "💰 Budget Manager Agent",
              description: "Automatically manage and adjust budgets",
              capabilities: [
                "Track budget in real-time",
                "Alert when approaching limits",
                "Suggest budget adjustments",
                "Generate budget reports",
              ],
              example:
                "Agent alerts when you've spent 80% of your food budget for the month",
            },
            {
              name: "🎯 Goal Optimizer Agent",
              description: "Optimize your savings goals",
              capabilities: [
                "Suggest new goals",
                "Calculate savings roadmap",
                "Notify daily progress",
                "Dynamically adjust plans",
              ],
              example:
                "Agent calculates you need to save $500/month to achieve your home purchase goal",
            },
            {
              name: "🔐 Risk Detection Agent",
              description: "Detect fraud and financial risks",
              capabilities: [
                "Detect unusual transactions",
                "Alert on abnormal spending",
                "Fraud protection",
                "Verify large transactions",
              ],
              example:
                "Agent alerts when there's a $5000 transaction from abroad",
            },
            {
              name: "📈 Forecasting Agent",
              description: "Forecast future financial trends",
              capabilities: [
                "Forecast cash flow",
                "Estimate monthly spending",
                "Scenario analysis",
                "Alert on cash shortage",
              ],
              example:
                "Agent forecasts you'll be short on cash in March if you don't reduce spending",
            },
          ].map((agent, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 hover:shadow-md transition"
            >
              <h4 className="font-bold text-slate-900 dark:text-white mb-2">
                {agent.name}
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                {agent.description}
              </p>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-semibold text-slate-900 dark:text-white mb-2">
                    Khả năng:
                  </p>
                  <ul className="space-y-1">
                    {agent.capabilities.map((cap, j) => (
                      <li key={j} className="text-xs text-muted-foreground">
                        • {cap}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded bg-slate-100 dark:bg-slate-800 p-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>💡 Ví dụ:</strong> {agent.example}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* HOW TO USE AGENT API */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-emerald-50 to-slate-50 dark:from-emerald-950/20 dark:to-slate-900 p-6">
          <h4 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            How to Use Agent API
          </h4>

          <div className="space-y-4">
            {[
              {
                step: "1",
                title: "Create Agent",
                description: "Go to Settings > Agents > Create new Agent",
              },
              {
                step: "2",
                title: "Configure Rules",
                description: "Define actions and trigger conditions",
              },
              {
                step: "3",
                title: "Set Schedule",
                description: "Choose run time (daily, weekly, etc.)",
              },
              {
                step: "4",
                title: "Activate Agent",
                description: "Enable agent and monitor results",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-200 dark:bg-emerald-900/50 flex items-center justify-center">
                  <span className="text-emerald-700 dark:text-emerald-400 font-bold text-sm">
                    {item.step}
                  </span>
                </div>
                <div className="flex-1">
                  <h5 className="font-semibold text-slate-900 dark:text-white">
                    {item.title}
                  </h5>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* API DOCUMENTATION */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Zap className="h-6 w-6 text-yellow-600" />
          Agent API Endpoints
        </h2>

        <div className="space-y-3">
          {[
            {
              method: "POST",
              path: "/v1/agents",
              description: "Create a new agent",
            },
            {
              method: "GET",
              path: "/v1/agents",
              description: "List all agents",
            },
            {
              method: "PUT",
              path: "/v1/agents/:id",
              description: "Update agent configuration",
            },
            {
              method: "DELETE",
              path: "/v1/agents/:id",
              description: "Delete an agent",
            },
            {
              method: "POST",
              path: "/v1/agents/:id/run",
              description: "Run agent immediately",
            },
            {
              method: "GET",
              path: "/v1/agents/:id/logs",
              description: "Get agent activity history",
            },
          ].map((endpoint, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200">
                  {endpoint.method}
                </span>
                <code className="text-sm font-mono text-slate-900 dark:text-slate-100">
                  {endpoint.path}
                </code>
                <span className="text-xs text-muted-foreground ml-auto">
                  {endpoint.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-lg bg-slate-900 dark:bg-black p-4">
          <p className="text-xs text-slate-400 mb-2">
            Example - Create an Agent:
          </p>
          <pre className="font-mono text-xs text-green-400 overflow-x-auto">
            {`POST /v1/agents
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "name": "Weekly Report Agent",
  "type": "analytics",
  "schedule": "0 9 * * THU",
  "actions": [
    {
      "type": "generate_report",
      "params": { "format": "email" }
    }
  ],
  "enabled": true
}`}
          </pre>
        </div>
      </div>

      {/* BEST PRACTICES */}
      <div className="rounded-xl border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 p-6">
        <h3 className="font-bold text-blue-900 dark:text-blue-200 mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5" />
          📁 Best Practices & Security
        </h3>
        <ul className="space-y-2 text-sm text-blue-800 dark:text-blue-300">
          <li>✓ Always use secure API Keys and never share them publicly</li>
          <li>✓ Check agent activity history regularly</li>
          <li>✓ Start with simple rules, then build complexity gradually</li>
          <li>✓ Set spending limits for agents to avoid errors</li>
          <li>✓ Use encryption for sensitive data</li>
        </ul>
      </div>
    </div>
  );
}
