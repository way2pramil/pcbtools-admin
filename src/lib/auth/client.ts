/**
 * Better Auth Client
 * 
 * Client-side auth utilities for React components.
 * Use this for login/logout actions and session state.
 * 
 * @example
 * ```tsx
 * import { signIn, signOut, useSession } from "@/lib/auth/client";
 * 
 * // Sign in with Google
 * await signIn.social({ provider: "google" });
 * 
 * // Sign out
 * await signOut();
 * 
 * // Get session in client component
 * const { data: session } = useSession();
 * ```
 */

import { createAuthClient } from "better-auth/react";

const baseURL = typeof window !== "undefined" 
  ? window.location.origin 
  : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001";

export const authClient = createAuthClient({
  baseURL,
});

export const { signIn, signOut, useSession } = authClient;
