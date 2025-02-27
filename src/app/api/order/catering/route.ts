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
import { ZodCateringSchema } from "@/lib/zod-schema/schema";
import Address from "@/models/addressModel";
import Catering from "@/models/cateringModel";
import Customer from "@/models/customerModel";
import { formatDate } from "date-fns";

async function postHandler(req: AuthenticatedRequest) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const data = await req.json();
        if (!data) return error400("Invalid data format.", {});

        const result = ZodCateringSchema.safeParse(data);
        if (!result.success) {
            return error400("Invalid data format.", {});
        }

        const { customerDetails, ...orderData } = result.data;

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
            { lat: data.lat, lng: data.lng }, // Update lat/lng if needed
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        const order = await Catering.create({
            ...orderData,
            orderId: generateOrderId(),
            deliveryDate: formatDate(
                new Date(orderData.deliveryDate),
                "yyyy-MM-dd"
            ),
            customer: customer._id,
            customerName: customer.firstName + " " + customer.lastName,
            customerPhone: customer.phone,
            address: customerAddress._id,
            paymentMethod: orderData.payment_method,
        });

        return success201({ order });
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

        const filter = storeId ? { store: storeId } : {};

        let query = Catering.find(filter)
            .populate({
                path: "customer",
                model: Customer,
            })
            .sort({ createdAt: -1 });

        if (limit && !isNaN(Number(limit)) && Number(limit) > 0) {
            query = query.limit(Number(limit)); // Apply limit only if it's a valid number
        }

        const orders = await query;
        // .populate({ path: "store", model: Store })
        // .populate({ path: "items.itemId", model: CateringMenu });

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
