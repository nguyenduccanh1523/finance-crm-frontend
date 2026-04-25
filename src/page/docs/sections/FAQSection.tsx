import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface FAQItem {
  q: string;
  a: string;
  category: string;
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs: FAQItem[] = [
    // GENERAL
    {
      category: "General",
      q: "What is Finance CRM?",
      a: "Finance CRM is a comprehensive financial management platform that helps you track, analyze, and optimize your personal finances. It combines expense tracking, budgeting, goal setting, and advanced analytics in one intuitive interface.",
    },
    {
      category: "General",
      q: "Is Finance CRM secure?",
      a: "Yes! We use bank-level security with 256-bit SSL encryption, multi-factor authentication, and comply with GDPR, PCI-DSS, and SOC 2 standards. Your data is regularly backed up and never sold to third parties.",
    },
    {
      category: "General",
      q: "How much does Finance CRM cost?",
      a: "We offer a free Starter plan with essential features, Pro at $9.99/month for power users, and Business at $29.99/month for teams. All plans include a 14-day free trial.",
    },

    // ACCOUNT & SETUP
    {
      category: "Account & Setup",
      q: "How do I create an account?",
      a: "Visit our website, click 'Sign Up', and enter your email address. Verify your email, set a password, and complete your profile. You're ready to go!",
    },
    {
      category: "Account & Setup",
      q: "Can I use Finance CRM on mobile?",
      a: "Yes! We have native mobile apps for iOS and Android available on the App Store and Google Play. All features are available on mobile.",
    },
    {
      category: "Account & Setup",
      q: "How do I connect my bank account?",
      a: "Go to Settings > Connected Accounts and click 'Add Account'. Select your bank and follow the secure authentication process. We support 12,000+ financial institutions.",
    },

    // TRANSACTIONS & TRACKING
    {
      category: "Transactions",
      q: "Will my transactions sync automatically?",
      a: "Yes! Transactions from connected accounts sync daily. You can also manually add transactions anytime.",
    },
    {
      category: "Transactions",
      q: "Can I edit or delete transactions?",
      a: "Yes! You can edit any transaction's date, amount, category, or tags. Deleted transactions are moved to a trash bin for 30 days before permanent deletion.",
    },
    {
      category: "Transactions",
      q: "How is transaction categorization done?",
      a: "We use AI to automatically categorize transactions based on merchant and description. You can manually adjust categories, and our AI learns from your corrections.",
    },

    // BUDGETS & GOALS
    {
      category: "Budgets & Goals",
      q: "How do I set a budget?",
      a: "Go to Budgets, click 'Create Budget', set a spending limit for any category, and select the time period (monthly, quarterly, yearly). You'll get alerts when approaching your limit.",
    },
    {
      category: "Budgets & Goals",
      q: "Can I set financial goals?",
      a: "Yes! Use the Goals feature to set savings targets. Track progress, get recommendations, and celebrate milestones. Goals can be customized with target amounts and deadlines.",
    },
    {
      category: "Budgets & Goals",
      q: "What if I exceed my budget?",
      a: "You'll receive notifications when approaching the limit. Exceeding doesn't block spending—it's meant to keep you aware. You can adjust budgets anytime.",
    },

    // BILLING & PAYMENTS
    {
      category: "Billing",
      q: "Can I cancel anytime?",
      a: "Yes! Cancel your subscription anytime with no penalties. Your access continues until the end of the current billing period.",
    },
    {
      category: "Billing",
      q: "Do you offer annual discounts?",
      a: "Yes! Annual plans save 20% compared to monthly pricing. Pro is $99.90/year and Business is $299.90/year.",
    },
    {
      category: "Billing",
      q: "What's your refund policy?",
      a: "We offer a 30-day money-back guarantee for all plans. If you're not satisfied, we'll refund you in full.",
    },

    // API & INTEGRATIONS
    {
      category: "API & Integrations",
      q: "Does Finance CRM have an API?",
      a: "Yes! Pro and Business plans include API access. The API lets you read transactions, budgets, and analytics data. Full documentation is available in our API section.",
    },
    {
      category: "API & Integrations",
      q: "Can I integrate with other apps?",
      a: "We support integrations with Zapier, IFTTT, and popular accounting software. Custom integrations are available for Business plan subscribers.",
    },
    {
      category: "API & Integrations",
      q: "What's the API rate limit?",
      a: "Starter: 100 requests/hour, Pro: 1,000 requests/hour, Business: 10,000 requests/hour. Contact us for higher limits.",
    },

    // SUPPORT & TROUBLESHOOTING
    {
      category: "Support",
      q: "How do I get support?",
      a: "Email support@financecrm.com for all plans. Pro and Business subscribers get priority support. We also have a community forum and documentation site.",
    },
    {
      category: "Support",
      q: "Why is my data not syncing?",
      a: "Check your internet connection and ensure your credentials are correct. Go to Settings > Connected Accounts and reconnect if needed. Contact support if issues persist.",
    },
    {
      category: "Support",
      q: "Is there a tutorial or onboarding guide?",
      a: "Yes! New users get an interactive onboarding tutorial. You can also watch our video guides at support.financecrm.com/tutorials",
    },
  ];

  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
          Frequently Asked Questions
        </h1>
        <p className="text-lg text-muted-foreground">
          Find answers to common questions about Finance CRM
        </p>
      </div>

      {/* SEARCH (optional future enhancement) */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search FAQs..."
          className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* FAQS BY CATEGORY */}
      <div className="space-y-12">
        {categories.map((category, catIdx) => (
          <div key={catIdx} className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white border-b dark:border-slate-700 pb-3">
              {category}
            </h2>

            <div className="space-y-3">
              {faqs
                .filter((faq) => faq.category === category)
                .map((faq, idx) => {
                  const globalIdx = faqs.indexOf(faq);
                  const isOpen = openIndex === globalIdx;

                  return (
                    <button
                      key={idx}
                      onClick={() => setOpenIndex(isOpen ? null : globalIdx)}
                      className="w-full text-left rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 transition overflow-hidden"
                    >
                      <div className="flex items-center justify-between p-4 gap-4">
                        <h3 className="font-semibold text-slate-900 dark:text-white pr-4">
                          {faq.q}
                        </h3>
                        <ChevronDown
                          className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {/* ANSWER */}
                      {isOpen && (
                        <div className="border-t dark:border-slate-700 px-4 py-4 bg-slate-50 dark:bg-slate-800/50">
                          <p className="text-muted-foreground leading-relaxed">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>

      {/* CONTACT SUPPORT */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-8">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Didn't find what you're looking for?
        </h3>
        <p className="text-muted-foreground mb-6">
          Our support team is here to help! Reach out to us and we'll get back
          to you within 24 hours.
        </p>
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="mailto:support@financecrm.com"
            className="inline-flex items-center justify-center px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Email Support
          </a>
          <button className="inline-flex items-center justify-center px-6 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            Live Chat
          </button>
          <a
            href="#"
            className="inline-flex items-center justify-center px-6 py-2 border-2 border-slate-300 dark:border-slate-600 rounded-lg font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Community Forum
          </a>
        </div>
      </div>

      {/* RELATED RESOURCES */}
      <div className="space-y-4 border-t dark:border-slate-700 pt-8">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          Related Resources
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              title: "Getting Started Guide",
              description:
                "New to Finance CRM? Start here for a quick setup guide.",
              link: "#",
            },
            {
              title: "Video Tutorials",
              description:
                "Watch step-by-step videos for all features and functions.",
              link: "#",
            },
            {
              title: "API Documentation",
              description:
                "Full API reference and integration guides for developers.",
              link: "#",
            },
          ].map((resource, i) => (
            <a
              key={i}
              href={resource.link}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 p-4 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-md transition"
            >
              <h4 className="font-semibold text-slate-900 dark:text-white text-blue-600 dark:text-blue-400">
                {resource.title} →
              </h4>
              <p className="text-sm text-muted-foreground mt-2">
                {resource.description}
              </p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
