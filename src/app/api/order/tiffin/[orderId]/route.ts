import { error403, error500, success200 } from "@/lib/response";
import { AuthenticatedRequest } from "@/lib/types/auth-request";
import { isRestricted } from "@/lib/utils";
import { withDbConnectAndAuth } from "@/lib/withDbConnectAndAuth";
import Address from "@/models/addressModel";
import Customer from "@/models/customerModel";
import Store from "@/models/storeModel";
import Tiffin from "@/models/tiffinModel";
import TiffinOrderStatus from "@/models/tiffinOrderStatusModel";

// async function deleteHandler(
//     req: AuthenticatedRequest,
//     { params }: { params: Promise<{ orderId: string }> }
// ) {
//     try {
//         if (isRestricted(req.user)) return error403();

//         const { orderId } = await params;

//         const searchParams = req.nextUrl.searchParams.get("deleteCustomer");
//         const deleteCustomer = searchParams
//             ? searchParams.toLowerCase() === "true"
//             : false;

//         const order = await Catering.findByIdAndDelete(orderId);
//         if (!order) {
//             return error404("Order not found.");
//         }

//         if (deleteCustomer) {
//             const customer = await Customer.findByIdAndDelete(order.customer);

//             if (!customer) {
//                 return error404("Customer not found.");
//             }
//         }

//         return success200({ message: "Order deleted successfully." });
//     } catch (error: any) {
//         return error500({ error: error.message });
//     }
// }

async function getHandler(
    req: AuthenticatedRequest,
    { params }: { params: Promise<{ orderId: string }> }
) {
    try {
        if (isRestricted(req.user, ["ADMIN", "MANAGER"])) return error403();

        const { orderId } = await params;
        const storeId = req.nextUrl.searchParams.get("storeId");
        const mid = req.nextUrl.searchParams.get("mid");

        // Build the query object dynamically based on the presence of storeId
        const query = storeId ? { store: storeId } : {};

        const [orders, status] = await Promise.all([
            Tiffin.findOne({ ...query, orderId })
                .populate({ path: "address", model: Address })
                .populate({ path: "customer", model: Customer })
                .populate({ path: "store", model: Store }),
            TiffinOrderStatus.find({ orderId: mid }),
        ]);

        return success200({
            orders: { ...orders?._doc, individualStatus: status },
        });
    } catch (error) {
        console.log(error);
        if (error instanceof Error) {
            return error500({ error: error.message });
        } else {
            return error500({ error: "An unknown error occurred" });
        }
    }
}

// async function patchHandler(
//     req: AuthenticatedRequest,
//     { params }: { params: Promise<{ orderId: string }> }
// ) {
//     try {
//         if (isRestricted(req.user)) return error403();

//         const { orderId } = await params;
//         const {
//             items,
//         }: {
//             items?: {
//                 itemId: string;
//                 priceAtOrder: number;
//                 quantity: number;
//             }[];
//         } = await req.json();

//         if (!orderId) return error404("Order not found.");
//         if (!items || items.length === 0) return error404("Items not found.");

//         const order = await Catering.findById(orderId);
//         if (!order) return error404("Order not found in database.");

//         const { totalPrice, tax, advancePaid } = order;

//         const newSubtotal = items.reduce(
//             (acc, item) => acc + item.priceAtOrder * item.quantity,
//             0
//         );

//         const newTotal = totalPrice + newSubtotal;
//         const taxRate = Number(process.env.NEXT_PUBLIC_TAX_AMOUNT || 0);
//         const newTax = tax > 0 ? (newTotal * taxRate) / 100 : 0;
//         const updatedTotal = tax > 0 ? newTotal + newTax : newTotal;
//         const pendingBalance = updatedTotal - advancePaid;
//         const fullyPaid = pendingBalance <= 0;

//         await Catering.updateOne(
//             { _id: orderId },
//             {
//                 $push: { items: { $each: items } },
//                 $set: {
//                     totalPrice: updatedTotal.toFixed(2),
//                     tax: newTax.toFixed(2),
//                     pendingBalance: pendingBalance.toFixed(2),
//                     fullyPaid,
//                 },
//             }
//         );

//         return success200({ message: "Order updated successfully." });
//     } catch (error: any) {
//         return error500({ error: error.message });
//     }
// }

export const GET = withDbConnectAndAuth(getHandler);
// export const DELETE = withDbConnectAndAuth(deleteHandler);
// export const PATCH = withDbConnectAndAuth(patchHandler);
