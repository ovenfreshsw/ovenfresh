import { encryptPassword } from "@/lib/password";
import { error400, error403, error500, success200 } from "@/lib/response";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodUserSchemaWithPassword } from "@/lib/zod-schema/schema";
import { UserDocument } from "@/models/types/user";
import User from "@/models/userModel";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { isRestricted } from "@/lib/utils";
import { AuthenticatedRequest } from "@/lib/types/auth-request";

async function updateHandler(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        if (isRestricted(req.user)) return error403();

        const data = await req.json();

        if (!data) {
            return error400("Invalid data format.", {});
        }

        const userId = (await params)?.userId;

        const result = ZodUserSchemaWithPassword.partial().safeParse(data);

        if (result.success) {
            const existingUser = await User.findOne({
                _id: userId,
            });

            if (!existingUser) {
                return error400("User not found.");
            }

            const updatedUserData = {} as UserDocument;

            if (result.data?.password) {
                const hashedPassword = encryptPassword(result.data.password);
                const bcryptPassword = await bcrypt.hash(
                    result.data.password,
                    10
                );
                updatedUserData.password = bcryptPassword;
                updatedUserData.lpp = hashedPassword.encryptedPassword;
                updatedUserData.iv = hashedPassword.iv;
            }
            if (result.data?.storeId) {
                const storeId = result.data
                    .storeId as unknown as mongoose.Schema.Types.ObjectId;
                updatedUserData.storeId = storeId;
            }
            if (result.data?.role) {
                const role = result.data.role;
                updatedUserData.role = role;
            }
            if (result.data?.username) {
                const username = result.data.username;
                updatedUserData.username = username;
            }

            const updatedUser = await User.findOneAndUpdate(
                { _id: userId },
                updatedUserData,
                { new: true }
            );

            return success200({
                user: {
                    id: updatedUser._doc._id,
                    username: updatedUser._doc.username,
                    role: updatedUser._doc.role,
                    storeId: updatedUser._doc.storeId,
                },
            });
        }

        if (result.error) {
            return error400("Invalid data format.", {});
        }
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

async function deleteHandler(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ userId: string }> }
) {
    try {
        if (req.user?.role !== "ADMIN") {
            return error403();
        }

        const userId = (await params)?.userId;

        const deletedUser = await User.deleteOne({ _id: userId });

        if (!deletedUser.acknowledged) {
            return error500({ error: "Failed to delete user" });
        }

        return success200({});
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

export const DELETE = withDbConnectAndAuth(deleteHandler);
export const PATCH = withDbConnectAndAuth(updateHandler);
