"use client";

import CateringOrderTable from "../data-table/catering/catering-order-table";
import { useCateringOrders } from "@/api-hooks/catering/get-catering-orders";

const CateringOrders = () => {
    const { data: cateringOrders, isPending } = useCateringOrders();

    return (
        <>
            <CateringOrderTable
                orders={cateringOrders || []}
                isPending={isPending}
            />
        </>
    );
};

export default CateringOrders;
