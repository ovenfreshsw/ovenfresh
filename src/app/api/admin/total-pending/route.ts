import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Catering from "@/models/cateringModel";
import Tiffin from "@/models/tiffinModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN"])) return error403();

        const [tiffins, caterings] = await Promise.all([
            Tiffin.find({}, "pendingBalance"),
            Catering.find({}, "pendingBalance"),
        ]);
        const tiffinTotal = tiffins.reduce(
            (sum, doc) => sum + doc.pendingBalance,
            0
        );
        const cateringTotal = caterings.reduce(
            (sum, doc) => sum + doc.pendingBalance,
            0
        );

        return success200({
            result: {
                total: (tiffinTotal + cateringTotal).toFixed(2),
                tiffin: tiffinTotal.toFixed(2),
                catering: cateringTotal.toFixed(2),
            },
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) return error500({ error: error.message });
        else return error500({ error: "An unknown error occurred" });
    }
}

export const GET = withDbConnectAndAuth(getHandler);
