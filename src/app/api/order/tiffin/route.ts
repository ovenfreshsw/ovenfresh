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
import { formatDate } from "date-fns";

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

            // 3️⃣ Create Order
            const order = await Tiffin.create({
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
            });

            return success201({ order });
        }

        if (result.error) {
            console.log(result.error);
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

        // Build the query object dynamically based on the presence of storeId
        const query = storeId ? { store: storeId } : {};

        const orders = await Tiffin.find(query);
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
