"use server";

import { encryptPassword } from "@/lib/password";
import { ZodUserSchemaWithPassword } from "@/lib/zod-schema/schema";
import User from "@/models/userModel";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { withDbConnectAndActionAuth } from "@/lib/withDbConnectAndAuth";

export async function editStaffAction(formData: FormData) {
    try {
        // Authorize the user
        await withDbConnectAndActionAuth();

        const result = ZodUserSchemaWithPassword.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        const existingUser = await User.findOne({
            username: result.data.username.toLowerCase(),
            _id: { $ne: formData.get("id") },
        });

        if (existingUser) {
            return { error: "Username already exists!" };
        }

        const hashedPassword = encryptPassword(result.data.password);
        const bcryptPassword = await bcrypt.hash(result.data.password, 10);

        await User.findByIdAndUpdate(formData.get("id"), {
            $set: {
                username: result.data.username.toLowerCase(),
                password: bcryptPassword,
                lpp: hashedPassword.encryptedPassword,
                role: result.data.role,
                storeId: result.data.store,
                iv: hashedPassword.iv,
            },
        });

        revalidatePath("/dashboard/staffs");

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
