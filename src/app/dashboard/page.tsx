import { Activity, Bug, Users, TrendingUp } from "lucide-react";
import { StatsCard } from "@/components/stats-card";
import { prisma } from "@/lib/prisma";

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
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400">
          Overview of pcbtools.xyz admin metrics
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={totalUsers.toString()}
          icon={Users}
          trend="+12%"
          trendUp={true}
        />
        <StatsCard
          title="Open Bugs"
          value={openBugs.toString()}
          icon={Bug}
          trend="-5%"
          trendUp={false}
        />
        <StatsCard
          title="Resolved Bugs"
          value={resolvedBugs.toString()}
          icon={Activity}
          trend="+18%"
          trendUp={true}
        />
        <StatsCard
          title="Success Rate"
          value={totalBugs > 0 ? `${Math.round((resolvedBugs / totalBugs) * 100)}%` : "0%"}
          icon={TrendingUp}
          trend="+7%"
          trendUp={true}
        />
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
        <h2 className="mb-4 text-lg font-semibold text-white">Recent Activity</h2>
        <p className="text-sm text-slate-400">
          Activity feed coming soon...
        </p>
      </div>
    </div>
  );
}
