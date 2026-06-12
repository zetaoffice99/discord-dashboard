import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";

// Singleton pattern to prevent multiple PrismaClient instances during hot reloads
const globalForPrisma = global;

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,  // ← ADD THIS
      authorization: {
        params: { scope: "identify email guilds" },
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: [
            "openid",
            "email",
            "profile",
            "https://www.googleapis.com/auth/calendar",
            "https://www.googleapis.com/auth/gmail.send",
          ].join(" "),
          access_type: "offline",
          prompt: "consent",
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account, profile }) {
      try {
        if (account.provider === "discord") {
          await prisma.user.upsert({
            where: { id: user.id },
            update: {
              discordId: profile.id,
              discordUsername: profile.username,
            },
            create: {
              id: user.id,
              discordId: profile.id,
              discordUsername: profile.username,
              name: profile.username,
              email: user.email,
              image: user.image,
            },
          });
        }

        if (account.provider === "google") {
          // email se dhundho, id se nahi
          const existingUser = await prisma.user.findFirst({
            where: { discordId: { not: null } },
            orderBy: { createdAt: 'desc' },
          });

          const targetId = existingUser?.id || user.id;

          await prisma.user.upsert({
            where: { id: targetId },
            update: {
              googleEmail: profile.email,
              googleAccessToken: account.access_token,
              googleRefreshToken: account.refresh_token,
              googleTokenExpiry: account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,
              calendarId: profile.email,
            },
            create: {
              id: user.id,
              googleEmail: profile.email,
              googleAccessToken: account.access_token,
              googleRefreshToken: account.refresh_token,
              googleTokenExpiry: account.expires_at
                ? new Date(account.expires_at * 1000)
                : null,
              calendarId: profile.email,
              name: profile.name,
              email: profile.email,
              image: profile.picture,
            },
          });
        }
      } catch (err) {
        console.error("signIn callback error:", err);
      }
      return true;
    },

    async session({ session, user }) {
      session.user.id = user.id;
      session.user.discordId = user.discordId;
      session.user.discordUsername = user.discordUsername;
      session.user.googleEmail = user.googleEmail;
      session.user.guildId = user.guildId;
      session.user.channelId = user.channelId;
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };