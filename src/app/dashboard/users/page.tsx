import { Users as UsersIcon, Mail, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    include: {
      accounts: {
        select: {
          provider: true,
        },
      },
      _count: {
        select: {
          bugReports: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Users</h1>
        <p className="text-sm text-slate-400">
          Manage registered users on pcbtools.xyz
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2">
            <UsersIcon className="h-4 w-4 text-emerald-400" />
            <span className="text-xs font-medium text-slate-400">Total Users</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">{users.length}</p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            <span className="text-xs font-medium text-slate-400">GitHub</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            {users.filter((u) => u.accounts.some((a) => a.provider === "github")).length}
          </p>
        </div>
        <div className="rounded-lg border border-white/10 bg-slate-900/60 p-4">
          <div className="flex items-center gap-2">
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            <span className="text-xs font-medium text-slate-400">Google</span>
          </div>
          <p className="mt-2 text-2xl font-bold text-white">
            {users.filter((u) => u.accounts.some((a) => a.provider === "google")).length}
          </p>
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-white/10 bg-slate-900/60">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-white/10">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Provider
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Bug Reports
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-slate-400">
                  Joined
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-white/5">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {user.avatarUrl ? (
                        <img
                          src={user.avatarUrl}
                          alt={user.name || ""}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/10">
                          <UsersIcon className="h-5 w-5 text-emerald-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-white">{user.name || "Unknown"}</p>
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Mail className="h-3 w-3" />
                          {user.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      {user.accounts.map((account) => (
                        <span
                          key={account.provider}
                          className="rounded-full bg-white/10 px-2 py-1 text-xs capitalize text-slate-300"
                        >
                          {account.provider}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-300">
                    {user._count.bugReports}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-400">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {users.length === 0 && (
          <div className="py-12 text-center">
            <UsersIcon className="mx-auto h-12 w-12 text-slate-600" />
            <p className="mt-4 text-sm text-slate-400">No users yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
