import type { auth } from "./lucia";

declare module "lucia" {
  interface Register {
    Lucia: typeof auth;
    DatabaseUserAttributes: {
      email: string | null;
      name: string | null;
      avatarUrl: string | null;
    };
    DatabaseSessionAttributes: Record<string, never>;
  }
}
