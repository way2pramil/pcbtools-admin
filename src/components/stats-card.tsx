import { LucideIcon } from "lucide-react";

type StatsCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
};

export function StatsCard({ title, value, icon: Icon, trend, trendUp }: StatsCardProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/60 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold text-white">{value}</p>
          {trend && (
            <p
              className={`mt-2 text-xs font-medium ${
                trendUp ? "text-emerald-400" : "text-red-400"
              }`}
            >
              {trend} from last month
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10">
          <Icon className="h-6 w-6 text-emerald-400" />
        </div>
      </div>
    </div>
  );
}
