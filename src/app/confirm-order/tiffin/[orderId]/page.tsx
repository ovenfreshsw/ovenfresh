import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Address from "@/models/addressModel";
import Store from "@/models/storeModel";
import OrderConfirmation from "@/components/tiffin/confirm-order";
import Tiffin from "@/models/tiffinModel";
import { TiffinDocumentPopulate } from "@/models/types/tiffin";

export const dynamic = "force-static";

async function TiffinOrderConfirmPage({
    params,
}: {
    params: Promise<{ orderId: string }>;
}) {
    const orderId = (await params)?.orderId as string;

    if (!orderId) return notFound();

    try {
        await connectDB();
        const order = await Tiffin.findOne<TiffinDocumentPopulate | null>({
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
            .lean<TiffinDocumentPopulate>();

        if (!order) return notFound();

        return <OrderConfirmation order={order} />;
    } catch {
        return notFound();
    }
}

export default TiffinOrderConfirmPage;
