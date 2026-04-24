import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import {
  getUserById,
  getUserByEmail,
} from "@/modules/auth/actions";

const isValidObjectId = (id: string) => /^[a-fA-F0-9]{24}$/.test(id);

export const { auth, handlers, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  ...authConfig,
  pages: {
    signIn: "/auth/sign-in",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;

      const existingUser = await db.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        return true;
      }

      if (account) {
        const existingAccount = await db.account.findUnique({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
        });

        if (!existingAccount) {
          await db.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refreshToken: account.refresh_token,
              accessToken: account.access_token,
              expiresAt: account.expires_at,
              tokenType: account.token_type,
              scope: account.scope,
              idToken: account.id_token,
              sessionState: account.session_state as string | undefined,
            },
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.id = user.id;
      }

      const lookupId = token.id;

      let existingUser = null;
      if (lookupId && isValidObjectId(lookupId)) {
        existingUser = await getUserById(lookupId);
      } else if (token.email) {
        existingUser = await getUserByEmail(token.email);
      }

      if (!existingUser) return token;

      token.id = existingUser.id;
      token.role = existingUser.role;
      token.email = existingUser.email;
      token.name = existingUser.name;
      token.image = existingUser.image;

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) || "";
        session.user.email = (token.email as string) || session.user.email;
        session.user.name = (token.name as string) || session.user.name;
      }

      if (token.role && session.user) {
        session.user.role = token.role as "USER" | "ADMIN";
      }

      if (token.image && session.user) {
        session.user.image = token.image as string;
      }

      return session;
    },
  },
});
