import { notFound } from "next/navigation";
import Catering from "@/models/cateringModel";
import { CateringDocumentPopulate } from "@/models/types/catering";
import connectDB from "@/lib/mongodb";
import Address from "@/models/addressModel";
import Customer from "@/models/customerModel";
import Store from "@/models/storeModel";
import CateringMenu from "@/models/cateringMenuModel";
import OrderConfirmation from "@/components/catering/confirm-order";

async function CateringOrderConfirmPage({
    searchParams,
}: {
    searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
    const orderId = (await searchParams)?.orderId as string;

    if (!orderId) return notFound();

    try {
        await connectDB();
        const order = await Catering.findOne<CateringDocumentPopulate | null>({
            _id: orderId,
        })
            .populate({ path: "address", model: Address })
            .populate({ path: "customer", model: Customer })
            .populate({ path: "store", model: Store })
            .populate({ path: "items.itemId", model: CateringMenu });

        if (!order) return notFound();

        return <OrderConfirmation order={order} />;
    } catch {
        return notFound();
    }
}

export default CateringOrderConfirmPage;
