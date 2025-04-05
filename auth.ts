import NextAuth from "next-auth";
import authConfig from "./auth.config";
import { supabaseAdmin } from "./lib/supabase";

export const { handlers, auth } = NextAuth({
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user, trigger }) => {
      if (user) {
        token.user = user;
      }

      if (trigger === "update") {
        const { data: refreshedUser, error } = await supabaseAdmin
          .from('users')
          .select('*')
          .eq('id', token.sub)
          .single();
          
        if (!error && refreshedUser) {
          token.user = refreshedUser;
        } else {
          return {};
        }
      }

      return token;
    },
    session: async ({ session, token }) => {
      session.user = {
        id: token.sub,
        // @ts-ignore
        ...(token || session).user,
      };
      return session;
    },
  },
  ...authConfig,
});
