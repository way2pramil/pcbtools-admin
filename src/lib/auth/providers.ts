import { Google } from "arctic";
import { env } from "@/lib/env";

const googleRedirectUri = `${env.appUrl}/api/auth/google/callback`;

export const google = new Google(env.googleClientId, env.googleClientSecret, googleRedirectUri);
