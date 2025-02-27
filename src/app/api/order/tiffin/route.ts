import {
    error400,
    error403,
    error500,
    success200,
    success201,
} from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { generateOrderId, isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import { ZodTiffinSchema } from "@/lib/zod-schema/schema";
import Address from "@/models/addressModel";
import Customer from "@/models/customerModel";
import Tiffin from "@/models/tiffinModel";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";
import { formatDate } from "date-fns";
import mongoose from "mongoose";

async function createOrderStatus(
    orderId: mongoose.Types.ObjectId,
    startDate: string,
    endDate: string
) {
    const statuses = [];
    const currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
        statuses.push({
            orderId: orderId,
            date: formatDate(new Date(currentDate), "yyyy-MM-dd"),
            status: "PENDING", // Default status
        });

        currentDate.setDate(currentDate.getDate() + 1); // Move to next day
    }

    await TiffinOrderStatus.insertMany(statuses); // Batch insert all statuses
}

async function postHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const data = await req.json();
        if (!data) {
            return error400("Invalid data format.", {});
        }

        const result = ZodTiffinSchema.safeParse(data);

        if (result.success) {
            const {
                customerDetails,
                start_date,
                end_date,
                number_of_weeks,
                payment_method,
                advancePaid,
                pendingAmount,
                totalAmount,
                tax,
                order_type,
                store,
                note,
            } = result.data;

            // 1️⃣ Find or Create Customer (Atomic)
            const customer = await Customer.findOneAndUpdate(
                { phone: customerDetails.phone }, // Search by phone
                {
                    firstName: customerDetails.firstName.trim(),
                    lastName: customerDetails.lastName.trim(),
                }, // Update name if changed
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            // 2️⃣ Find or Create Address (Atomic)
            const customerAddress = await Address.findOneAndUpdate(
                {
                    customerId: customer._id,
                    address: customerDetails.address.trim(),
                }, // Match customer and address
                { lat: customerDetails.lat, lng: customerDetails.lng }, // Update lat/lng if needed
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            // Generate a new ObjectId for the address
            const tiffinId = new mongoose.Types.ObjectId();

            const [order] = await Promise.all([
                // 3️⃣ Create Order
                Tiffin.create({
                    _id: tiffinId,
                    orderId: generateOrderId(),
                    store,
                    startDate: formatDate(new Date(start_date), "yyyy-MM-dd"),
                    endDate: formatDate(new Date(end_date), "yyyy-MM-dd"),
                    numberOfWeeks: number_of_weeks,
                    paymentMethod: payment_method,
                    advancePaid,
                    pendingBalance: Number(pendingAmount)?.toFixed(2),
                    totalPrice: Number(totalAmount)?.toFixed(2),
                    tax,
                    order_type,
                    note,
                    customer: customer._id,
                    customerName: customer.firstName + " " + customer.lastName,
                    customerPhone: customer.phone,
                    address: customerAddress._id,
                }),
                // 4️⃣ Create Order Status
                createOrderStatus(
                    tiffinId,
                    formatDate(new Date(start_date), "yyyy-MM-dd"),
                    formatDate(new Date(end_date), "yyyy-MM-dd")
                ),
            ]);

            return success201({ order });
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

async function getHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const storeId = req.nextUrl.searchParams.get("storeId");
        const limit = req.nextUrl.searchParams.get("limit");

        // Build the query object dynamically based on the presence of storeId
        const filter = storeId ? { store: storeId } : {};

        let query = Tiffin.find(filter).sort({ createdAt: -1 });

        if (limit && !isNaN(Number(limit)) && Number(limit) > 0) {
            query = query.limit(Number(limit)); // Apply limit only if it's a valid number
        }

        const orders = await query;
        // .populate({ path: "store", model: Store })
        // .populate({ path: "customer", model: Customer })

        return success200({ orders });
    } catch (error) {
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

export const POST = withDbConnectAndAuth(postHandler);
export const GET = withDbConnectAndAuth(getHandler);
