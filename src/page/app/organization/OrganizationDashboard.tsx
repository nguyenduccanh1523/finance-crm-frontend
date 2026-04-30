import { useOutletContext } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  FolderOpen,
  BarChart3,
  Zap,
  Plus,
  ArrowRight,
} from "lucide-react";

interface OrganizationDashboardContextType {
  selectedOrgId: string;
}

export function OrganizationDashboard() {
  const { selectedOrgId } =
    useOutletContext<OrganizationDashboardContextType>();

  const stats = [
    {
      icon: Users,
      label: "Thành viên đội",
      value: "12",
      change: "+2 tháng này",
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: FolderOpen,
      label: "Dự án đang hoạt động",
      value: "8",
      change: "+1 tuần này",
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: BarChart3,
      label: "Hiệu suất",
      value: "94%",
      change: "Xuất sắc",
      color: "from-emerald-500 to-teal-500",
    },
    {
      icon: Zap,
      label: "Công việc hoàn thành",
      value: "156",
      change: "+24 tuần này",
      color: "from-orange-500 to-red-500",
    },
  ];

  const recentActivities = [
    {
      type: "user_joined",
      user: "John Doe",
      action: "đã tham gia đội",
      time: "2 giờ trước",
    },
    {
      type: "project_created",
      user: "Jane Smith",
      action: "tạo dự án Q4 Planning",
      time: "4 giờ trước",
    },
    {
      type: "task_completed",
      user: "Mike Johnson",
      action: "hoàn thành tác vụ API Integration",
      time: "1 ngày trước",
    },
    {
      type: "member_invited",
      user: "Sarah Wilson",
      action: "mời 3 thành viên mới",
      time: "2 ngày trước",
    },
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-white dark:bg-slate-900 light:bg-white p-6 md:p-8 transition-colors duration-300">
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white light:text-slate-900 mb-2">
          Dashboard tổ chức
        </h2>
        <p className="text-slate-600 dark:text-slate-400 light:text-slate-600">
          Chào mừng trở lại! Đây là những gì đang xảy ra với tổ chức của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card
              key={stat.label}
              className="p-5 md:p-6 bg-white dark:bg-slate-800 light:bg-white border-slate-200 dark:border-slate-700 light:border-slate-200 hover:shadow-lg transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 light:text-slate-600 mb-2">
                {stat.label}
              </p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white light:text-slate-900">
                  {stat.value}
                </p>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 light:text-slate-500 mt-2">
                {stat.change}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 light:bg-white border-slate-200 dark:border-slate-700 light:border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white light:text-slate-900">
              Hoạt động gần đây
            </h3>
            <Button
              variant="outline"
              size="sm"
              className="border-slate-300 dark:border-slate-600 light:border-slate-300 text-slate-700 dark:text-slate-300 light:text-slate-700"
            >
              Xem tất cả
            </Button>
          </div>

          <div className="space-y-3">
            {recentActivities.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 light:hover:bg-slate-50 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
                  {activity.user.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white light:text-slate-900">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    <span className="text-slate-600 dark:text-slate-400 light:text-slate-600">
                      {activity.action}
                    </span>
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 light:text-slate-500">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6 bg-white dark:bg-slate-800 light:bg-white border-slate-200 dark:border-slate-700 light:border-slate-200">
          <h3 className="text-lg md:text-xl font-semibold mb-4 text-slate-900 dark:text-white light:text-slate-900">
            Hành động nhanh
          </h3>

          <div className="space-y-2">
            <Button
              className="w-full justify-start rounded-lg border-slate-300 dark:border-slate-600 light:border-slate-300"
              variant="outline"
            >
              <Plus className="w-4 h-4 mr-2" />
              Dự án mới
            </Button>

            <Button
              className="w-full justify-start rounded-lg border-slate-300 dark:border-slate-600 light:border-slate-300 text-slate-700 dark:text-slate-300 light:text-slate-700"
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              Mời thành viên
            </Button>

            <Button
              className="w-full justify-start rounded-lg border-slate-300 dark:border-slate-600 light:border-slate-300 text-slate-700 dark:text-slate-300 light:text-slate-700"
              variant="outline"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Xem báo cáo
            </Button>

            <Button
              className="w-full justify-start rounded-lg border-slate-300 dark:border-slate-600 light:border-slate-300 text-slate-700 dark:text-slate-300 light:text-slate-700"
              variant="outline"
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Duyệt dự án
            </Button>
          </div>
        </Card>
      </div>

      {/* Teams Section */}
      <div className="mt-8">
        <Card className="p-6 bg-white dark:bg-slate-800 light:bg-white border-slate-200 dark:border-slate-700 light:border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg md:text-xl font-semibold text-slate-900 dark:text-white light:text-slate-900">
              Các đội
            </h3>
            <Button size="sm" className="rounded-lg">
              <Plus className="w-4 h-4 mr-2" />
              Đội mới
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { name: "Đội Frontend", members: 5, projects: 3 },
              { name: "Đội Backend", members: 4, projects: 2 },
              { name: "Đội Design", members: 3, projects: 4 },
            ].map((team, idx) => (
              <div
                key={idx}
                className="p-4 border border-slate-200 dark:border-slate-700 light:border-slate-200 bg-white dark:bg-slate-700/50 light:bg-slate-50 rounded-lg hover:border-slate-300 dark:hover:border-slate-600 light:hover:border-slate-300 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-slate-900 dark:text-white light:text-slate-900">
                    {team.name}
                  </h4>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 light:group-hover:text-slate-600 transition-colors" />
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 light:text-slate-600">
                  {team.members} thành viên • {team.projects} dự án
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
