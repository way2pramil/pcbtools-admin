/**
 * Login Page
 * 
 * Displays Google sign-in button.
 * Redirects to dashboard if already authenticated.
 * Shows error messages for auth failures.
 */

import { redirect } from "next/navigation";
import { LogIn, AlertCircle } from "lucide-react";

import { getSession } from "@/lib/auth/server";
import { SignInButton } from "./sign-in-button";

type SearchParams = Promise<{ error?: string }>;

const errorMessages: Record<string, string> = {
  oauth_state_mismatch: "Authentication failed. Please try again.",
  invalid_code: "Invalid authentication code. Please try again.",
  profile_error: "Could not retrieve profile. Please try again.",
  not_admin: "Access denied. You are not an admin.",
  access_denied: "Access denied. Please use an admin account.",
};

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const session = await getSession();
  const params = await searchParams;

  // If already logged in, redirect to dashboard
  if (session?.user) {
    redirect("/dashboard");
  }

  const errorCode = params.error;
  const errorMessage = errorCode ? errorMessages[errorCode] ?? "An error occurred." : null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-white/10 bg-slate-900/60 p-8 backdrop-blur-sm">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">PCBtools Admin</h1>
          <p className="mt-2 text-sm text-slate-400">
            Admin dashboard for pcbtools.xyz
          </p>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-950/30 p-4">
            <AlertCircle className="h-4 w-4 text-red-400" />
            <p className="text-sm text-red-300">{errorMessage}</p>
          </div>
        )}

        <div className="space-y-4">
          <p className="text-center text-xs text-slate-500">
            Sign in with your admin account
          </p>

          <SignInButton />

          <div className="rounded-lg border border-emerald-500/20 bg-emerald-950/30 p-4">
            <p className="text-xs text-emerald-300">
              <LogIn className="mr-1 inline-block h-3 w-3" />
              Only whitelisted admin emails can access this dashboard
            </p>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="text-center text-xs text-slate-500">
            Protected by environment variable whitelist
          </p>
        </div>
      </div>
    </div>
  );
}
