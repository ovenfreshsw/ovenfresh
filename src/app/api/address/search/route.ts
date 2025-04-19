import { error400, error403, error500, success200 } from "@/lib/response";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { autocomplete } from "@/lib/google";

async function getHandler(req: AuthenticatedRequest) {
    if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

    const search = req.nextUrl.searchParams.get("address");

    if (!search || search === "") {
        return error400("Invalid Address keyword", { result: null });
    }

    try {
        const searchResult = await autocomplete(search);
        if (!searchResult) return error500({ error: "Google API Error" });

        return success200({
            result: searchResult,
        });
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
