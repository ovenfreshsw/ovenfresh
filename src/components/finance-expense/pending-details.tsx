"use client";

import { usePendingDetails } from "@/api-hooks/admin/get-pending-details";
import PendingPaymentsTable from "../data-table/pending-payments-table";

const PendingDetails = () => {
    const { data: pendingDetails, isPending } = usePendingDetails();
    return (
        <div className="mt-7 space-y-6 shadow-md bg-white rounded-lg border p-6">
            <div className="space-y-2">
                <h1 className="text-lg font-semibold leading-none tracking-tight">
                    Pending Payments Details
                </h1>
                <p className="text-sm text-muted-foreground">
                    All pending payments by store and service
                </p>
            </div>
            <PendingPaymentsTable
                isPending={isPending}
                data={pendingDetails || []}
            />
        </div>
    );
};

export default PendingDetails;
