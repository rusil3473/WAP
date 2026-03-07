import {
  authenticateWithPassword,
  ensureAuthUserByEmail,
  ensureProfileForAuthUser,
  getProfileByEmail,
} from "@/lib/supabase-data";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

type AppToken = {
  sub?: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
  isVerified?: boolean;
};

type AppSession = {
  user?: {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string | null;
    isVerified?: boolean;
  };
};

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Email and Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email?.trim();
        const password = credentials?.password;

        if (!email || !password) {
          return null;
        }

        const profile = await authenticateWithPassword(email, password);

        if (!profile) {
          return null;
        }

        return {
          id: profile._id,
          name: profile.fullName,
          email: profile.email,
          role: profile.role,
          isVerified: profile.isVerified,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      const appToken = token as AppToken;

      if (user) {
        const mappedUser = user as {
          id?: string;
          name?: string | null;
          email?: string | null;
          role?: string;
          isVerified?: boolean;
        };

        appToken.sub = mappedUser.id ?? appToken.sub;
        appToken.name = mappedUser.name ?? appToken.name;
        appToken.email = mappedUser.email ?? appToken.email;
        appToken.role = mappedUser.role ?? appToken.role;
        appToken.isVerified = mappedUser.isVerified ?? appToken.isVerified;
      }

      if (appToken.email && !appToken.role) {
        const profile = await getProfileByEmail(appToken.email);
        if (profile) {
          appToken.sub = profile._id;
          appToken.name = profile.fullName;
          appToken.role = profile.role;
          appToken.isVerified = profile.isVerified;
        }
      }

      return appToken as typeof token;
    },
    async session({ session, token }) {
      const appToken = token as AppToken;
      const appSession = session as AppSession;

      if (appSession.user) {
        appSession.user.id = appToken.sub;
        appSession.user.name = appToken.name ?? appSession.user.name ?? null;
        appSession.user.email = appToken.email ?? appSession.user.email ?? null;
        appSession.user.role = appToken.role;
        appSession.user.isVerified = appToken.isVerified;
      }

      return appSession as typeof session;
    },
  },
  events: {
    async signIn({ account, user }) {
      try {
        if (account?.provider !== "google") return;
        if (!user.email) return;

        const authUser = await ensureAuthUserByEmail({
          email: user.email,
          fullName: user.name ?? undefined,
        });

        await ensureProfileForAuthUser(authUser, {
          fullName: user.name ?? undefined,
          isVerified: true,
        });
      } catch (error) {
        console.error("Google sign-in sync failed:", error);
      }
    },
  },
};
