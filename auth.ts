import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import authConfig from "@/auth.config";
import { getUserById, getAccountByUserId } from "@/modules/auth/actions";
import { UserRole } from "@prisma/client";

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
        // User will be created by the adapter
        return true;
      }

      // Check if account is already linked
      if (account) {
        const existingAccount = await getAccountByUserId(existingUser.id);

        if (!existingAccount) {
          // Link the account to existing user
          await db.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              refresh_token: account.refresh_token,
              access_token: account.access_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
              session_state: account.session_state as string | undefined,
            },
          });
        }
      }

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);

      if (!existingUser) return token;

      token.id = existingUser.id;
      token.role = existingUser.role;
      token.email = existingUser.email;
      token.name = existingUser.name;

      return token;
    },
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }

      return session;
    },
  },
});
