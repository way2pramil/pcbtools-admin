import { Users as UsersIcon, Mail, Calendar } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { StatsCard } from "@/components/data";
import { Avatar, AvatarFallback, AvatarImage, Badge, Card, CardContent, CardHeader, CardTitle, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui";

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

  const githubUsers = users.filter((u) => u.accounts.some((a) => a.provider === "github")).length;
  const googleUsers = users.filter((u) => u.accounts.some((a) => a.provider === "google")).length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>
        <p className="text-sm text-muted-foreground">
          Manage registered users on pcbtools.xyz
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard title="Total Users" value={users.length} icon={UsersIcon} />
        <StatsCard title="GitHub Users" value={githubUsers} />
        <StatsCard title="Google Users" value={googleUsers} />
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Provider</TableHead>
                <TableHead>Bug Reports</TableHead>
                <TableHead>Joined</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name || ""} />}
                        <AvatarFallback>
                          {(user.name || user.email || "U").charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name || "Unknown"}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          {user.email || "No email"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {user.accounts.map((account) => (
                        <Badge key={account.provider} variant="secondary">
                          {account.provider}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{user._count.bugReports}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {users.length === 0 && (
            <div className="py-12 text-center">
              <UsersIcon className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">No users yet</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
