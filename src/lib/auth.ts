import connectDB from "@/lib/mongodb";
import User from "@/models/userModel";
import type { NextAuthOptions } from "next-auth";
import credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
        maxAge: 7 * 24 * 60 * 60, // 7 day in seconds
    },
    jwt: {
        maxAge: 7 * 24 * 60 * 60, // 7 day in seconds
    },
    pages: {
        signIn: "/",
    },
    providers: [
        credentials({
            name: "Credentials",
            id: "credentials",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                await connectDB();
                const user = await User.findOne({
                    username: credentials?.username.toLowerCase(),
                }).select("+password");

                if (!user) throw new Error("Invalid username or password");

                const passwordMatch = await bcrypt.compare(
                    credentials!.password,
                    user.password
                );

                if (!passwordMatch)
                    throw new Error("Invalid username or password");
                return {
                    username: user.username,
                    role: user.role,
                    isAuthenticated: true,
                    id: user._id,
                    storeId: user.storeId,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user, trigger, session }) {
            if (trigger === "update") {
                return { ...token, ...session.user };
            }
            if (user) {
                return {
                    ...token,
                    id: user.id,
                    role: user.role,
                    storeId: user.storeId.toString(),
                };
            }
            return token;
        },
        async session({ session, token }) {
            try {
                if (token.sub) {
                    await connectDB();
                    const user = await User.findById(token.sub);

                    if (user) {
                        return {
                            ...session,
                            user: {
                                ...session.user,
                                id: token.sub,
                                role: user?.role,
                                username: user?.username,
                                isAuthenticated: false,
                                storeId: user?.storeId.toString(),
                            },
                        };
                    }
                }
            } catch {
                return {
                    ...session,
                    user: {
                        ...session.user,
                        id: token.sub,
                        role: token.role,
                        isAuthenticated: false,
                    },
                };
            }
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.sub,
                    role: token.role,
                    isAuthenticated: true,
                },
            };
        },
    },
};
