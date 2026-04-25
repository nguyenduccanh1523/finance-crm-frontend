import { ExchangeRateConverter } from "@/components/exchange-rate/ExchangeRateConverter";
import { AppCard } from "@/components/common/AppCard";
import { Globe2, Zap, Search } from "lucide-react";

export default function ExchangeRatePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
          Exchange Rate
        </h1>
        <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
          Convert currencies with live exchange rates from supported providers.
        </p>
      </div>

      <ExchangeRateConverter />

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Multiple Providers */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <AppCard className="relative bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 dark:from-slate-800 dark:via-blue-900 dark:to-slate-800 border-2 border-blue-200 dark:border-blue-800 hover:border-blue-400 dark:hover:border-blue-600 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 dark:bg-blue-900 opacity-10 rounded-full blur-3xl" />
            <div className="relative space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Globe2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Multiple Providers
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Get rates from ECB, BAM, and other reliable sources
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <span>→</span>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Real-Time Updates */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-emerald-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <AppCard className="relative bg-gradient-to-br from-green-50 via-emerald-50 to-green-100 dark:from-slate-800 dark:via-green-900 dark:to-slate-800 border-2 border-green-200 dark:border-green-800 hover:border-green-400 dark:hover:border-green-600 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-green-200 dark:bg-green-900 opacity-10 rounded-full blur-3xl" />
            <div className="relative space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-400 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Real-Time Updates
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Instant conversion with live market rates
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <span>→</span>
              </div>
            </div>
          </AppCard>
        </div>

        {/* Easy Search */}
        <div className="group relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 rounded-2xl blur-xl opacity-0 group-hover:opacity-40 transition-opacity duration-500" />
          <AppCard className="relative bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 dark:from-slate-800 dark:via-purple-900 dark:to-slate-800 border-2 border-purple-200 dark:border-purple-800 hover:border-purple-400 dark:hover:border-purple-600 shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 dark:bg-purple-900 opacity-10 rounded-full blur-3xl" />
            <div className="relative space-y-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                <Search className="w-7 h-7 text-white" />
              </div>
              <div>
                <p className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  Easy Search
                </p>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                  Find any currency with intuitive search
                </p>
              </div>
              <div className="pt-2 flex items-center gap-2 text-purple-600 dark:text-purple-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <span>→</span>
              </div>
            </div>
          </AppCard>
        </div>
      </div>
    </div>
  );
}
