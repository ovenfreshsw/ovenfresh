"use server";

import connectDB from "@/lib/mongodb";
import { encryptPassword } from "@/lib/password";
import { ZodUserSchemaWithPassword } from "@/lib/zod-schema/schema";
import User from "@/models/userModel";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function addStaffAction(formData: FormData) {
    try {
        await connectDB();

        const result = ZodUserSchemaWithPassword.safeParse(
            Object.fromEntries(formData.entries())
        );

        if (!result.success) {
            return { error: "Invalid data format." };
        }

        const existingUser = await User.findOne({
            username: result.data.username.toLowerCase(),
        });

        if (existingUser) {
            return { error: "Username already exists!" };
        }

        const hashedPassword = encryptPassword(result.data.password);
        const bcryptPassword = await bcrypt.hash(result.data.password, 10);

        await User.create({
            username: result.data.username.toLowerCase(),
            password: bcryptPassword,
            lpp: hashedPassword.encryptedPassword,
            role: result.data.role,
            storeId: result.data.store,
            iv: hashedPassword.iv,
        });

        revalidatePath("/dashboard/staffs");

        return { success: true };
    } catch (error) {
        console.log(error);

        if (error instanceof Error) {
            return { error: error.message };
        } else {
            return { error: "An unknown error occurred" };
        }
    }
}
