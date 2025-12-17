import { isProduction } from "@/lib/env";

export const GOOGLE_STATE_COOKIE = "pcbtools_admin_google_oauth_state";
export const GOOGLE_CODE_VERIFIER_COOKIE = "pcbtools_admin_google_code_verifier";
export const OAUTH_REDIRECT_COOKIE = "pcbtools_admin_oauth_redirect";

export const oauthCookieAttributes = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: isProduction,
  path: "/",
  maxAge: 60 * 10,
};
