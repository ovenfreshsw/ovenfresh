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

        // Validate request body
        const result = ZodAuthSchema.safeParse(data);
        if (!result.success) {
            return error400("Invalid data format.", {});
        }

        const { username, password } = result.data;

        if (!username || !password) {
            return error400("Invalid data format.", {});
        }

        // Fetch user
        const validUser = await User.findOne({ username });
        if (!validUser) {
            return error401("Email not valid");
        }

        if (validUser.role !== "MANAGER") {
            return error403("Invalid credentials for MANAGER role!");
        }

        // Validate password
        const passwordMatch = await bcrypt.compare(
            password,
            validUser.password
        );
        if (!passwordMatch) {
            return error401("Invalid user password");
        }

        // Create authentication token
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
    } catch (error) {
        console.error("Error in postHandler:", error);
        return error500({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        });
    }
}

// Wrap with DB connection middleware
export const POST = withDbConnectAndAuth(postHandler, false);
