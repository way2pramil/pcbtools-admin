// User types
export interface AdminUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
}

// Bug report types
export type BugStatus = "open" | "in_progress" | "resolved" | "closed";
export type BugPriority = "low" | "medium" | "high" | "critical";

export interface BugReport {
  id: string;
  tool: string;
  title: string;
  description: string;
  status: BugStatus;
  priority?: BugPriority;
  userId: string | null;
  user?: AdminUser | null;
  adminNotes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Analytics types
export interface DailyStats {
  date: string;
  users: number;
  conversions: number;
  pageViews: number;
}

export interface ToolStats {
  tool: string;
  count: number;
  successRate: number;
}

// Activity types
export interface ActivityLog {
  id: string;
  action: string;
  targetType: string;
  targetId: string;
  adminId: string;
  admin?: AdminUser;
  metadata?: Record<string, unknown>;
  createdAt: Date;
}
