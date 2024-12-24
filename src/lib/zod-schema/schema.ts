import { z } from "zod";

export const ZodAuthSchema = z.object({
    username: z.string().min(5, { message: "Invalid username address" }),
    password: z.string().min(5, "Password must be 8 or more characters long"),
});

export const ZodUserSchemaWithPassword = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(5, "Password must be 5 or more characters long"),
    role: z.enum(["MANAGER", "DELIVERY", "ADMIN"]),
    storeId: z.string({ message: "Store ID is required!" }),
});

export const ZodStoreSchema = z.object({
    name: z.string().min(3).max(20),
    address: z.string().min(3).max(20),
    city: z.string().min(3).max(20),
    state: z.string().min(3).max(20),
    zip: z.string().min(3).max(20),
    phone: z.string().min(3).max(20).optional(),
});