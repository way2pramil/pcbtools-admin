import { prisma } from "@/lib/prisma";

export type OAuthProvider = "google";

export type OAuthProfile = {
  email: string | null;
  name: string | null;
  fallbackName: string;
  avatarUrl: string | null;
};

export type OAuthTokenPayload = {
  accessToken: string;
  refreshToken: string | null;
  accessTokenExpires: Date | null;
};

export const upsertOAuthUser = async (
  provider: OAuthProvider,
  providerUserId: string,
  profile: OAuthProfile,
  tokenPayload: OAuthTokenPayload,
) => {
  const existingAccount = await prisma.oAuthAccount.findUnique({
    where: {
      provider_providerUserId: {
        provider,
        providerUserId,
      },
    },
  });

  if (existingAccount) {
    await prisma.oAuthAccount.update({
      where: { id: existingAccount.id },
      data: tokenPayload,
    });

    return existingAccount.userId;
  }

  const normalizedEmail = profile.email?.toLowerCase() ?? null;
  const existingUser = normalizedEmail
    ? await prisma.user.findUnique({
        where: {
          email: normalizedEmail,
        },
      })
    : null;

  const user =
    existingUser ??
    (await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: profile.name ?? profile.fallbackName,
        avatarUrl: profile.avatarUrl,
      },
    }));

  await prisma.oAuthAccount.create({
    data: {
      provider,
      providerUserId,
      userId: user.id,
      ...tokenPayload,
    },
  });

  return user.id;
};
