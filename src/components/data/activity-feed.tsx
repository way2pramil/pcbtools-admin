import { formatDistanceToNow } from "date-fns";

interface Activity {
  id: string;
  action: string;
  target?: string;
  timestamp: Date;
  user?: { name: string; image?: string };
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
}

export function ActivityFeed({ activities, maxItems = 10 }: ActivityFeedProps) {
  const items = activities.slice(0, maxItems);

  return (
    <div className="space-y-4">
      {items.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className="h-2 w-2 mt-2 rounded-full bg-blue-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm">
              {activity.user && (
                <span className="font-medium">{activity.user.name} </span>
              )}
              <span className="text-muted-foreground">{activity.action}</span>
              {activity.target && (
                <span className="font-medium"> {activity.target}</span>
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
            </p>
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          No recent activity
        </p>
      )}
    </div>
  );
}
