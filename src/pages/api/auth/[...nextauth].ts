import NextAuth, { type NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";
import { loginSchema } from "@/validation/auth";
import { verify } from "argon2";
import welcomeTemplate from "@/emails/welcome"

export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, token }) => {
      if (token) {
        session.userId = token.id
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
  },
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "E-mail",
      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const creds = await loginSchema.parseAsync(credentials)
        const user = await prisma.user.findFirst({
          where: { email: creds.email },
        })

        if (!user) {
          console.log('no user')
          return null
        }

        if (!user.password) {
          return null
        }

        const isValidPassword = await verify(user.password, creds.password)

        if (!isValidPassword) {
          console.log('Invalid password', user.password, creds.password)
          return null
        }

        return {
          id: user.id,
          email: user.email,
          username: user.username,
        }
      }
    }),
    // ...add more providers here
  ],
  events: {
    createUser: async ({ user }) => {      
      if (user.email) {
        welcomeTemplate.send({
          data: {},
          meta: {
            to: user.email,
          }
        })
      }
    },
  },
  pages: {
    signIn: "/auth/signin",
    newUser: "/auth/signup",
  }
};

export default NextAuth(authOptions);
