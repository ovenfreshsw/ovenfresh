import { error400, error401, error403, error500 } from "@/lib/response";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { ZodAuthSchema } from "@/lib/zod-schema/schema";
import createToken from "@/lib/jwt/create-token";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";

async function postHandler(req: NextRequest) {
    try {
        const data = await req.json();
        if (!data) {
            return error400("Invalid data format.", {});
        }

        const result = ZodAuthSchema.safeParse(data);

        if (result.success) {
            const { username, password } = result.data;
            if (!username || !password)
                return error400("Invalid data format.", {});

            const validUser = await User.findOne({ username });

            if (validUser.role !== "MANAGER")
                return error403("Invalid credentials for MANAGER role!");
            if (!validUser) {
                return error401("Email not valid");
            } else {
                const passwordMatch = await bcrypt.compare(
                    password,
                    validUser.password
                );

                if (passwordMatch) {
                    const token = createToken({
                        role: validUser.role,
                        id: validUser._id,
                        isAuthenticated: true,
                    });

                    return NextResponse.json(
                        { token },
                        {
                            headers: {
                                "Set-Cookie": `next-auth.session-token=${token}; Path=/; HttpOnly; SameSite=None; Secure`,
                            },
                        }
                    );
                    // return success200(token);
                } else {
                    return error401("Invalid user password");
                }
            }
        }

        if (result.error) {
            return error400("Invalid data format.", {});
        }
    } catch (error: any) {
        console.log(error);
        return error500({ error: error.message });
    }
}

export const POST = withDbConnectAndAuth(postHandler, false);
