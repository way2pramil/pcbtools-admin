import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/lucia";
import { env } from "@/lib/env";

const sanitizeRedirectPath = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/login";
  }
  return value;
};

const buildRedirectUrl = (path: string) => new URL(path, env.appUrl);

export async function POST(request: NextRequest) {
  const sessionId = request.cookies.get(auth.sessionCookieName)?.value ?? null;

  if (sessionId) {
    await auth.invalidateSession(sessionId);
  }

  const blankSessionCookie = auth.createBlankSessionCookie();
  const redirectPath = sanitizeRedirectPath(request.nextUrl.searchParams.get("redirectTo"));
  const response = NextResponse.redirect(buildRedirectUrl(redirectPath));

  response.cookies.set(blankSessionCookie.name, blankSessionCookie.value, blankSessionCookie.attributes);

  return response;
}
