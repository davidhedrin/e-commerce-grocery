import NextAuth, { AuthError } from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"

import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "../../prisma/db"
import { verifyPassword } from "@/lib/utils"
import { getUserById } from "@/server/auth"

class CustomError extends AuthError {
  constructor(name: string, message: string) {
    super();
    this.name = name;
    this.message = message;
  }
}
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Google,
    Credentials({
      credentials: {
        email: {},
        password: {}
      },
      authorize: async (cred) => {
        try {
          const credEmail = cred?.email as string;
          const credPassword = cred?.password as string;
          const finduser = await db.user.findUnique({
            where: {
              email: credEmail
            }
          });

          if (!finduser) throw new CustomError("Invalid credentials", "Your email or password is incorrect!");
          if(finduser.is_active == false) throw new CustomError("Account Blocked!", "Please contact administrator if this is a mistake.");
          if(finduser.email_verified == null) throw new CustomError("Email Not Verify", "Please confirm your email address verification!");
          
          const verifiedPass = await verifyPassword(credPassword, finduser.password)
          if(!verifiedPass) throw new CustomError("Invalid credentials", "Your email or password is incorrect!");

          return finduser;
        } catch (err: any) {
          throw new CustomError(err.name, err.message);
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if(account?.provider !== "credentials") return false;
      const exisUser = await getUserById(user.id ? parseInt(user.id) : 0);
      if(!exisUser?.email_verified) {
        throw new CustomError("Email Not Verify", "Please confirm your email address verification!");
      }
      return true;
    },
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    session({ session, token }) {
      session.user.id = token.id as string
      session.user.role =  token.role as string
      return session
    },
  },
  session: {
    strategy: "jwt"
  },
  trustHost: true
})