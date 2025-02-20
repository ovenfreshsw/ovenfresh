import { error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";

async function getHandler(req: AuthenticatedRequest) {
    try {
        const user = req.user;
        console.log(user, "USER");
        return success200({ user });
    } catch (error) {
        return error500({
            error:
                error instanceof Error
                    ? error.message
                    : "An unknown error occurred",
        });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
