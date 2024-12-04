// next-auth.d.ts
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string | any;
      email: string;
      name?: string | null;
      image?: string | null;
    };
  }

  interface JWT {
    id?: string;
  }
}