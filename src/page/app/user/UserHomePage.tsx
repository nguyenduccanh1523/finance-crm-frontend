import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosClient } from "@/lib/api/axiosClient";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  Building,
  PiggyBank,
  RefreshCw,
  Calendar,
  AlertCircle,
  ChevronRight,
  Plus,
  CreditCard
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

// Interfaces
interface Account {
  id: string;
  name: string;
  type: string;
  currency: string;
  currentBalanceCents: number;
}

interface Trend {
  status: "NEUTRAL" | "POSITIVE" | "NEGATIVE";
  summary: string;
  detail: string;
}

interface BalanceInfo {
  netFlowCents: number;
  currency: string;
  accounts: Account[];
  accountCount: number;
  trend: Trend;
}

interface MonthlyStat {
  totalCents: number;
  currency: string;
  vsLastMonthCents: number;
  vsLastMonthPercent: number;
  changeLabel: string;
  remainingCents?: number;
}

interface WeeklySpendingDay {
  date: string;
  totalCents: number;
}

interface RecentTransaction {
  id: string;
  note: string;
  counterparty: string | null;
  type: "EXPENSE" | "INCOME" | "GOAL_ALLOCATION" | "TRANSFER";
  amountCents: number;
  currency: string;
  occurredAt: string;
  categoryName: string | null;
  categoryIcon: string | null;
  accountName: string;
}

interface DashboardData {
  balance: BalanceInfo;
  thisMonthIncome: MonthlyStat;
  thisMonthExpense: MonthlyStat;
  weeklySpending: WeeklySpendingDay[];
  recentTransactions: RecentTransaction[];
}

