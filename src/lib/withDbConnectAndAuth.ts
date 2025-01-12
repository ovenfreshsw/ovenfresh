import dbConnect from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { NextRequest } from "next/server";
import { error401, error500 } from "./response";
import verifyToken from "./jwt/verify-token";

export function withDbConnectAndAuth(handler: Function, isAuthRequired = true) {
    return async (req: NextRequest, context: any) => {
        try {
            const [_, session] = await Promise.all([
                dbConnect(),
                getServerSession(authOptions),
            ]);

            if (isAuthRequired === false) {
                return await handler(req, context);
            }

            if (session === null) {
                const user = verifyToken(req);
                if (!user) {
                    return error401("Unauthorized");
                }
            } else {
                (req as any).user = session.user; // Attach user to request
            }

            return await handler(req, context); // Proceed with the handler
        } catch (error) {
            console.error("Middleware Error:", error);
            return error500({
                message: "Unauthorized or Internal Server Error",
            });
        }
    };
}
