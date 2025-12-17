import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/lucia";
import { google } from "@/lib/auth/providers";
import {
  GOOGLE_CODE_VERIFIER_COOKIE,
  GOOGLE_STATE_COOKIE,
  OAUTH_REDIRECT_COOKIE,
  oauthCookieAttributes,
} from "@/lib/auth/cookies";
import { upsertOAuthUser } from "@/lib/auth/upsert-oauth-user";
import { isAdmin } from "@/lib/auth/admin";
import { env } from "@/lib/env";

const DEFAULT_REDIRECT = "/dashboard";

const buildRedirectUrl = (path: string) => new URL(path, env.appUrl);

const sanitizeStoredRedirect = (value: string | undefined) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_REDIRECT;
  }
  return value;
};

const clearCookie = (response: NextResponse, name: string) =>
  response.cookies.set(name, "", { ...oauthCookieAttributes, maxAge: 0 });

const redirectWithError = (code: string) =>
  NextResponse.redirect(buildRedirectUrl(`/login?error=${code}`));

type GoogleProfile = {
  sub: string;
  email: string | null;
  name: string | null;
  picture: string | null;
};

const fetchGoogleProfile = async (accessToken: string) => {
  const response = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("GOOGLE_PROFILE_ERROR");
  }

  return (await response.json()) as GoogleProfile;
};

const resolveAccessTokenExpiry = (
  tokens: Awaited<ReturnType<typeof google.validateAuthorizationCode>>
) => {
  try {
    return tokens.accessTokenExpiresAt();
  } catch {
    return null;
  }
};

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = request.cookies.get(GOOGLE_STATE_COOKIE)?.value ?? null;
  const codeVerifier = request.cookies.get(GOOGLE_CODE_VERIFIER_COOKIE)?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return redirectWithError("oauth_state_mismatch");
  }

  if (!codeVerifier) {
    return redirectWithError("google_missing_code_verifier");
  }

  let tokens;
  try {
    tokens = await google.validateAuthorizationCode(code, codeVerifier);
  } catch {
    return redirectWithError("oauth_invalid_code");
  }

  let profile: GoogleProfile;
  try {
    profile = await fetchGoogleProfile(tokens.accessToken());
  } catch {
    return redirectWithError("google_profile_error");
  }

  // Check if user email is in admin whitelist
  if (!isAdmin(profile.email)) {
    return redirectWithError("not_admin");
  }

  const userId = await upsertOAuthUser(
    "google",
    profile.sub,
    {
      email: profile.email,
      name: profile.name,
      fallbackName: "Google user",
      avatarUrl: profile.picture,
    },
    {
      accessToken: tokens.accessToken(),
      refreshToken: tokens.hasRefreshToken() ? tokens.refreshToken() : null,
      accessTokenExpires: resolveAccessTokenExpiry(tokens),
    }
  );

  const session = await auth.createSession(userId, {});
  const sessionCookie = auth.createSessionCookie(session.id);
  const storedRedirect = request.cookies.get(OAUTH_REDIRECT_COOKIE)?.value;
  const redirectPath = sanitizeStoredRedirect(storedRedirect);
  const response = NextResponse.redirect(buildRedirectUrl(redirectPath));

  response.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
  clearCookie(response, GOOGLE_STATE_COOKIE);
  clearCookie(response, GOOGLE_CODE_VERIFIER_COOKIE);
  clearCookie(response, OAUTH_REDIRECT_COOKIE);

  return response;
}
