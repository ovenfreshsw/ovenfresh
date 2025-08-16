import { notFound } from "next/navigation";
import Catering from "@/models/cateringModel";
import { CateringDocumentPopulate } from "@/models/types/catering";
import connectDB from "@/lib/mongodb";
import Address from "@/models/addressModel";
import Store from "@/models/storeModel";
import CateringMenu from "@/models/cateringMenuModel";
import OrderConfirmation from "@/components/catering/confirm-order";

export const dynamic = "force-static";

async function CateringOrderConfirmPage({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const orderId = (await params)?.orderId as string;

    if (!orderId) return notFound();

    try {
        await connectDB();
        const order = await Catering.findOne<CateringDocumentPopulate | null>({
            _id: orderId,
        })
            .populate({
                path: "address",
                model: Address,
                select: "address lat lng",
            })
            .populate({
                path: "store",
                model: Store,
                select: "name address phone",
            })
            .populate({ path: "items.itemId", model: CateringMenu })
            .lean<CateringDocumentPopulate>();

        if (!order) return notFound();

        return <OrderConfirmation order={order} />;
    } catch {
        return notFound();
    }
}

export default CateringOrderConfirmPage;
