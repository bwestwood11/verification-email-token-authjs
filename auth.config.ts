import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getUserByEmail } from "./data/user";
import { LoginSchema } from "./schemas";


export default {
    providers: [
        Credentials({
            async authorize(credentials) {
                const validatedCredentials = LoginSchema.safeParse(credentials)

                if (!validatedCredentials.success) {
                    return null;
                  }
          
                  const { email, password } = validatedCredentials.data;
                  //  console.log("password", password)
                  
                  const user = await getUserByEmail(email);
                  if (!user || !user.password) {
                    return null;
                  }
          
                  const passwordsMatch = await bcrypt.compare(password, user.password);
                  // console.log("passwordsMatch", passwordsMatch);
          
                  if (passwordsMatch) {
                    return user;
                  }
          
                  return null;
            }
        })
    ]
} satisfies NextAuthConfig;