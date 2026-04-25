import { Download, Package, Terminal } from "lucide-react";

export function GettingStartedSection() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Getting Started
        </h1>
        <p className="text-lg text-muted-foreground">
          Get up and running with Finance CRM in just a few minutes
        </p>
      </div>

      {/* INSTALLATION */}
      <div className="space-y-6 border-b dark:border-slate-700 pb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Download className="h-6 w-6 text-blue-600" />
          Installation
        </h2>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Prerequisites
          </h3>
          <ul className="space-y-2 text-muted-foreground">
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>Node.js 16.x or higher</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>npm or yarn package manager</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue-600 font-bold">•</span>
              <span>A modern web browser (Chrome, Firefox, Safari, Edge)</span>
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Step 1: Install Dependencies
          </h3>
          <div className="rounded-lg bg-slate-900 dark:bg-black p-4">
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-mono text-sm text-green-400 space-y-1">
                <div>$ npm install</div>
                <div className="text-slate-500"># or</div>
                <div>$ yarn install</div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Step 2: Configure Environment
          </h3>
          <p className="text-muted-foreground">
            Create a `.env.local` file in the root directory:
          </p>
          <div className="rounded-lg bg-slate-900 dark:bg-black p-4">
            <div className="font-mono text-sm text-green-400 space-y-2">
              <div>VITE_API_URL=https://api.financecrm.com</div>
              <div>VITE_STRIPE_KEY=pk_test_your_stripe_key</div>
              <div>VITE_APP_VERSION=1.0.0</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
            Step 3: Start Development Server
          </h3>
          <div className="rounded-lg bg-slate-900 dark:bg-black p-4">
            <div className="flex items-start gap-3">
              <Terminal className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1 font-mono text-sm text-green-400">
                $ npm run dev
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            The app will be available at{" "}
            <code className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded text-blue-600 dark:text-blue-400">
              http://localhost:5173
            </code>
          </p>
        </div>
      </div>

      {/* CORE CONCEPTS */}
      <div className="space-y-6 border-b dark:border-slate-700 pb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Package className="h-6 w-6 text-blue-600" />
          Core Concepts
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Accounts",
              description:
                "Connect and manage your bank accounts and financial services",
            },
            {
              title: "Transactions",
              description:
                "Track all your income and expenses with automatic categorization",
            },
            {
              title: "Categories & Tags",
              description:
                "Organize transactions with custom categories and flexible tagging",
            },
            {
              title: "Budgets",
              description:
                "Set spending limits and monitor your budget performance",
            },
            {
              title: "Goals",
              description:
                "Define financial goals and track progress towards them",
            },
            {
              title: "Recurring Rules",
              description:
                "Automate transaction categorization with recurring rules",
            },
          ].map((concept, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-4"
            >
              <h4 className="font-semibold text-slate-900 dark:text-white">
                {concept.title}
              </h4>
              <p className="text-sm text-muted-foreground mt-2">
                {concept.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* FIRST APP */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Your First Steps
        </h2>

        <div className="space-y-4">
          {[
            {
              title: "1. Create Your Account",
              description:
                "Sign up with your email address and verify your identity",
            },
            {
              title: "2. Set Up Your Profile",
              description: "Add your basic information and preferred currency",
            },
            {
              title: "3. Connect Financial Accounts",
              description:
                "Link your bank accounts for automatic transaction tracking",
            },
            {
              title: "4. Explore the Dashboard",
              description:
                "View your financial overview and start tracking expenses immediately",
            },
            {
              title: "5. Set Financial Goals",
              description:
                "Define your savings goals and get personalized recommendations",
            },
          ].map((step, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center">
                <span className="text-blue-600 dark:text-blue-400 font-semibold text-sm">
                  {i + 1}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {step.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUPPORT */}
      <div className="rounded-lg border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-6">
        <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-2">
          💡 Need Help?
        </h3>
        <p className="text-sm text-amber-800 dark:text-amber-300">
          Check out our{" "}
          <a href="#" className="underline font-semibold">
            FAQ section
          </a>{" "}
          or contact our support team at{" "}
          <a
            href="mailto:support@financecrm.com"
            className="underline font-semibold"
          >
            support@financecrm.com
          </a>
        </p>
      </div>
    </div>
  );
}
