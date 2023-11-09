import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

const AuthOptions = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  secret: "LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=",
  session: {
    strategy: "jwt",
  },

  jwt: {
    secret: "LlKq6ZtYbr+hTC073mAmAh9/h2HwMfsFo4hrfCx5mLg=",
  },
  debug: false,
  callbacks: {
    // async jwt({ token, user }) {
    //   return { ...token, ...user };
    // },
    jwt: async ({ token, user, trigger, session }) => {
      if (user) {
        // @ts-ignore
        token.user = user;
      }
      return token;
    },
    // async session({ session, token, user }) {
    //   session.user = token;
    //   return session;
    // },
    session: async ({ session, token, trigger }) => {
      return {
        token: token,
        expires: session.expires,
      };
    },
  },
});

export { AuthOptions as GET, AuthOptions as POST };
