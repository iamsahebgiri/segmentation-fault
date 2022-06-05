import { serverEnv } from '~/env/server';
import { prisma } from '~/lib/prisma';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import type { NextAuthOptions } from 'next-auth';
import GithubProvider from 'next-auth/providers/github';

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: serverEnv.GITHUB_ID,
      clientSecret: serverEnv.GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      console.log(user);
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          role: user.role,
        },
      };
    },
  },
  // pages: {
  //   signIn: '/sign-in',
  // },
  secret: serverEnv.NEXTAUTH_SECRET,
};

// declare module 'next-auth' {
//   interface Session {
//     user: {
//       id: string;
//       name: string;
//       email: string;
//       image?: string | null;
//       role: Role;
//     };
//   }

//   interface User {
//     role: Role;
//   }
// }
