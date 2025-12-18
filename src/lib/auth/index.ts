/**
 * Better Auth Configuration
 * 
 * Main auth setup for pcbtools-admin.
 * Uses Google OAuth with admin email whitelist.
 * Tables prefixed with "admin_" to not conflict with main site.
 * 
 * @see https://www.better-auth.com/docs
 */

import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "@/lib/prisma";
import { env, isProduction } from "@/lib/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  basePath: "/api/auth",
  baseURL: env.appUrl,
  secret: env.betterAuthSecret,

  trustedOrigins: [env.appUrl],

  socialProviders: {
    google: {
      clientId: env.googleClientId,
      clientSecret: env.googleClientSecret,
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days in seconds
    updateAge: 60 * 60 * 24, // Update session every 24 hours
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },

  advanced: {
    cookiePrefix: "pcbtools_admin",
    useSecureCookies: isProduction,
  },

  // Map to admin_ prefixed tables in Prisma
  user: {
    modelName: "AdminUser",
  },
  
  session: {
    modelName: "AdminSession",
  },
  
  account: {
    modelName: "AdminAccount",
    accountLinking: {
      enabled: true,
    },
  },
  
  verification: {
    modelName: "AdminVerification",
  },
});

// Export types for use in app
export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
