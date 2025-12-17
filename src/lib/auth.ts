/**
 * Admin authentication utility
 * Simple env-based admin check - no complex role system needed
 */

const ADMIN_EMAILS =
  process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim().toLowerCase()) ?? [];

/**
 * Check if email is in admin whitelist
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}

/**
 * Get list of admin emails (for debugging)
 */
export function getAdminEmails(): string[] {
  return ADMIN_EMAILS;
}
