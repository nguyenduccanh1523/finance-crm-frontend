import { useEffect, useState, useCallback, useMemo } from "react";
import { ArrowRightLeft, Zap, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useExchangeRate,
  type ConversionResult,
  type Currency,
  type ExchangeRateData,
  type Provider,
} from "@/lib/hooks/exchange-rate/useExchangeRate";

// Mapping currency codes to country flags
const FLAG_MAP: Record<string, string> = {
  AED: "🇦🇪",
  AFN: "🇦🇫",
  ALL: "🇦🇱",
  AMD: "🇦🇲",
  ANG: "🇨🇼",
  AOA: "🇦🇴",
  ARS: "🇦🇷",
  AUD: "🇦🇺",
  AZN: "🇦🇿",
  BAM: "🇧🇦",
  BBD: "🇧🇧",
  BDT: "🇧🇩",
  BGN: "🇧🇬",
  BHD: "🇧🇭",
  BIF: "🇧🇮",
  BMD: "🇧🇲",
  BND: "🇧🇳",
  BOB: "🇧🇴",
  BRL: "🇧🇷",
  BSD: "🇧🇸",
  BTC: "₿",
  BTN: "🇧🇹",
  BWP: "🇧🇼",
  BYN: "🇧🇾",
  BZD: "🇧🇿",
  CAD: "🇨🇦",
  CDF: "🇨🇩",
  CHF: "🇨🇭",
  CLF: "🇨🇱",
  CLP: "🇨🇱",
  CNY: "🇨🇳",
  COP: "🇨🇴",
  CRC: "🇨🇷",
  CUC: "🇨🇺",
  CUP: "🇨🇺",
  CVE: "🇨🇻",
  CZK: "🇨🇿",
  DJF: "🇩🇯",
  DKK: "🇩🇰",
  DOP: "🇩🇴",
  DZD: "🇩🇿",
  EGP: "🇪🇬",
  ERN: "🇪🇷",
  ETB: "🇪🇹",
  EUR: "🇪🇺",
  FJD: "🇫🇯",
  FKP: "🇫🇰",
  GBP: "🇬🇧",
  GEL: "🇬🇪",
  GHS: "🇬🇭",
  GIP: "🇬🇮",
  GMD: "🇬🇲",
  GNF: "🇬🇳",
  GTQ: "🇬🇹",
  GYD: "🇬🇾",
  HKD: "🇭🇰",
  HNL: "🇭🇳",
  HRK: "🇭🇷",
  HTG: "🇭🇹",
  HUF: "🇭🇺",
  IDR: "🇮🇩",
  ILS: "🇮🇱",
  INR: "🇮🇳",
  IQD: "🇮🇶",
  IRR: "🇮🇷",
  ISK: "🇮🇸",
  JMD: "🇯🇲",
  JOD: "🇯🇴",
  JPY: "🇯🇵",
  KES: "🇰🇪",
  KGS: "🇰🇬",
  KHR: "🇰🇭",
  KMF: "🇰🇲",
  KPW: "🇰🇵",
  KRW: "🇰🇷",
  KWD: "🇰🇼",
  KYD: "🇰🇾",
  KZT: "🇰🇿",
  LAK: "🇱🇦",
  LBP: "🇱🇧",
  LKR: "🇱🇰",
  LRD: "🇱🇷",
  LSL: "🇱🇸",
  LYD: "🇱🇾",
  MAD: "🇲🇦",
  MDL: "🇲🇩",
  MGA: "🇲🇬",
  MKD: "🇲🇰",
  MMK: "🇲🇲",
  MNT: "🇲🇳",
  MOP: "🇲🇴",
  MRU: "🇲🇷",
  MUR: "🇲🇺",
  MVR: "🇲🇻",
  MWK: "🇲🇼",
  MXN: "🇲🇽",
  MYR: "🇲🇾",
  MZN: "🇲🇿",
  NAD: "🇳🇦",
  NGN: "🇳🇬",
  NIO: "🇳🇮",
  NOK: "🇳🇴",
  NPR: "🇳🇵",
  NZD: "🇳🇿",
  OMR: "🇴🇲",
  PAB: "🇵🇦",
  PEN: "🇵🇪",
  PGK: "🇵🇬",
  PHP: "🇵🇭",
  PKR: "🇵🇰",
  PLN: "🇵🇱",
  PYG: "🇵🇾",
  QAR: "🇶🇦",
  RON: "🇷🇴",
  RSD: "🇷🇸",
  RUB: "🇷🇺",
  RWF: "🇷🇼",
  SAR: "🇸🇦",
  SBD: "🇸🇧",
  SCR: "🇸🇨",
  SDG: "🇸🇩",
  SEK: "🇸🇪",
  SGD: "🇸🇬",
  SHP: "🇸🇭",
  SLL: "🇸🇱",
  SOS: "🇸🇴",
  SRD: "🇸🇷",
  SSP: "🇸🇸",
  STN: "🇸🇹",
  SYP: "🇸🇾",
  SZL: "🇸🇿",
  THB: "🇹🇭",
  TJS: "🇹🇯",
  TMT: "🇹🇲",
  TND: "🇹🇳",
  TOP: "🇹🇴",
  TRY: "🇹🇷",
  TTD: "🇹🇹",
  TWD: "🇹🇼",
  TZS: "🇹🇿",
  UAH: "🇺🇦",
  UGX: "🇺🇬",
  USD: "🇺🇸",
  UYU: "🇺🇾",
  UZS: "🇺🇿",
  VES: "🇻🇪",
  VND: "🇻🇳",
  VUV: "🇻🇺",
  WST: "🇼🇸",
  XAF: "💶",
  XAG: "🥈",
  XAU: "🥇",
  XCD: "💵",
  XOF: "💶",
  XPF: "💶",
  YER: "🇾🇪",
  ZAR: "🇿🇦",
  ZMW: "🇿🇲",
  ZWL: "🇿🇼",
};

