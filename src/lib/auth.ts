
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import prisma from "@/lib/prisma"; // 相対パスは合わせて
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcrypt";


export const authOptions: NextAuthOptions= {
    adapter: PrismaAdapter(prisma),
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: {label: "Email", type: "text"},
                password: {label: "Password", type: "password"}
            },
            async authorize(credentials) {
                const user = await prisma.user.findUnique({
                    where: {email: credentials?.email}
                });
                if (!user || !user.password){
                  throw new Error("user or password is not found")
                }
                if (!(await bcrypt.compare(credentials?.password || "", user.password)) ){
                    throw new Error("Invalid credentials")
                }
                return({
                    id: user.id,
                    name: user.name,
                    email: user.email
                })
            }
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          // callbackUrl: "/Login"
        }),
    ],
    session: {
        strategy: "jwt"
    },
    callbacks: {
      async signIn({user, account, profile}){
        console.log("signIn callback")
        console.log(user, profile, account)
        return true;
      },
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      async session({ session,  token }) {
        if (session.user && token.id) {
          session.user.id = token.id ;
        }
        return session;
      }
    },
    secret: process.env.NEXTAUTH_SECRET
  };