import { StatCard } from "@/components/charts/StatCard";
import { AreaChartCard } from "@/components/charts/AreaChartCard";

const data = [
  { name: "Jun 1", value: 400 },
  { name: "Jun 5", value: 800 },
  { name: "Jun 10", value: 500 },
  { name: "Jun 15", value: 900 },
  { name: "Jun 20", value: 650 },
  { name: "Jun 30", value: 1200 },
];

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <StatCard title="Revenue" value="$1,250" subtitle="Last month" trend="+12%" />
        <StatCard title="New Users" value="1,234" subtitle="This month" trend="-20%" />
        <StatCard title="Active Accounts" value="45,678" subtitle="Retention high" trend="+12%" />
        <StatCard title="Growth Rate" value="4.5%" subtitle="Increasing" trend="+4.5%" />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-3">
        <AreaChartCard title="Visitors" data={data} />
        <AreaChartCard title="Monthly Revenue" data={data} />
        <AreaChartCard title="Engagement" data={data} />
      </div>
    </div>
  );
}
