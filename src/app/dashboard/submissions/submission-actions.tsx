"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Eye, Tag } from "lucide-react";

interface MetaItem {
  id: string;
  key: string;
  value: string;
}

interface SubmissionActionsProps {
  id: string;
  currentStatus: string;
  submission: {
    title: string;
    slug: string;
    contentType: string;
    shortDescription: string | null;
    description: string | null;
    websiteUrl: string | null;
    githubUrl: string | null;
    logoUrl: string | null;
    coverImageUrl: string | null;
    tags: string[];
    viewCount: number;
    metadata: MetaItem[];
    author: { name: string | null; email: string | null; image: string | null } | null;
    createdAt: string;
  };
}

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

export function SubmissionActions({ id, currentStatus, submission }: SubmissionActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  async function updateStatus(newStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/submissions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        router.refresh();
        setShowDetail(false);
      }
    } finally {
      setLoading(false);
    }
  }

  const isPending = currentStatus === "PENDING_REVIEW";
  const isApproved = currentStatus === "APPROVED";

  return (
    <>
      <div className="flex gap-1">
        <button
          onClick={() => setShowDetail(true)}
          className="rounded bg-slate-600 px-2 py-1 text-xs font-medium text-white hover:bg-slate-700"
        >
          <Eye className="h-3 w-3 inline mr-1" />
          View
        </button>
        {isPending && (
          <>
            <button
              onClick={() => updateStatus("APPROVED")}
              disabled={loading}
              className="rounded bg-green-600 px-2 py-1 text-xs font-medium text-white hover:bg-green-700 disabled:opacity-50"
            >
              Approve
            </button>
            <button
              onClick={() => updateStatus("REJECTED")}
              disabled={loading}
              className="rounded bg-red-600 px-2 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
            >
              Reject
            </button>
          </>
        )}
        {isApproved && (
          <button
            onClick={() => updateStatus("PUBLISHED")}
            disabled={loading}
            className="rounded bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            Publish
          </button>
        )}
        {currentStatus === "REJECTED" && (
          <button
            onClick={() => updateStatus("PENDING_REVIEW")}
            disabled={loading}
            className="rounded bg-gray-600 px-2 py-1 text-xs font-medium text-white hover:bg-gray-700 disabled:opacity-50"
          >
            Re-open
          </button>
        )}
      </div>

      {/* Detail Modal */}
      {showDetail && (
        <div className="fixed inset-0 z-50">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowDetail(false)}
          />
          <div className="fixed inset-4 z-50 flex items-start justify-center overflow-y-auto pt-8 pb-8">
            <div className="relative w-full max-w-2xl rounded-lg border bg-background p-6 shadow-xl">
              <button
                onClick={() => setShowDetail(false)}
                className="absolute right-4 top-4 rounded-sm text-muted-foreground hover:text-foreground text-lg"
              >
                ✕
              </button>

              {/* Header */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-1">
                  <span className="rounded bg-secondary px-2 py-0.5 text-xs font-semibold">
                    {TYPE_LABELS[submission.contentType] || submission.contentType}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    /{submission.slug}
                  </span>
                </div>
                <h2 className="text-xl font-bold">{submission.title}</h2>
                {submission.shortDescription && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {submission.shortDescription}
                  </p>
                )}
              </div>

              {/* Logo / Cover */}
              {(submission.logoUrl || submission.coverImageUrl) && (
                <div className="flex gap-4 mb-4">
                  {submission.logoUrl && (
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">Logo</p>
                      <img
                        src={submission.logoUrl}
                        alt="Logo"
                        className="h-16 w-16 rounded-lg border object-cover"
                      />
                    </div>
                  )}
                  {submission.coverImageUrl && (
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground mb-1">Cover</p>
                      <img
                        src={submission.coverImageUrl}
                        alt="Cover"
                        className="h-32 w-full rounded-lg border object-cover"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Description */}
              {submission.description && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Description</p>
                  <div className="rounded-md bg-muted/50 p-3 text-sm whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {submission.description}
                  </div>
                </div>
              )}

              {/* Links */}
              {(submission.websiteUrl || submission.githubUrl) && (
                <div className="flex flex-wrap gap-4 mb-4">
                  {submission.websiteUrl && (
                    <a
                      href={submission.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {submission.websiteUrl}
                    </a>
                  )}
                  {submission.githubUrl && (
                    <a
                      href={submission.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-blue-500 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      GitHub
                    </a>
                  )}
                </div>
              )}

              {/* Tags */}
              {submission.tags.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    <Tag className="h-3 w-3 inline mr-1" />
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {submission.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-2.5 py-0.5 text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {submission.metadata.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Metadata</p>
                  <div className="rounded-md border">
                    <table className="w-full text-sm">
                      <tbody>
                        {submission.metadata.map((m) => (
                          <tr key={m.id} className="border-b last:border-0">
                            <td className="px-3 py-1.5 font-medium text-muted-foreground w-1/3">
                              {m.key}
                            </td>
                            <td className="px-3 py-1.5">{m.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Author & Stats */}
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-6 border-t pt-3">
                <span>
                  By {submission.author?.name || "Unknown"} ({submission.author?.email})
                </span>
                <span>{submission.viewCount} views</span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end border-t pt-4">
                <button
                  onClick={() => setShowDetail(false)}
                  className="rounded border px-3 py-1.5 text-sm font-medium hover:bg-muted"
                >
                  Close
                </button>
                {isPending && (
                  <>
                    <button
                      onClick={() => updateStatus("REJECTED")}
                      disabled={loading}
                      className="rounded bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => updateStatus("APPROVED")}
                      disabled={loading}
                      className="rounded bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Approve
                    </button>
                  </>
                )}
                {isApproved && (
                  <button
                    onClick={() => updateStatus("PUBLISHED")}
                    disabled={loading}
                    className="rounded bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Publish
                  </button>
                )}
                {currentStatus === "REJECTED" && (
                  <button
                    onClick={() => updateStatus("PENDING_REVIEW")}
                    disabled={loading}
                    className="rounded bg-gray-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
                  >
                    Re-open
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
