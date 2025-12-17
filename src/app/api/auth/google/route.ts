import { generateCodeVerifier, generateState } from "arctic";
import { NextRequest, NextResponse } from "next/server";

import { google } from "@/lib/auth/providers";
import {
  GOOGLE_CODE_VERIFIER_COOKIE,
  GOOGLE_STATE_COOKIE,
  OAUTH_REDIRECT_COOKIE,
  oauthCookieAttributes,
} from "@/lib/auth/cookies";

const sanitizeRedirectPath = (value: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return null;
  }
  return value;
};

export async function GET(request: NextRequest) {
  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["openid", "email", "profile"];
  const authorizationUrl = google.createAuthorizationURL(state, codeVerifier, scopes);
  const response = NextResponse.redirect(authorizationUrl);

  response.cookies.set(GOOGLE_STATE_COOKIE, state, oauthCookieAttributes);
  response.cookies.set(GOOGLE_CODE_VERIFIER_COOKIE, codeVerifier, oauthCookieAttributes);

  const redirectCandidate = sanitizeRedirectPath(request.nextUrl.searchParams.get("redirectTo"));
  if (redirectCandidate) {
    response.cookies.set(OAUTH_REDIRECT_COOKIE, redirectCandidate, oauthCookieAttributes);
  }

  return response;
}
