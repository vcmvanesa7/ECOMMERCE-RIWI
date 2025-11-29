import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      role?: string;
      image?: string | null;
      name?: string | null;
      email?: string | null;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    role?: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
    picture?: string | null;
    name?: string | null;
  }
}