export function UserHomePage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/personal/dashboard");
      setData(response.data.data || response.data);
    } catch (err: any) {
      console.error("Error fetching dashboard data:", err);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Không thể kết nối tới máy chủ. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatCurrency = (amountCents: number, currency: string) => {
    const noDecimalCurrencies = ["VND", "JPY", "KRW", "PHP", "IDR", "THB"];

    if (noDecimalCurrencies.includes(currency)) {
      return `${Math.round(amountCents).toLocaleString("vi-VN")} ₫`;
    }

    const amount = amountCents / 100;
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    }).format(amount);
  };

  const formatChartDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" });
    } catch (e) {
      return dateStr;
    }
  };

  const formatDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    } catch (e) {
      return dateStr;
    }
  };

  const getTransactionIcon = (type: string, categoryIcon?: string | null) => {
    if (categoryIcon) return <span className="text-lg">{categoryIcon}</span>;

    switch (type) {
      case "INCOME":
        return <ArrowUpRight className="h-5 w-5 text-emerald-500" />;
      case "EXPENSE":
        return <ArrowDownRight className="h-5 w-5 text-rose-500" />;
      case "GOAL_ALLOCATION":
        return <PiggyBank className="h-5 w-5 text-indigo-500" />;
      case "TRANSFER":
        return <RefreshCw className="h-5 w-5 text-amber-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-slate-500" />;
    }
  };

  const getTransactionColorClass = (type: string) => {
    switch (type) {
      case "INCOME":
        return "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20";
      case "EXPENSE":
        return "bg-rose-500/10 text-rose-500 border border-rose-500/20";
      case "GOAL_ALLOCATION":
        return "bg-indigo-500/10 text-indigo-500 border border-indigo-500/20";
      case "TRANSFER":
        return "bg-amber-500/10 text-amber-500 border border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-500 border border-slate-500/20";
    }
  };

  const getTrendStyle = (status: string) => {
    switch (status) {
      case "POSITIVE":
        return {
          bg: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-300",
          icon: <TrendingUp className="h-6 w-6 text-emerald-500 animate-bounce" />,
          badge: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20",
          text: "Tích cực"
        };
      case "NEGATIVE":
        return {
          bg: "from-rose-500/10 to-orange-500/10 border-rose-500/20 text-rose-700 dark:text-rose-300",
          icon: <TrendingDown className="h-6 w-6 text-rose-500 animate-bounce" />,
          badge: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/20",
          text: "Cần chú ý"
        };
      default:
        return {
          bg: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300",
          icon: <AlertCircle className="h-6 w-6 text-blue-500" />,
          badge: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20",
          text: "Ổn định"
        };
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[450px] text-center p-6 border border-rose-500/20 bg-rose-500/5 rounded-2xl gap-4 animate-in">
        <div className="p-4 rounded-full bg-rose-500/10">
          <AlertCircle className="h-10 w-10 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold">Không thể tải dữ liệu tổng quan</h2>
        <p className="text-muted-foreground max-w-md text-sm">{error || "Lỗi không xác định."}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-2 px-5 py-2.5 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl font-medium transition shadow-md active:scale-95"
        >
          Thử lại ngay
        </button>
      </div>
    );
  }

  // Calculate totals by currency
  const balanceByCurrency: Record<string, number> = {};
  data.balance.accounts.forEach((acc) => {
    balanceByCurrency[acc.currency] = (balanceByCurrency[acc.currency] || 0) + acc.currentBalanceCents;
  });

  const formattedTotals = Object.entries(balanceByCurrency)
    .map(([curr, total]) => formatCurrency(total, curr))
    .join(" / ");

  // Prepare chart data
  const chartData = data.weeklySpending.map((day) => {
    const isVnd = data.balance.currency === "VND";
    const amount = isVnd ? day.totalCents : day.totalCents / 100;
    return {
      name: formatChartDate(day.date),
      amount: amount,
      formattedAmount: formatCurrency(day.totalCents, data.balance.currency),
    };
  });

  const trendStyle = getTrendStyle(data.balance.trend.status);

  return (
    <div className="flex flex-col gap-8 animate-in">
      {/* TIÊU ĐỀ & LỜI CHÀO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Chào buổi sáng, <span className="bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">chào mừng trở lại!</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Dưới đây là tổng quan tài chính cá nhân của bạn ngày hôm nay.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            to="/app/transactions"
            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-muted/50 transition font-medium text-sm"
          >
            Quản lý giao dịch
          </Link>
          <Link
            to="/app/transactions"
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl transition font-medium text-sm shadow-sm"
          >
            <Plus className="h-4 w-4" /> Thêm giao dịch
          </Link>
        </div>
      </div>

      {/* XU HƯỚNG TỔNG QUAN */}
      <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 rounded-2xl border bg-gradient-to-r ${trendStyle.bg} transition-all duration-300 hover:shadow-sm`}>
        <div className="p-3 rounded-xl bg-background/80 shadow-sm border border-black/5 dark:border-white/5">
          {trendStyle.icon}
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-base">{data.balance.trend.summary}</span>
            <Badge className={`${trendStyle.badge} uppercase font-extrabold hover:bg-transparent`}>
              {trendStyle.text}
            </Badge>
          </div>
          <p className="text-sm opacity-90 leading-relaxed">{data.balance.trend.detail}</p>
        </div>
      </div>

      {/* HỘP THỐNG KÊ CHI TIẾT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Số dư tổng */}
        <Card className="shadow-sm hover:shadow-md transition duration-300 border-l-4 border-l-blue-500 bg-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Tổng Số Dư Khả Dụng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight mt-1 text-blue-600 dark:text-blue-400 break-words">
              {formattedTotals || "0 ₫"}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-3 border-border/50">
              <span className="flex items-center gap-1 font-semibold">
                <Wallet className="h-3.5 w-3.5" /> {data.balance.accountCount} tài khoản
              </span>
              <span>Dòng tiền: {formatCurrency(data.balance.netFlowCents, data.balance.currency)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Thu nhập tháng */}
        <Card className="shadow-sm hover:shadow-md transition duration-300 border-l-4 border-l-emerald-500 bg-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Thu Nhập Tháng Này</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight mt-1 text-emerald-600 dark:text-emerald-400">
              {formatCurrency(data.thisMonthIncome.totalCents, data.thisMonthIncome.currency)}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-3 border-border/50">
              <span className={`flex items-center gap-0.5 font-bold ${data.thisMonthIncome.vsLastMonthPercent >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                {data.thisMonthIncome.vsLastMonthPercent >= 0 ? "+" : ""}{data.thisMonthIncome.vsLastMonthPercent}%
              </span>
              <span className="truncate max-w-[150px]">{data.thisMonthIncome.changeLabel}</span>
            </div>
          </CardContent>
        </Card>

        {/* Chi tiêu tháng */}
        <Card className="shadow-sm hover:shadow-md transition duration-300 border-l-4 border-l-rose-500 bg-card/60 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/5 rounded-full -mr-8 -mt-8 pointer-events-none" />
          <CardHeader className="pb-2">
            <CardDescription className="text-sm font-medium">Chi Tiêu Tháng Này</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black tracking-tight mt-1 text-rose-600 dark:text-rose-400">
              {formatCurrency(data.thisMonthExpense.totalCents, data.thisMonthExpense.currency)}
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-3 border-border/50">
              {data.thisMonthExpense.remainingCents !== undefined && data.thisMonthExpense.remainingCents > 0 ? (
                <span className="text-amber-500 font-semibold">
                  Còn lại: {formatCurrency(data.thisMonthExpense.remainingCents, data.thisMonthExpense.currency)}
                </span>
              ) : (
                <span className={`flex items-center gap-0.5 font-bold ${data.thisMonthExpense.vsLastMonthPercent <= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                  {data.thisMonthExpense.vsLastMonthPercent >= 0 ? "+" : ""}{data.thisMonthExpense.vsLastMonthPercent}%
                </span>
              )}
              <span className="truncate max-w-[150px]">{data.thisMonthExpense.changeLabel}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KHU VỰC BẢN ĐỒ CHI TIÊU & TÀI KHOẢN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CỘT TRÁI: CHI TIÊU HÀNG TUẦN & DANH SÁCH TÀI KHOẢN */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Biểu đồ chi tiêu */}
          <Card className="shadow-sm bg-card/60 backdrop-blur-sm border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg font-bold">Chi Tiêu Hàng Tuần</CardTitle>
                <CardDescription>Chi tiêu 7 ngày gần nhất của bạn</CardDescription>
              </div>
              <Badge variant="outline" className="border-indigo-500/20 bg-indigo-500/5 text-indigo-600 dark:text-indigo-400">
                Tuần này
              </Badge>
            </CardHeader>
            <CardContent className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="spending-gradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.05} />
                  <XAxis
                    dataKey="name"
                    tickLine={false}
                    axisLine={false}
                    className="text-xs text-muted-foreground font-medium"
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    className="text-xs text-muted-foreground font-medium"
                    tickFormatter={(val) => {
                      if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
                      if (val >= 1000) return `${(val / 1000).toFixed(0)}k`;
                      return val;
                    }}
                  />
                  <Tooltip
                    formatter={(value: any, name: any, props: any) => [
                      props.payload.formattedAmount,
                      "Chi tiêu"
                    ]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "12px",
                      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                      fontSize: "12px",
                      color: "hsl(var(--foreground))"
                    }}
                    labelStyle={{ fontWeight: "bold", marginBottom: "4px" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fill="url(#spending-gradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Tài khoản khả dụng */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Tài Khoản Của Bạn</h2>
              <Link
                to="/app/account"
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                Tất cả tài khoản <ChevronRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {data.balance.accounts.map((acc, i) => {
                const isCash = acc.type === "CASH";
                const bgGradient = isCash
                  ? "from-indigo-600 to-violet-500 shadow-indigo-500/10"
                  : "from-emerald-600 to-teal-500 shadow-emerald-500/10";
                const Icon = isCash ? Wallet : Building;

                return (
                  <div
                    key={acc.id || i}
                    className={`relative overflow-hidden rounded-2xl p-6 bg-gradient-to-br ${bgGradient} text-white shadow-lg flex flex-col justify-between h-40 transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl`}
                  >
                    {/* Họa tiết trang trí */}
                    <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mb-10 pointer-events-none" />
                    <div className="absolute left-1/3 top-1/4 w-12 h-12 bg-white/5 rounded-full pointer-events-none" />

                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <p className="text-xs font-medium text-white/70 uppercase tracking-widest">{acc.type}</p>
                        <h3 className="font-extrabold text-lg text-white truncate max-w-[200px]">
                          {acc.name}
                        </h3>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md">
                        <Icon className="h-5 w-5 text-white" />
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-medium text-white/70">Số dư hiện tại</p>
                      <p className="text-2xl font-black tracking-tight mt-1">
                        {formatCurrency(acc.currentBalanceCents, acc.currency)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* CỘT PHẢI: GIAO DỊCH GẦN ĐÂY */}
        <Card className="shadow-sm bg-card/60 backdrop-blur-sm border flex flex-col h-[560px]">
          <CardHeader className="flex flex-row items-center justify-between border-b pb-4">
            <div>
              <CardTitle className="text-lg font-bold">Giao Dịch Gần Đây</CardTitle>
              <CardDescription>Các hoạt động tài chính mới nhất</CardDescription>
            </div>
            <Link
              to="/app/transactions"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5"
            >
              Xem tất cả
            </Link>
          </CardHeader>
          <CardContent className="flex-1 custom-scroll overflow-y-auto p-4">
            {data.recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 gap-3">
                <div className="p-3 bg-muted rounded-full text-muted-foreground">
                  <PiggyBank className="h-6 w-6" />
                </div>
                <p className="text-sm font-medium text-muted-foreground">Chưa có giao dịch nào gần đây</p>
                <Link
                  to="/app/transactions"
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Tạo giao dịch đầu tiên
                </Link>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border/40">
                {data.recentTransactions.map((tx, i) => {
                  const isIncome = tx.type === "INCOME";
                  const isExpense = tx.type === "EXPENSE";
                  const isGoal = tx.type === "GOAL_ALLOCATION";
                  
                  let sign = "";
                  let amountColor = "";
                  if (isIncome) {
                    sign = "+";
                    amountColor = "text-emerald-500 font-extrabold";
                  } else if (isExpense || isGoal) {
                    sign = "-";
                    amountColor = "text-rose-500 font-extrabold";
                  } else {
                    amountColor = "font-extrabold";
                  }

                  const titleText = tx.note || tx.counterparty || tx.categoryName || "Giao dịch";

                  return (
                    <div
                      key={tx.id || i}
                      className="flex items-center justify-between py-3.5 hover:bg-muted/30 px-2 rounded-xl transition-colors duration-200"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={`p-2.5 rounded-xl ${getTransactionColorClass(tx.type)} shadow-sm shrink-0`}>
                          {getTransactionIcon(tx.type, tx.categoryIcon)}
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm text-foreground truncate max-w-[140px] sm:max-w-[180px]">
                            {titleText}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-muted-foreground font-medium flex items-center gap-0.5">
                              <Calendar className="h-3 w-3 shrink-0" /> {formatDateTime(tx.occurredAt)}
                            </span>
                            <span className="text-[10px] text-muted-foreground">•</span>
                            <span className="text-[10px] text-muted-foreground truncate font-medium max-w-[80px]">
                              {tx.accountName}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-sm ${amountColor}`}>
                          {sign} {formatCurrency(tx.amountCents, tx.currency)}
                        </span>
                        <div className="text-[9px] text-muted-foreground mt-0.5 font-bold uppercase tracking-wider">
                          {tx.type.replace("_", " ")}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8 animate-pulse">
      {/* Greeting Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2 w-full md:w-1/3">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Skeleton className="h-10 w-28 rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>
      </div>

      {/* Trend Alert Skeleton */}
      <Skeleton className="h-24 rounded-2xl w-full" />

      {/* Top Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 rounded-2xl border bg-card p-6 flex flex-col justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/3" />
              <Skeleton className="h-8 w-2/3" />
            </div>
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>

      {/* Main Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="h-80 rounded-2xl border bg-card p-6 space-y-4">
            <Skeleton className="h-5 w-1/4" />
            <Skeleton className="h-56 w-full" />
          </div>

          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[1, 2].map((i) => (
                <div key={i} className="h-40 rounded-2xl border bg-card p-6" />
              ))}
            </div>
          </div>
        </div>

        {/* Transactions Column */}
        <div className="h-[560px] rounded-2xl border bg-card p-6 space-y-4">
          <Skeleton className="h-5 w-1/3" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-4 w-1/6 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
