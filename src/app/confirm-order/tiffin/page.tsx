import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Address from "@/models/addressModel";
import Customer from "@/models/customerModel";
import Store from "@/models/storeModel";
import OrderConfirmation from "@/components/tiffin/confirm-order";
import Tiffin from "@/models/tiffinModel";
import { TiffinDocumentPopulate } from "@/models/types/tiffin";

async function TiffinOrderConfirmPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const orderId = (await searchParams)?.orderId as string;

    if (!orderId) return notFound();

    try {
        await connectDB();
        const order = await Tiffin.findOne<TiffinDocumentPopulate | null>({
            _id: orderId,
        })
            .populate({ path: "address", model: Address })
            .populate({ path: "customer", model: Customer })
            .populate({ path: "store", model: Store });

        if (!order) return notFound();

        return <OrderConfirmation order={order} />;
    } catch {
        return notFound();
    }
}

export default TiffinOrderConfirmPage;
