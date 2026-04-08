import {
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
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
import { SubmissionActions } from "./submission-actions";

export const dynamic = "force-dynamic";

const STATUS_BADGE: Record<
  string,
  "default" | "warning" | "success" | "secondary" | "destructive"
> = {
  DRAFT: "secondary",
  PENDING_REVIEW: "warning",
  APPROVED: "success",
  REJECTED: "destructive",
  PUBLISHED: "default",
};

const TYPE_LABELS: Record<string, string> = {
  AI_TOOL: "AI Tool",
  RESOURCE: "Resource",
  NEWS: "News",
  TOOL: "PCB Tool",
  BOARD: "Board",
  RULE: "Design Rule",
  STACKUP: "Stackup",
  LIBRARY: "Library",
};

export default async function SubmissionsPage() {
  const submissions = await prisma.submission.findMany({
    include: {
      author: { select: { name: true, email: true, image: true } },
      metadata: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const stats = {
    pending: submissions.filter((s) => s.status === "PENDING_REVIEW").length,
    approved: submissions.filter((s) => s.status === "APPROVED").length,
    rejected: submissions.filter((s) => s.status === "REJECTED").length,
    published: submissions.filter((s) => s.status === "PUBLISHED").length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Submissions</h1>
        <p className="text-sm text-muted-foreground">
          Review and manage user-submitted content (AI Tools, Resources, News,
          etc.)
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        <StatsCard title="Pending Review" value={stats.pending} icon={Clock} />
        <StatsCard
          title="Approved"
          value={stats.approved}
          icon={CheckCircle2}
        />
        <StatsCard title="Rejected" value={stats.rejected} icon={XCircle} />
        <StatsCard
          title="Published"
          value={stats.published}
          icon={FileText}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Submission</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {submissions.map((sub) => (
                <TableRow key={sub.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{sub.title}</p>
                      {sub.shortDescription && (
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {sub.shortDescription}
                        </p>
                      )}
                      <div className="flex gap-2 mt-1">
                        {sub.websiteUrl && (
                          <a
                            href={sub.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            Website
                          </a>
                        )}
                        {sub.githubUrl && (
                          <a
                            href={sub.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline inline-flex items-center gap-1"
                          >
                            <ExternalLink className="h-3 w-3" />
                            GitHub
                          </a>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">
                      {TYPE_LABELS[sub.contentType] || sub.contentType}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-sm">
                        {sub.author?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {sub.author?.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={STATUS_BADGE[sub.status] || "default"}>
                      {sub.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(sub.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    <SubmissionActions
                      id={sub.id}
                      currentStatus={sub.status}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {submissions.length === 0 && (
            <div className="py-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-sm text-muted-foreground">
                No submissions yet
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
