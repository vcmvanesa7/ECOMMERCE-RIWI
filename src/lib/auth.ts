// src/lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
// clientPromise is optional; if you configured next-auth's MongoDB adapter, create and export it from ./mongodb-client-promise
// Placeholder to avoid "Cannot find module" while keeping optional adapter code in place:
const clientPromise: any = undefined; // optional, or use next-auth-mongodb-adapter setup
import connect from "./db";
import { User } from "../schemas/user.schema";
import { comparePassword, hashPassword } from "./bcrypt";

/**
 * Configure NextAuth options:
 * - Google OAuth
 * - Credentials with bcrypt password check
 * - Use MongoDB adapter to persist sessions and users
 */

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        await connect();
        const user = await User.findOne({ email: credentials.email }).exec();
        if (!user || !user.passwordHash) return null;
        const isValid = await comparePassword(credentials.password, user.passwordHash);
        if (!isValid) return null;
        // return user object that NextAuth will save in session
        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        } as any;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      // attach role / user id to session
      if (token) {
        (session as any).user.id = token.sub;
        (session as any).user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      // include user role in token when credentials sign in
      if (user && (user as any).role) {
        (token as any).role = (user as any).role;
      }
      return token;
    },
  },
  // adapter: MongoDBAdapter(clientPromise), // optional: set up adapter if you configured clientPromise
};
