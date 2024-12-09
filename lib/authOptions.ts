import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextAuthOptions } from "next-auth";
import { JWT } from "next-auth/jwt";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();
        if (credentials) {
          const user = await User.findOne({ email: credentials.email });
          if (user && bcrypt.compareSync(credentials.password, user.password)) {
            return {
              id: user._id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
            };
          }
          throw new Error("Invalid email or password");
        }
        throw new Error("Please provide credentials");
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
      }
      return token;
    },
    async session({ session, token }) {
      // if (session.user && session.user.id) {
      // Explicitly cast token to the extended JWT type
      const { firstName, lastName, email, id } = token as JWT;
      session.user.id = id;
      session.user.email = email;
      session.user.firstName = firstName;
      session.user.lastName = lastName;
      // }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
