import { z } from "zod";

export const ZodAuthSchema = z.object({
    username: z.string().min(5, { message: "Invalid username address" }),
    password: z.string().min(5, "Password must be 8 or more characters long"),
});

export const ZodUserSchemaWithPassword = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(5, "Password must be 5 or more characters long"),
    role: z.enum(["MANAGER", "DELIVERY", "ADMIN"]),
    storeId: z.string({ message: "Store ID is required!" }).nullable(),
});

export const ZodStoreSchema = z.object({
    name: z.string().min(3).max(20),
    address: z.string().min(3).max(20),
    city: z.string().min(3).max(20),
    province: z.string().min(3).max(20),
    zip: z.string().min(3).max(20),
    phone: z.string().min(3).max(20).optional(),
});

export const ZodCustomerSchema = z.object({
    name: z.string().min(3).max(20),
    phone: z.string().min(3).max(20),
    address: z.string().min(3).max(20),
    city: z.string().min(3).max(20),
    province: z.string().min(3).max(20),
    zip: z.string().min(3).max(20),
    lat: z.string(),
    lng: z.string(),
});

export const ZodCateringSchema = z.object({
    store: z.string().length(24),
    deliveryDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid ISO date format",
        })
        .transform((val) => new Date(val)),
    customerDetails: ZodCustomerSchema,
    items: z.array(
        z.object({
            itemId: z.string().length(24),
            quantity: z.number().min(1),
            priceAtOrder: z.number(),
        })
    ),
    advancePaid: z.number(),
    pendingBalance: z.number(),
    fullyPaid: z.boolean(),
    totalPrice: z.number(),
});

export const ZodCateringMenuSchema = z.object({
    name: z.string().min(3).max(20),
    price: z.number(),
    description: z.string().optional(),
    image: z.string().optional(),
});
