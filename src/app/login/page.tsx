import { redirect } from "next/navigation";
import { LogIn, AlertCircle } from "lucide-react";
import Link from "next/link";

import { validateRequest } from "@/lib/auth/lucia";

type SearchParams = Promise<{ error?: string }>;

const errorMessages: Record<string, string> = {
  oauth_state_mismatch: "Authentication failed. Please try again.",
  google_missing_code_verifier: "Authentication error. Please try again.",
  oauth_invalid_code: "Invalid authentication code. Please try again.",
  google_profile_error: "Could not retrieve profile. Please try again.",
  not_admin: "Access denied. You are not an admin.",
};

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  const { user } = await validateRequest();
  const params = await searchParams;

  // If already logged in, redirect to dashboard
  if (user) {
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

          <Link
            href="/api/auth/google"
            className="flex w-full items-center justify-center gap-3 rounded-lg border border-white/20 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </Link>

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
