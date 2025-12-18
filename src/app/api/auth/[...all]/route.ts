/**
 * Better Auth API Route Handler
 * 
 * Handles all auth endpoints:
 * - /api/auth/sign-in/social (Google OAuth)
 * - /api/auth/sign-out
 * - /api/auth/session
 * - /api/auth/callback/google
 * 
 * @see https://www.better-auth.com/docs/integrations/next
 */

import { toNextJsHandler } from "better-auth/next-js";
import { auth } from "@/lib/auth";

export const { GET, POST } = toNextJsHandler(auth);
