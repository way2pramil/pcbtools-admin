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

// Submission types
export type ContentType =
  | "AI_TOOL"
  | "RESOURCE"
  | "NEWS"
  | "TOOL"
  | "BOARD"
  | "RULE"
  | "STACKUP"
  | "LIBRARY";

export type SubmissionStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "APPROVED"
  | "REJECTED"
  | "PUBLISHED";

export interface SubmissionMeta {
  id: string;
  submissionId: string;
  key: string;
  value: string;
}

export interface Submission {
  id: string;
  title: string;
  slug: string;
  contentType: ContentType;
  status: SubmissionStatus;
  shortDescription: string | null;
  description: string | null;
  websiteUrl: string | null;
  githubUrl: string | null;
  logoUrl: string | null;
  coverImageUrl: string | null;
  tags: string[];
  viewCount: number;
  authorId: string;
  author?: AdminUser | null;
  metadata?: SubmissionMeta[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
}

// Job types
export interface Company {
  id: string;
  name: string;
  logo: string | null;
  location: string | null;
  bio: string | null;
  website: string | null;
}

export interface Job {
  id: string;
  title: string;
  location: string;
  workplaceType: string;
  experience: number | null;
  description: string | null;
  applyUrl: string | null;
  tier: string;
  status: string;
  companyId: string;
  company?: Company;
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
