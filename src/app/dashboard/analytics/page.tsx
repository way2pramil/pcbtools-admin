import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { BarChart, AreaChart, PieChart } from "@/components/charts";
import { TrendingUp, Users, Activity, Zap } from "lucide-react";

export const dynamic = "force-dynamic";

export default function AnalyticsPage() {
  // Placeholder data - will connect to real data later
  const weeklyUsers = [
    { label: "Mon", value: 12 },
    { label: "Tue", value: 19 },
    { label: "Wed", value: 15 },
    { label: "Thu", value: 25 },
    { label: "Fri", value: 22 },
    { label: "Sat", value: 8 },
    { label: "Sun", value: 10 },
  ];

  const toolUsage = [
    { label: "Trace Width", value: 45 },
    { label: "Impedance", value: 30 },
    { label: "Converter", value: 25 },
  ];

  const stats = [
    { label: "Total Visits", value: "1,234", change: "+12%", icon: Users, trend: "up" },
    { label: "Active Users", value: "89", change: "+5%", icon: Activity, trend: "up" },
    { label: "Tool Uses", value: "456", change: "+23%", icon: Zap, trend: "up" },
    { label: "Growth Rate", value: "8.2%", change: "+2.1%", icon: TrendingUp, trend: "up" },
  ];

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">
          Usage statistics and trends for pcbtools.xyz
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="relative overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold tracking-tight">{stat.value}</p>
                </div>
                <div className="rounded-full bg-primary/10 p-3">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-3 flex items-center gap-1 text-xs">
                <span className="font-medium text-green-600 dark:text-green-400">
                  {stat.change}
                </span>
                <span className="text-muted-foreground">from last week</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly Active Users</CardTitle>
            <p className="text-xs text-muted-foreground">User activity over the past week</p>
          </CardHeader>
          <CardContent>
            <BarChart data={weeklyUsers} height={220} />
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Tool Usage</CardTitle>
            <p className="text-xs text-muted-foreground">Distribution by tool type</p>
          </CardHeader>
          <CardContent className="flex items-center justify-center pt-4">
            <PieChart data={toolUsage} size={160} />
          </CardContent>
        </Card>
      </div>

      {/* User Growth Trend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">User Growth Trend</CardTitle>
          <p className="text-xs text-muted-foreground">Daily active users over time</p>
        </CardHeader>
        <CardContent>
          <AreaChart data={weeklyUsers} height={240} />
        </CardContent>
      </Card>

      {/* Coming Soon */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-4 mb-4">
            <Activity className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold">Full Analytics Coming Soon</h3>
          <p className="text-sm text-muted-foreground mt-2 max-w-sm">
            Advanced metrics including page views, conversion rates, tool performance, 
            user retention, and geographic distribution.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
