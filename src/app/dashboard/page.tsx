import { Activity, Bug, Users, TrendingUp, FileText, Briefcase } from "lucide-react";
import { StatsCard } from "@/components/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [totalUsers, totalBugs, openBugs, pendingSubmissions, totalSubmissions, activeJobs] = await Promise.all([
    prisma.user.count(),
    prisma.bugReport.count(),
    prisma.bugReport.count({ where: { status: "open" } }),
    prisma.submission.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.submission.count(),
    prisma.job.count({ where: { status: "active" } }),
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
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatsCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
        />
        <StatsCard
          title="Pending Submissions"
          value={pendingSubmissions}
          icon={FileText}
          description={`${totalSubmissions} total`}
        />
        <StatsCard
          title="Active Jobs"
          value={activeJobs}
          icon={Briefcase}
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
          title="Bug Resolution"
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
