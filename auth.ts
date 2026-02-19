// auth.ts
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.toString().trim().toLowerCase();
        const password = credentials?.password?.toString() ?? "";
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? "",
        };
      },
    }),
  ],

  pages: { signIn: "/auth/login" },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // login inicial
      if (user) {
        token.id = (user as any).id;
        token.name = (user as any).name;
        token.email = (user as any).email;
      }

      // cuando llamas a useSession().update(...)
      if (trigger === "update" && session) {
        // session payload que mandas en update()
        if (typeof (session as any).name === "string")
          token.name = (session as any).name;
        if (typeof (session as any).email === "string")
          token.email = (session as any).email;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string | undefined;
        session.user.name = (token.name as string) ?? session.user.name ?? null;
        session.user.email =
          (token.email as string) ?? session.user.email ?? null;
      }
      return session;
    },
  },
};
