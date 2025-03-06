import { z } from "zod";

export const ZodAuthSchema = z.object({
    username: z.string().min(5, { message: "Invalid username address" }),
    password: z.string().min(5, "Password must be 8 or more characters long"),
});

export const ZodUserSchemaWithPassword = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(5, "Password must be 5 or more characters long"),
    role: z.enum(["MANAGER", "DELIVERY", "ADMIN"]),
    store: z.string({ message: "Store ID is required!" }),
});

export const ZodStoreSchema = z.object({
    name: z.string().min(3).max(50),
    address: z.string().min(3).max(150),
    phone: z.string().optional(),
    location: z.string().min(2).max(20),
    placeId: z.string().min(2).max(30),
});

export const ZodCustomerSchema = z.object({
    firstName: z.string().min(3).max(20),
    lastName: z.string().min(1).max(20),
    phone: z.string().min(3).max(20),
    address: z.string().min(3).max(100),
    lat: z.number().min(-90).max(90), // Latitude must be between -90 and 90
    lng: z.number().min(-180).max(180), // Longitude must be between -180 and 180
});

export const ZodCateringSchema = z.object({
    deliveryDate: z
        .string()
        .refine((val) => !isNaN(Date.parse(val)), {
            message: "Invalid ISO date format",
        })
        .transform((val) => new Date(val)),
    customerDetails: ZodCustomerSchema,
    items: z
        .array(
            z.object({
                itemId: z.string().length(24),
                quantity: z.number().min(1),
                priceAtOrder: z.number(),
            })
        )
        .min(1),
    payment_method: z.enum(["cash", "card"]),
    note: z.string().optional(),
    totalPrice: z.number(),
    tax: z.number(),
    deliveryCharge: z.number(),
    advancePaid: z.number(),
    pendingBalance: z.number(),
    fullyPaid: z.boolean(),
    order_type: z.enum(["pickup", "delivery"]),
});

export const ZodCateringMenuSchema = z.object({
    name: z.string().min(3).max(20),
    price: z.number(),
    description: z.string().optional(),
    image: z.string().optional(),
});

export const ZodTiffinSchema = z.object({
    store: z.string().length(24),
    customerDetails: ZodCustomerSchema,
    start_date: z.string(),
    end_date: z.string(),
    number_of_weeks: z.string().min(1),
    payment_method: z.enum(["cash", "card"]),
    totalAmount: z.string().min(1),
    tax: z.number(),
    pendingAmount: z.string().optional(),
    advancePaid: z.string().optional(),
    note: z.string().optional(),
    order_type: z.enum(["pickup", "delivery"]),
});
