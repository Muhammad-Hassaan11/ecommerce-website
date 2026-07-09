import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"
import { verifyCredentials } from "@/lib/data/users"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        // Look up the registered user in the local user store
        const user = verifyCredentials(
          credentials.email as string,
          credentials.password as string
        );

        if (user) {
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(user.name)}`
          };
        }

        // Demo fallback: any email with password "password" signs in as a demo user
        if (credentials.password === "password") {
          return {
            id: "usr_demo",
            name: "Demo User",
            email: credentials.email as string,
            role: "customer",
            image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
          };
        }

        return null;
      }
    })
  ],
  pages: {
    signIn: "/login",
    error: "/login"
  },
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
        session.user.role = (token.role as string) || "customer";
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
        token.role = (user as { role?: string }).role || "customer";
      }
      return token;
    }
  },
})
