import {
  Briefcase,
  Building2,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { StatsCard } from "@/components/data";
import {
  Badge,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function JobsPage() {
  const [jobs, companies] = await Promise.all([
    prisma.job.findMany({
      include: {
        company: { select: { name: true, logo: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.company.count(),
  ]);

  const activeJobs = jobs.filter((j) => j.status === "active").length;
  const closedJobs = jobs.filter((j) => j.status === "closed").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Board</h1>
        <p className="text-sm text-muted-foreground">
          Review jobs and companies posted on pcbtools.xyz
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatsCard title="Total Jobs" value={jobs.length} icon={Briefcase} />
        <StatsCard title="Active" value={activeJobs} icon={Briefcase} />
        <StatsCard title="Closed" value={closedJobs} icon={Briefcase} />
        <StatsCard title="Companies" value={companies} icon={Building2} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Jobs</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Posted</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {jobs.map((job) => (
                <TableRow key={job.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{job.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {job.workplaceType} · {job.experience ? `${job.experience}+ yrs` : "Any exp"}
                      </p>
                      {job.applyUrl && (
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1 mt-1"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Apply link
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">{job.company.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      {job.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        job.status === "active"
                          ? "success"
                          : job.status === "draft"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {job.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{job.tier}</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(job.createdAt), "MMM d, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {jobs.length === 0 && (
            <div className="py-12 text-center">
              <Briefcase className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No jobs posted yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
