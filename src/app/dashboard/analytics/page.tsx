import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { BarChart, AreaChart, PieChart } from "@/components/charts";

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
    { label: "Trace Width", value: 45, color: "#3b82f6" },
    { label: "Impedance", value: 30, color: "#10b981" },
    { label: "Converter", value: 25, color: "#f59e0b" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">
          Usage statistics and trends
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <BarChart data={weeklyUsers} height={200} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tool Usage Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <PieChart data={toolUsage} size={180} />
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>User Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <AreaChart data={weeklyUsers} height={200} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <p>Full analytics coming soon...</p>
          <p className="text-sm mt-2">
            Will include: page views, conversion rates, tool performance metrics
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
