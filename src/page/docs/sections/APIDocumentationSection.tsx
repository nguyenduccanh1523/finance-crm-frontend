import { Copy, Eye, EyeOff, Key, RefreshCw } from "lucide-react";
import { useState } from "react";

export function APIDocumentationSection() {
  const [showKey, setShowKey] = useState(false);
  const [copiedKey, setCopiedKey] = useState(false);

  const handleCopyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const dummyApiKey = "fc_live_9z8K2m5xQ7pR4jL8nB3vC6hD9eF1gI2w";

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          API Documentation
        </h1>
        <p className="text-lg text-muted-foreground">
          Integrate Finance CRM into your application with our powerful REST API
        </p>
      </div>

      {/* API KEY MANAGEMENT */}
      <div className="space-y-6 border-b dark:border-slate-700 pb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
          <Key className="h-6 w-6 text-blue-600" />
          API Key Management
        </h2>

        <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Your API Keys
          </h3>

          <div className="space-y-4">
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-xs uppercase font-semibold text-muted-foreground mb-2">
                    Live Key
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm font-mono text-slate-900 dark:text-white truncate">
                      {showKey ? dummyApiKey : "fc_live_••••••••••••••••••••••"}
                    </code>
                    <button
                      onClick={() => setShowKey(!showKey)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"
                    >
                      {showKey ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleCopyKey(dummyApiKey)}
                      className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded text-slate-600 dark:text-slate-400"
                    >
                      {copiedKey ? (
                        <span className="text-xs text-green-600 font-semibold">
                          ✓
                        </span>
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="px-3 py-1 text-xs font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 rounded transition">
                    <RefreshCw className="h-3 w-3 inline mr-1" />
                    Rotate
                  </button>
                </div>
              </div>
              <p className="text-xs text-muted-foreground mt-3">
                Created on: Mar 15, 2024 • Last used: 2 hours ago
              </p>
            </div>
          </div>

          <button className="mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition">
            + Generate New Key
          </button>
        </div>

        <div className="rounded-lg border border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20 p-4">
          <p className="text-sm text-blue-900 dark:text-blue-200">
            <strong>🔒 Security Tip:</strong> Never share your API keys. Always
            use them server-side and rotate them regularly if compromised.
          </p>
        </div>
      </div>

      {/* AUTHENTICATION */}
      <div className="space-y-6 border-b dark:border-slate-700 pb-8">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Authentication
        </h2>

        <p className="text-muted-foreground">
          All API requests must include your API key in the Authorization
          header:
        </p>

        <div className="rounded-lg bg-slate-900 dark:bg-black p-4">
          <div className="font-mono text-sm text-green-400">
            <div>Authorization: Bearer YOUR_API_KEY</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "cURL",
              code: `curl -X GET https://api.financecrm.com/v1/accounts \\
  -H "Authorization: Bearer fc_live_xxxx"`,
            },
            {
              title: "JavaScript",
              code: `const response = await fetch('https://api.financecrm.com/v1/accounts', {
  headers: {
    'Authorization': 'Bearer fc_live_xxxx'
  }
});`,
            },
            {
              title: "Python",
              code: `import requests

headers = {'Authorization': 'Bearer fc_live_xxxx'}
response = requests.get('https://api.financecrm.com/v1/accounts', headers=headers)`,
            },
            {
              title: "Node.js",
              code: `const axios = require('axios');

const response = await axios.get('https://api.financecrm.com/v1/accounts', {
  headers: { 'Authorization': 'Bearer fc_live_xxxx' }
});`,
            },
          ].map((example, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-4"
            >
              <h4 className="font-semibold text-slate-900 dark:text-white mb-3">
                {example.title}
              </h4>
              <div className="rounded bg-slate-900 dark:bg-black p-3 overflow-x-auto">
                <pre className="font-mono text-xs text-green-400">
                  {example.code}
                </pre>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ENDPOINTS */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Main Endpoints
        </h2>

        <div className="space-y-4">
          {[
            {
              method: "GET",
              path: "/v1/accounts",
              description: "List all connected accounts",
              status: "200",
            },
            {
              method: "POST",
              path: "/v1/transactions",
              description: "Create a new transaction",
              status: "201",
            },
            {
              method: "GET",
              path: "/v1/transactions/:id",
              description: "Get transaction details",
              status: "200",
            },
            {
              method: "PUT",
              path: "/v1/transactions/:id",
              description: "Update a transaction",
              status: "200",
            },
            {
              method: "GET",
              path: "/v1/budgets",
              description: "List all budgets",
              status: "200",
            },
            {
              method: "GET",
              path: "/v1/analytics/summary",
              description: "Get financial analytics summary",
              status: "200",
            },
          ].map((endpoint, i) => (
            <div
              key={i}
              className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center rounded px-2 py-1 text-xs font-medium ${
                        endpoint.method === "GET"
                          ? "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-200"
                          : "bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-200"
                      }`}
                    >
                      {endpoint.method}
                    </span>
                    <code className="text-sm font-mono text-slate-900 dark:text-slate-100">
                      {endpoint.path}
                    </code>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {endpoint.description}
                  </p>
                </div>
                <span className="inline-flex items-center rounded px-2 py-1 text-xs font-medium bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-200">
                  {endpoint.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RESPONSE FORMAT */}
      <div className="space-y-4 border-t dark:border-slate-700 pt-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Response Format
        </h3>
        <p className="text-muted-foreground">
          All responses are returned in JSON format:
        </p>
        <div className="rounded-lg bg-slate-900 dark:bg-black p-4">
          <pre className="font-mono text-xs text-green-400 overflow-x-auto">
            {`{
  "status": "success",
  "data": {
    "id": "acc_123456",
    "name": "Checking Account",
    "balance": 5000.50,
    "currency": "USD"
  },
  "message": "Account retrieved successfully"
}`}
          </pre>
        </div>
      </div>
    </div>
  );
}
