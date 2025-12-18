/**
 * Server-side Auth Utilities
 * 
 * Use these in Server Components, Server Actions, and API routes.
 * 
 * @example
 * ```tsx
 * // In Server Component
 * import { getSession } from "@/lib/auth/server";
 * 
 * export default async function Page() {
 *   const session = await getSession();
 *   if (!session) redirect("/login");
 *   return <div>Hello {session.user.name}</div>;
 * }
 * ```
 */

import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./index";

/**
 * Get current session on server (cached per request)
 * Returns null if not authenticated
 */
export const getSession = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
});

/**
 * Type for authenticated user from session
 */
export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
  image: string | null;
};

/**
 * Extract user from session with proper typing
 */
export function getAuthUser(session: Awaited<ReturnType<typeof getSession>>): AuthenticatedUser | null {
  if (!session?.user) return null;
  
  return {
    id: session.user.id,
    email: session.user.email,
    name: session.user.name,
    image: session.user.image ?? null,
  };
}
