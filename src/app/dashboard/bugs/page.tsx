import { Bug, Clock, CheckCircle2, XCircle } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

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
        <h1 className="text-3xl font-bold text-white">Bug Reports</h1>
        <p className="text-sm text-slate-400">
          Manage user-submitted bug reports for KiNotes
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-red-400" />
            <span className="text-xs font-medium text-slate-400">Open</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.open}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-yellow-400" />
            <span className="text-xs font-medium text-slate-400">In Progress</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.inProgress}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium text-slate-400">Resolved</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.resolved}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2">
            <XCircle className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-medium text-slate-400">Closed</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{stats.closed}</p>
        </div>
      </div>

      {/* Bug Reports Table */}
      <div className="rounded-xl border border-white/10 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Bug
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Reporter
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {bugs.map((bug) => (
                <tr key={bug.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-white">{bug.title}</p>
                      <p className="text-xs text-slate-400">{bug.tool}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-slate-300">
                        {bug.user.name || "Unknown"}
                      </p>
                      <p className="text-xs text-slate-500">{bug.user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={bug.status} />
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-400">
                    {format(new Date(bug.createdAt), "MMM d, yyyy")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {bugs.length === 0 && (
          <div className="py-12 text-center">
            <Bug className="mx-auto h-12 w-12 text-slate-600" />
            <p className="mt-4 text-sm text-slate-400">No bug reports yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
