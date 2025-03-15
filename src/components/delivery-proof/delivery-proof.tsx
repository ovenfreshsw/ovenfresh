"use client";

import { useDeliveryProofs } from "@/api-hooks/delivery-proof";
import { Input } from "@/components/ui/input";
import { Loader2, Search } from "lucide-react";
import ProofCard from "./proof-card";
import { useState } from "react";

const DeliveryProof = () => {
    const { data: deliveryProofs, isPending, isError } = useDeliveryProofs();
    const [search, setSearch] = useState("");

    const filteredDeliveryProofs = deliveryProofs?.filter((proof) =>
        proof.orderId.includes(search)
    );

    if (isPending)
        return (
            <div className="text-center py-20 flex justify-center items-center gap-1">
                <Loader2 className="animate-spin" />
                Loading...
            </div>
        );
    if (isError)
        return (
            <div className="text-center py-20">Error: Unable to load data</div>
        );
    if (!deliveryProofs || deliveryProofs.length === 0)
        return <div className="text-center py-20">No data available!</div>;
    return (
        <>
            <div>
                <h1 className="text-2xl font-bold">Delivery Proofs</h1>
                <p className="text-muted-foreground">
                    View and manage delivery proofs for all orders
                </p>
            </div>
            <div className="relative my-5">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search by order ID"
                    className="pl-8 max-w-sm bg-white"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            <span className="text-sm text-muted-foreground mb-3">
                Total {filteredDeliveryProofs?.length || 0} delivery proofs
                listed.
            </span>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
                {filteredDeliveryProofs?.length === 0 ? (
                    <div className="sm:col-span-3 lg:col-span-4 text-center py-10">
                        No orders found!
                    </div>
                ) : (
                    filteredDeliveryProofs?.map((order) => (
                        <ProofCard order={order} key={order.order_id} />
                    ))
                )}
            </div>
        </>
    );
};

export default DeliveryProof;
