import "server-only";

import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, TimeSpan } from "lucia";
import { cache } from "react";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { isProduction } from "@/lib/env";

type DatabaseUserAttributes = {
  email: string | null;
  name: string | null;
  avatarUrl: string | null;
};

export type AuthenticatedUser = DatabaseUserAttributes & { id: string };

const adapter = new PrismaAdapter(prisma.session, prisma.user);

export const auth = new Lucia(adapter, {
  sessionExpiresIn: new TimeSpan(30, "d"),
  sessionCookie: {
    name: "pcbtools_admin_session",
    expires: false,
    attributes: {
      sameSite: "lax",
      secure: isProduction,
      path: "/",
    },
  },
  getUserAttributes: (user) => {
    const attributes = user as DatabaseUserAttributes;

    return {
      email: attributes.email,
      name: attributes.name,
      avatarUrl: attributes.avatarUrl,
    };
  },
});

export const validateRequest = cache(async () => {
  const headerList = await headers();
  const sessionId = auth.readSessionCookie(headerList.get("cookie") ?? "");

  if (!sessionId) {
    return {
      user: null,
      session: null,
    } as const;
  }

  return auth.validateSession(sessionId);
});
