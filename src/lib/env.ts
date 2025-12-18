/**
 * Environment Variables
 * 
 * Centralized access to environment variables.
 * Throws at startup if required vars are missing.
 */

const getEnvVar = (key: string, fallback?: string) => {
  const value = process.env[key] ?? fallback;

  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }

  return value;
};

const normalizeUrl = (url: string) => url.replace(/\/+$/, "");
const isDev = (process.env.NODE_ENV ?? "development") === "development";

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  appUrl: normalizeUrl(
    isDev
      ? getEnvVar("NEXT_PUBLIC_APP_URL", "http://localhost:3001")
      : getEnvVar("NEXT_PUBLIC_APP_URL")
  ),
  googleClientId: getEnvVar("AUTH_GOOGLE_CLIENT_ID"),
  googleClientSecret: getEnvVar("AUTH_GOOGLE_CLIENT_SECRET"),
  // Better Auth requires a secret for session encryption
  betterAuthSecret: getEnvVar("BETTER_AUTH_SECRET"),
};

export const isProduction = env.nodeEnv === "production";
