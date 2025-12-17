import { cn } from "@/lib/utils";

type StatusBadgeProps = {
  status: string;
};

const statusConfig: Record<string, { label: string; className: string }> = {
  open: {
    label: "Open",
    className: "bg-red-500/10 text-red-400 border-red-500/20",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  },
  resolved: {
    label: "Resolved",
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  closed: {
    label: "Closed",
    className: "bg-slate-500/10 text-slate-400 border-slate-500/20",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || statusConfig.open;

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        config.className
      )}
    >
      {config.label}
    </span>
  );
}
