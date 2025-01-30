import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../prisma";
// import { PrismaAdapter } from "@auth/prisma-adapter";
// import prisma from "../prisma";

export const { auth, handlers, signIn, signOut, unstable_update } = NextAuth({
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        // Add logic here to look up the user from the credentials supplied

        if (credentials.password === "admin@123") {
          try {
            return await prisma.user.findFirstOrThrow({
              where: {
                email: {
                  equals: (credentials.email as string) ?? "",
                  mode: "insensitive"
                },
              },
              select: {
                name: true,
                id: true,
                email: true,
              }
            });
          } catch {
            return await prisma.user.create({
              data: {
                email: (credentials.email as string),
                name: "Foxbyte",
              },
              select: {
                name: true,
                id: true,
                email: true,
              }
            });
          }
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (!session.user) throw new Error("No user!");
      if (!session.user.email) throw new Error("No email!");

      const user = await prisma.user.findFirstOrThrow({
        where: {
          email: {
            equals: (token.email as string) ?? "",
            mode: "insensitive"
          },
        },
        select: {
          name: true,
          id: true,
          email: true,
        }
      });

      session.userId = user.id;
      session.user.id = user.id;
      session.user.name = user.name;
      session.user.email = user.email;

      return session;
    },
  },
  // adapter: PrismaAdapter(prisma),
});
