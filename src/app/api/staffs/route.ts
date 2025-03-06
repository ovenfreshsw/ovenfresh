import { error403, error500, success200 } from "@/lib/response";
import User from "@/models/userModel";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { decryptPassword } from "@/lib/password";
import { isRestricted } from "@/lib/utils";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import Store from "@/models/storeModel";

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user)) return error403();

        const users = await User.find({
            role: { $nin: ["ADMIN", "SUPERADMIN"] },
        }).populate({ path: "storeId", model: Store, select: "location _id" });

        const decryptedUsers = users.map(
            (user: {
                lpp: string;
                iv: string;
                _id: string;
                username: string;
                role: string;
                storeId: {
                    _id: string;
                    location: string;
                };
            }) => {
                const decryptedPassword = decryptPassword(user.lpp, user.iv);
                return {
                    _id: user._id,
                    username: user.username,
                    role: user.role,
                    storeId: user.storeId,
                    password: decryptedPassword,
                };
            }
        );

        return success200({ staffs: decryptedUsers });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

export const GET = withDbConnectAndAuth(getHandler);
