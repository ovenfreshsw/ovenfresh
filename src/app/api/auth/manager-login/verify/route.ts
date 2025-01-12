import { error500, success200 } from "@/lib/response";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { NextRequest } from "next/server";

async function getHandler(req: NextRequest) {
    try {
        const user = req.user;
        console.log(user, "USER");
        return success200({ user });
    } catch (error: any) {
        return error500({ error: error.message });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
