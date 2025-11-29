// src/lib/auth.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import connect from "./db";
import { User } from "@/schemas/user.schema";
import { comparePassword } from "./bcrypt";
import { sendEmail } from "./mailer";

/** Tipo seguro para usuario Google */
interface GoogleUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

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
        const user = await User.findOne({ email: credentials.email });

        if (!user || !user.passwordHash) return null;

        const valid = await comparePassword(
          credentials.password,
          user.passwordHash
        );
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
          image: user.image?.url || null,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connect();
          const gUser = user as GoogleUser;
          if (!gUser.email) return false;

          const existing = await User.findOne({ email: gUser.email });

          if (!existing) {
            const created = await User.create({
              name: gUser.name || "",
              email: gUser.email,
              provider: "google",
              role: "client",
              image: {
                url: gUser.image || "",
                public_id: null,
              },
            });

            try {
              const html = `
              <p>Hola ${created.name || ""},</p>
              <p>Bienvenid@ a nuestra tienda</p>
              <p>Gracias por registrarte con Google.</p>
            `;
              await sendEmail(created.email, "Bienvenido", html);
            } catch {}
          }
        } catch {}
      }

      return true;
    },

    async jwt({ token, user, trigger, session }) {
      // Cuando el usuario inicia sesión
      if (user) {
        token.role = (user as any).role || "client";
        token.name = user.name ?? token.name;
        token.picture = (user as any).image ?? token.picture;
      }
      if (trigger === "update" && session?.user) {
        if (session.user.name) token.name = session.user.name;
        if (session.user.image) token.picture = session.user.image;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.role = token.role || "client";
        session.user.name = token.name ?? session.user.name;
        session.user.image = token.picture ?? session.user.image ?? null;
      }

      return session;
    },
  },
};
