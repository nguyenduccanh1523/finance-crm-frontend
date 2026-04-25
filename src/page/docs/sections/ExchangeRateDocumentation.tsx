import {
  TrendingUp,
  Globe,
  AlertCircle,
  RefreshCw,
  Lock,
  Zap,
} from "lucide-react";

export function ExchangeRateDocumentation() {
  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          💱 Exchange Rate Converter
        </h1>
        <p className="text-lg text-muted-foreground">
          Real-time currency conversion and management tools
        </p>
      </div>

      {/* FEATURES */}
      <div className="space-y-6 border-b dark:border-slate-700 pb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Globe className="h-6 w-6 text-blue-600" />
          Key Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              icon: <TrendingUp className="h-6 w-6" />,
              title: "Real-Time Rates",
              description:
                "Live exchange rates updated every minute from multiple reliable sources (ECB, BDC, Yahoo Finance)",
              features: [
                "ECB (European Central Bank) - EUR reference rates",
                "Bank of England - GBP rates",
                "Federal Reserve - USD rates",
                "Multiple fallback sources for accuracy",
              ],
            },
            {
              icon: <Globe className="h-6 w-6" />,
              title: "180+ Currencies",
              description:
                "Support for major and minor currency pairs globally",
              features: [
                "All major currencies (USD, EUR, GBP, JPY, etc.)",
                "Crypto currencies (optional)",
                "Historical rates",
                "Custom currency pairs",
              ],
            },
            {
              icon: <Lock className="h-6 w-6" />,
              title: "Rate Locking",
              description:
                "Lock in rates for transactions to protect against fluctuations",
              features: [
                "Lock rates for up to 30 days",
                "Quote tracking",
                "Rate change notifications",
                "Transaction history",
              ],
            },
            {
              icon: <RefreshCw className="h-6 w-6" />,
              title: "Conversion History",
              description:
                "Track all your conversion requests with detailed logs",
              features: [
                "Full conversion history",
                "Time-stamped records",
                "Original and converted amounts",
                "Rate used for conversion",
              ],
            },
            {
              icon: <Zap className="h-6 w-6" />,
              title: "Rate Alerts",
              description: "Get notified when rates hit your target levels",
              features: [
                "Set target rates for any currency pair",
                "Email notifications",
                "Real-time alerts",
                "Custom alert rules",
              ],
            },
            {
              icon: <AlertCircle className="h-6 w-6" />,
              title: "Fee Transparency",
              description: "Understand all conversion fees and margins clearly",
              features: [
                "No hidden fees",
                "Transparent margin display",
                "Competitive mid-market rates",
                "Industry-leading spreads",
              ],
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-6 hover:shadow-md transition"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 p-3 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400">
                  {feature.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </div>
              </div>
              <ul className="space-y-2">
                {feature.features.map((f, j) => (
                  <li
                    key={j}
                    className="text-sm text-muted-foreground flex gap-2"
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

      {/* HOW TO USE */}
      <div className="space-y-6 border-b dark:border-slate-700 pb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          How to Use
        </h2>

        <div className="space-y-4">
          {[
            {
              step: "1",
              title: "Select Currency Pair",
              description:
                "Choose your source and target currencies from the dropdown",
            },
            {
              step: "2",
              title: "Enter Amount",
              description: "Input the amount you want to convert",
            },
            {
              step: "3",
              title: "Check Rate",
              description:
                "Review the current exchange rate and any applicable fees",
            },
            {
              step: "4",
              title: "Convert",
              description:
                "Click Convert to see the result instantly, record will be saved",
            },
            {
              step: "5",
              title: "Manage Rates",
              description:
                "Lock rates or set alerts if needed for future transactions",
            },
          ].map((item, i) => (
            <div key={i} className="flex gap-4 items-start">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {item.step}
                </span>
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-slate-900 dark:text-white">
                  {item.title}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* API ENDPOINTS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          API Endpoints
        </h2>

        <div className="space-y-3">
          {[
            {
              method: "GET",
              path: "/v1/exchange-rates/:pair",
              description: "Get current rate for a currency pair",
            },
            {
              method: "POST",
              path: "/v1/exchange-rates/convert",
              description: "Convert amount between currencies",
            },
            {
              method: "GET",
              path: "/v1/exchange-rates/history",
              description: "Get conversion history",
            },
            {
              method: "POST",
              path: "/v1/exchange-rates/lock",
              description: "Lock a rate for future transaction",
            },
            {
              method: "GET",
              path: "/v1/exchange-rates/supported",
              description: "Get list of supported currencies",
            },
          ].map((endpoint, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
            >
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center rounded px-3 py-1 text-xs font-medium bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200">
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
            Example - Convert currency:
          </p>
          <pre className="font-mono text-xs text-green-400 overflow-x-auto">
            {`GET /v1/exchange-rates/USD-EUR?amount=100
Authorization: Bearer YOUR_API_KEY

Response:
{
  "from": "USD",
  "to": "EUR",
  "amount": 100,
  "result": 92.50,
  "rate": 0.925,
  "fee": 0.5,
  "timestamp": "2024-04-25T10:30:00Z",
  "provider": "ECB"
}`}
          </pre>
        </div>
      </div>

      {/* BEST PRACTICES */}
      <div className="rounded-xl border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/20 p-6">
        <h3 className="font-bold text-amber-900 dark:text-amber-200 mb-3">
          💡 Best Practices
        </h3>
        <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
          <li>✓ Check rates regularly - they update every minute</li>
          <li>✓ Lock rates before large international transactions</li>
          <li>✓ Use historical data to analyze currency trends</li>
          <li>✓ Set up alerts for your commonly used currency pairs</li>
          <li>✓ Factor in fees when planning conversions</li>
          <li>✓ Use batch API requests for multiple conversions</li>
        </ul>
      </div>

      {/* RATE SOURCES */}
      <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 p-6">
        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Rate Data Sources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              name: "European Central Bank",
              coverage: "EUR-based pairs",
              update: "Daily at 15:00 CET",
            },
            {
              name: "Bank of England",
              coverage: "GBP-based pairs",
              update: "Daily at 16:00 GMT",
            },
            {
              name: "Yahoo Finance",
              coverage: "All major pairs",
              update: "Real-time (15-min delay)",
            },
            {
              name: "OpenExchangeRates",
              coverage: "180+ currencies",
              update: "Real-time",
            },
          ].map((source, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-4"
            >
              <p className="font-semibold text-slate-900 dark:text-white">
                {source.name}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                <strong>Coverage:</strong> {source.coverage}
              </p>
              <p className="text-xs text-muted-foreground">
                <strong>Update:</strong> {source.update}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
