import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000';

export const authOptions = {
  providers: [

    // ── Login JASS (email + password) ─────────────────────────
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email:    { label: 'Email',    type: 'text'     },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify({
              email:    credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const data = await res.json();

          if (data?.user) {
            return {
              id:    data.user.id,
              name:  `${data.user.firstName ?? ''} ${data.user.lastName ?? ''}`.trim() || data.user.name,
              email: data.user.email,
              token: data.token,
            };
          }
          return null;
        } catch {
          return null;
        }
      },
    }),

    // ── Google (optionnel) ────────────────────────────────────
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

  ],

  pages: {
    signIn:  '/login',
    signOut: '/',
    error:   '/login',
  },

  session: {
    strategy: 'jwt' as const,
  },

  callbacks: {
    async jwt({ token, user, account }: any) {
      if (user?.token)       token.backendToken = user.token;
      if (account?.provider) token.provider     = account.provider;
      return token;
    },
    async session({ session, token }: any) {
      if (token.backendToken) session.backendToken    = token.backendToken;
      if (token.sub)          session.user.id         = token.sub;
      if (token.provider)     session.user.provider   = token.provider;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };