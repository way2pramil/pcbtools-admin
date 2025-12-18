import { Bug, Clock, CheckCircle2, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { StatsCard } from "@/components/data";
import { Badge, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";

export const dynamic = "force-dynamic";

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, "default" | "warning" | "success" | "secondary"> = {
    open: "default",
    "in-progress": "warning",
    resolved: "success",
    closed: "secondary",
  };
  return <Badge variant={variants[status] || "default"}>{status}</Badge>;
}

export default async function BugsPage() {
  const bugs = await prisma.bugReport.findMany({
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const stats = {
    open: bugs.filter((b) => b.status === "open").length,
    inProgress: bugs.filter((b) => b.status === "in-progress").length,
    resolved: bugs.filter((b) => b.status === "resolved").length,
    closed: bugs.filter((b) => b.status === "closed").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Bug Reports</h1>
        <p className="text-sm text-muted-foreground">
          Manage user-submitted bug reports for KiNotes
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <StatsCard title="Open" value={stats.open} icon={Bug} />
        <StatsCard title="In Progress" value={stats.inProgress} icon={Clock} />
        <StatsCard title="Resolved" value={stats.resolved} icon={CheckCircle2} />
        <StatsCard title="Closed" value={stats.closed} icon={XCircle} />
      </div>

      {/* Bug Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Bug</TableHead>
                <TableHead>Reporter</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bugs.map((bug) => (
                <TableRow key={bug.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{bug.title}</p>
                      <p className="text-xs text-muted-foreground">{bug.tool}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">{bug.user?.name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{bug.user?.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={bug.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(bug.createdAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {bugs.length === 0 && (
            <div className="py-12 text-center">
              <Bug className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">No bug reports yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
