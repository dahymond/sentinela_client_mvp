import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextAuthOptions } from "next-auth";

export const authOptions:NextAuthOptions = {
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
          if(credentials){
              const user = await User.findOne({ email: credentials.email });
              if (user && bcrypt.compareSync(credentials.password, user.password)) {
                return { id: user._id, email: user.email };
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
        }
        return token;
      },
      async session({ session, token }) {
        if(session.user && session.user.id){
            session.user.id = token?.id;
        }
        return session;
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  };