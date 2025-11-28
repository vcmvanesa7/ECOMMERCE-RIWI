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

        const valid = await comparePassword(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    /** 🔥 Intercepción del login con Google */
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        try {
          await connect();

          const gUser = user as GoogleUser;
          if (!gUser.email) return false;

          const existing = await User.findOne({ email: gUser.email });

          /** Si NO existe → lo creo */
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

            /** Enviar email bienvenida */
            try {
              const html = `
                <p>Hola ${created.name || ""},</p>
                <p>Bienvenid@ a nuestra tienda 🛒✨</p>
                <p>Gracias por registrarte con Google.</p>
              `;
              await sendEmail(created.email, "¡Bienvenido/a a nuestra tienda!", html);
            } catch (emailErr) {
              console.warn("Error enviando email de bienvenida:", emailErr);
            }
          }
        } catch (err) {
          console.error("Error creando usuario con Google:", err);
        }
      }

      return true;
    },

    /** Guardar rol en el JWT */
    async jwt({ token, user }) {
      if (user) token.role = (user as any).role || "client";
      return token;
    },

    /** Pasar rol al session.user */
    async session({ session, token }) {
      (session.user as any).role = (token as any).role || "client";
      return session;
    },
  },
};

export default NextAuth(authOptions);
