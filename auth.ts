import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { database } from "./lib/database";
import { getUserById } from "./data/user";

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    callbacks: {
      async signIn({ user, account }) {
           if (account?.provider !== "credentials") {
                return true;
           }

           const existingUser = await getUserById(user.id ?? "");
            
           if(!existingUser?.emailVerified) {
                return false;
           }

           return true
      },
        async session({ token, session }) {
            // console.log("token in session", token);
            // console.log("session in session", session);
            return {
              ...session,
              user: {
                ...session.user,
                id: token.sub,
                isOAuth: token.isOauth,
              },
            };
          },
          async jwt({ token }) {
            // console.log("token in jwt", token);
            if (!token.sub) return token;
            const existingUser = await getUserById(token.sub);
      
            if (!existingUser) return token;
            token.name = existingUser.name;
            token.email = existingUser.email;
      
            return token;
          },
        },
        ...authConfig,
        session: {
          strategy: "jwt",
        },
        adapter: PrismaAdapter(database),
      });