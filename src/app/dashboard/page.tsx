import { Activity, Bug, Users, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  // Fetch stats from database
  const [totalUsers, totalBugs, openBugs] = await Promise.all([
    prisma.user.count(),
    prisma.bugReport.count(),
    prisma.bugReport.count({ where: { status: "open" } }),
  ]);

  const resolvedBugs = totalBugs - openBugs;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Overview of pcbtools.xyz admin metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
        />
        <StatsCard
          title="Open Bugs"
          value={openBugs}
          icon={Bug}
        />
        <StatsCard
          title="Resolved Bugs"
          value={resolvedBugs}
          icon={Activity}
        />
        <StatsCard
          title="Success Rate"
          value={totalBugs > 0 ? `${Math.round((resolvedBugs / totalBugs) * 100)}%` : "N/A"}
          icon={TrendingUp}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Activity feed coming soon...
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
