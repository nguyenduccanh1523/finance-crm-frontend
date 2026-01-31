import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <Card>
        <CardContent className="py-4 text-sm text-muted-foreground">
          Trang quản trị tổng quan doanh nghiệp, gói subscription và người dùng.
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Users
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">120</div>
            <p className="text-xs text-muted-foreground">
              +12 trong 30 ngày gần đây
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Total Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">$3,400</div>
            <p className="text-xs text-muted-foreground">
              +18% so với tháng trước
            </p>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">
              Active Subscriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">45</div>
            <p className="text-xs text-muted-foreground">
              5 gói chuẩn bị hết hạn
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Simple chart mock */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* fake chart: 12 cột */}
            <div className="flex h-40 items-end gap-2 rounded-md bg-muted/40 p-3">
              {[
                30, 55, 45, 60, 70, 65, 80, 72, 68, 90, 88, 95,
              ].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/70"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Biểu đồ mô phỏng, bạn có thể thay bằng Recharts / Chart.js sau.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">
              Plan breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span>Starter</span>
              <span className="text-muted-foreground">24 users</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Standard</span>
              <span className="text-muted-foreground">15 users</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Enterprise</span>
              <span className="text-muted-foreground">6 orgs</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
