"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TrendingUp, Users, Wallet, BarChart2 } from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const chartData = [
  { month: "Jan", revenue: 2400, expenses: 1400 },
  { month: "Feb", revenue: 3200, expenses: 2100 },
  { month: "Mar", revenue: 4500, expenses: 2000 },
  { month: "Apr", revenue: 5000, expenses: 2300 },
  { month: "May", revenue: 6100, expenses: 2800 },
  { month: "Jun", revenue: 7200, expenses: 3100 },
];

export function AdminHomePage() {
  return (
    <div className="p-8 space-y-8">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here’s what’s happening inside your Finance CRM today.
        </p>
      </div>

      {/* 4 OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <OverviewCard
          icon={<Users className="h-5 w-5 text-blue-500" />}
          title="Total Users"
          value="12,430"
          trend="+12.5%"
        />
        <OverviewCard
          icon={<Wallet className="h-5 w-5 text-green-500" />}
          title="Total Revenue"
          value="$54,200"
          trend="+18.1%"
        />
        <OverviewCard
          icon={<TrendingUp className="h-5 w-5 text-purple-500" />}
          title="Active Subscriptions"
          value="1,246"
          trend="+8.2%"
        />
        <OverviewCard
          icon={<BarChart2 className="h-5 w-5 text-orange-500" />}
          title="Growth Rate"
          value="4.7%"
          trend="+1.4%"
        />
      </div>

      {/* BIG CHART */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle>Revenue & Expenses (Last 6 months)</CardTitle>
        </CardHeader>

        <CardContent className="h-[330px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="month" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#e11d48"
                strokeWidth={3}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* RECENT ACTIVITY */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <ActivityItem
            title="New subscription"
            desc="User #12401 upgraded to Standard Plan"
          />
          <ActivityItem
            title="Payment success"
            desc="Invoice #INV-84723 processed successfully"
          />
          <ActivityItem
            title="User created"
            desc="New team member added (john.doe@example.com)"
          />
        </CardContent>
      </Card>
    </div>
  );
}

/* ---- COMPONENTS ---- */

function OverviewCard({ icon, title, value, trend }: any) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>

      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
        <p className="text-green-500 text-sm font-semibold">{trend}</p>
      </CardContent>
    </Card>
  );
}

function ActivityItem({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="border-b pb-3">
      <p className="font-semibold">{title}</p>
      <p className="text-muted-foreground text-sm">{desc}</p>
    </div>
  );
}
