import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

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

        // MOCK AUTHENTICATION since Phase 3 has no database yet
        // In a real app, you'd look up the user in a DB and use bcrypt.compare

        // Accept any login if password is "password"
        if (credentials.password === "password") {
          return {
            id: "1",
            name: "Demo User",
            email: credentials.email as string,
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
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
})
