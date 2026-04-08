"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface SubmissionActionsProps {
  id: string;
  currentStatus: string;
}

export function SubmissionActions({ id, currentStatus }: SubmissionActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

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
      }
    } finally {
      setLoading(false);
    }
  }

  const isPending = currentStatus === "PENDING_REVIEW";
  const isApproved = currentStatus === "APPROVED";

  return (
    <div className="flex gap-1">
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
  );
}