const ZERO_DECIMAL_CURRENCIES = new Set([
  "BIF",
  "CLP",
  "DJF",
  "GNF",
  "ISK",
  "JPY",
  "KMF",
  "KRW",
  "PYG",
  "RWF",
  "UGX",
  "VND",
  "VUV",
  "XAF",
  "XOF",
  "XPF",
]);

export function ExchangeRateConverter() {
  const {
    loading,
    convertCurrency,
    getCurrencies,
    getProviders,
    getExchangeRate,
  } = useExchangeRate();

  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("VND");
  const [amount, setAmount] = useState("1");
  const [selectedProvider, setSelectedProvider] = useState("");
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [pairResult, setPairResult] = useState<ExchangeRateData | null>(null);
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      const [currenciesData, providersData] = await Promise.all([
        getCurrencies(),
        getProviders(),
      ]);
      setCurrencies(currenciesData);
      setProviders(providersData);
      if (providersData.length > 0) {
        setSelectedProvider(providersData[0].key);
      }
    };
    loadData();
  }, [getCurrencies, getProviders]);

  // Fetch pair data when from/to changes
  useEffect(() => {
    const fetchPair = async () => {
      if (fromCurrency && toCurrency) {
        const data = await getExchangeRate(
          fromCurrency,
          toCurrency,
          selectedDate,
        );
        setPairResult(data);
      }
    };
    fetchPair();
  }, [fromCurrency, toCurrency, selectedDate, getExchangeRate]);

  const handleConvert = useCallback(async () => {
    if (!amount || parseFloat(amount) <= 0) return;
    const data = await convertCurrency(
      parseFloat(amount),
      fromCurrency,
      toCurrency,
    );
    setResult(data);
  }, [amount, fromCurrency, toCurrency, convertCurrency]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setSearchFrom("");
    setSearchTo("");
  };

  const filteredFromCurrencies = useMemo(
    () =>
      currencies.filter(
        (c) =>
          c.iso_code.includes(searchFrom.toUpperCase()) ||
          c.name.toLowerCase().includes(searchFrom.toLowerCase()),
      ),
    [currencies, searchFrom],
  );

  const filteredToCurrencies = useMemo(
    () =>
      currencies.filter(
        (c) =>
          c.iso_code.includes(searchTo.toUpperCase()) ||
          c.name.toLowerCase().includes(searchTo.toLowerCase()),
      ),
    [currencies, searchTo],
  );

  const formatDisplayAmount = useCallback(
    (value: number, currencyCode: string) => {
      const fractionDigits = ZERO_DECIMAL_CURRENCIES.has(currencyCode) ? 0 : 2;
      return value.toLocaleString(undefined, {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits,
      });
    },
    [],
  );

  const CurrencySelector = useCallback(
    ({ value, onChange, search, onSearchChange, filtered, label }: any) => {
      return (
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            {label}
          </label>
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className="w-full h-12 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-lg hover:border-blue-400 dark:hover:border-blue-500 focus:border-blue-500 dark:focus:border-blue-400 transition-colors shadow-sm">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent
              className="w-full max-w-sm"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <div className="p-2 pb-0 sticky top-0 bg-white dark:bg-slate-800 z-10 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <Input
                    autoFocus
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-10 text-sm pl-10 pr-3 bg-slate-50 dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-md focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all placeholder:text-slate-400"
                  />
                </div>
              </div>
              <div className="max-h-[300px] overflow-y-auto py-1">
                {filtered.length > 0 ? (
                  filtered.map((currency: Currency) => (
                    <SelectItem
                      key={currency.iso_code}
                      value={currency.iso_code}
                      className="cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900 transition-colors"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-lg w-6 text-center">
                          {FLAG_MAP[currency.iso_code] || "💱"}
                        </span>
                        <span className="font-semibold text-sm min-w-[50px]">
                          {currency.iso_code}
                        </span>
                        <span className="text-slate-500 dark:text-slate-400 text-sm truncate">
                          {currency.name}
                        </span>
                      </span>
                    </SelectItem>
                  ))
                ) : (
                  <div className="p-3 text-sm text-center text-slate-500 dark:text-slate-400">
                    No currencies found
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
        </div>
      );
    },
    [],
  );

  return (
    <div className="w-full max-w-2xl mx-auto">
      <style>{`
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -moz-appearance: textfield;
        }
      `}</style>

      <Card className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 border-2 border-blue-200 dark:border-slate-700 shadow-lg overflow-hidden">
        <CardContent className="space-y-3 px-4 pb-4 pt-4 sm:px-6 sm:pb-6 sm:pt-6">
          {/* Amount Input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
              Amount
            </label>
            <div className="relative">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                min="0"
                step="any"
                inputMode="decimal"
                className="h-10 text-base pr-10 pl-3 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-slate-500 pointer-events-none">
                {FLAG_MAP[fromCurrency] || "💱"}
              </span>
            </div>
          </div>

          {/* From/To Row */}
          <div className="grid grid-cols-5 gap-2 items-end">
            <div className="col-span-2">
              <CurrencySelector
                value={fromCurrency}
                onChange={setFromCurrency}
                search={searchFrom}
                onSearchChange={setSearchFrom}
                filtered={filteredFromCurrencies}
                label="From"
              />
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleSwap}
                variant="outline"
                size="icon"
                className="h-8 w-8 rounded border border-blue-400 dark:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900 transition-all"
              >
                <ArrowRightLeft className="w-4 h-4 text-blue-500" />
              </Button>
            </div>

            <div className="col-span-2">
              <CurrencySelector
                value={toCurrency}
                onChange={setToCurrency}
                search={searchTo}
                onSearchChange={setSearchTo}
                filtered={filteredToCurrencies}
                label="To"
              />
            </div>
          </div>

          {/* Date & Provider Row */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-9 text-sm bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase">
                Provider
              </label>
              <Select
                value={selectedProvider}
                onValueChange={setSelectedProvider}
              >
                <SelectTrigger className="h-9 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 text-sm rounded">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {providers.map((p) => (
                    <SelectItem key={p.key} value={p.key} className="text-sm">
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Pair Info Display */}
          {pairResult && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-700 border border-blue-200 dark:border-slate-600 rounded p-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-600 dark:text-slate-300">
                  Rate:
                </span>
                <span className="font-semibold text-blue-600 dark:text-blue-400">
                  1 {pairResult.from} ={" "}
                  {pairResult.rate.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 6,
                  })}{" "}
                  {pairResult.to}
                </span>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <Button
            onClick={handleConvert}
            disabled={loading || !amount || parseFloat(amount) <= 0}
            className="w-full h-14 bg-gradient-to-r from-blue-500 via-blue-600 to-indigo-600 hover:from-blue-600 hover:via-blue-700 hover:to-indigo-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 gap-2 group border-0"
          >
            <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            <span className="inline-block">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⚡</span>
                  Converting...
                </span>
              ) : (
                "Convert Now"
              )}
            </span>
          </Button>

          {/* Result */}
          {result && (
            <div className="space-y-4 mt-8 pt-6 border-t-2 border-blue-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
              {/* Main Result Card */}
              <div className="bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-2xl hover:shadow-3xl transition-shadow">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex-1">
                    <p className="text-green-100 text-sm font-medium mb-1">
                      From
                    </p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl font-bold tracking-tight">
                        {result.amount.toLocaleString()}
                      </p>
                      <p className="text-2xl font-semibold text-green-100">
                        {result.from}
                      </p>
                    </div>
                  </div>
                  <span className="text-5xl ml-4">{FLAG_MAP[result.from]}</span>
                </div>

                <div className="bg-white/30 h-1 rounded-full my-6 backdrop-blur"></div>

                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="text-green-100 text-sm font-medium mb-1">
                      To
                    </p>
                    <div className="flex items-baseline gap-3">
                      <p className="text-4xl font-bold tracking-tight">
                        {formatDisplayAmount(result.convertedAmount, result.to)}
                      </p>
                      <p className="text-2xl font-semibold text-green-100">
                        {result.to}
                      </p>
                    </div>
                  </div>
                  <span className="text-5xl ml-4">{FLAG_MAP[result.to]}</span>
                </div>
              </div>

              {/* Details Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 space-y-4 border-2 border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100 dark:border-slate-700">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Exchange Rate
                  </span>
                  <span className="font-bold text-base text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                    1 {result.from} ={" "}
                    {result.rate.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 6,
                    })}{" "}
                    {result.to}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    Data Provider
                  </span>
                  <Badge className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-0 font-medium px-3 py-1">
                    {result.source}
                  </Badge>
                </div>

                {result.cached && (
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100 dark:border-slate-700">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">
                      Cached Data
                    </span>
                    <Badge
                      variant="secondary"
                      className="text-xs font-medium px-3 py-1"
                    >
                      📦 Cached
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
