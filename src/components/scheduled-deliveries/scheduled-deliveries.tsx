"use client";

import { useScheduledDeliveries } from "@/api-hooks/scheduled/get-deliveries";
import { Divider, Typography } from "@mui/material";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import OrderCard from "./order-card";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import { UserDocument } from "@/models/types/user";
import DeliveryBoySelect from "../select/delivery-boy-select";
import { Loader2 } from "lucide-react";

const ScheduledDeliveries = ({
    staffs,
}: {
    staffs: Pick<UserDocument, "_id" | "username" | "zone">[];
}) => {
    const store = useSelector((state: RootState) => state.selectStore);
    const { data, isPending } = useScheduledDeliveries(store);

    if (isPending) {
        return (
            <div className="flex justify-center items-center h-32 flex-col">
                <Loader2 className="animate-spin" />
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <>
            <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                Scheduled Deliveries for Today
            </Typography>
            <div className="grid md:grid-cols-2 gap-3">
                <Card>
                    <CardHeader className="flex-row justify-between items-center p-4">
                        <div>
                            <CardTitle className="text-lg">Trip 1</CardTitle>
                        </div>
                        <DeliveryBoySelect
                            staffs={staffs}
                            defaultValue={
                                staffs.find((staff) => staff.zone === 1)?._id
                            }
                            zone={1}
                        />
                    </CardHeader>
                    <div className="px-4 pb-4">
                        <Divider />
                    </div>
                    <CardContent className="px-4 pb-4">
                        <div className="mb-3 flex flex-col">
                            <h1 className="text-lg font-medium">Tiffins</h1>
                            <span className="text-xs">
                                Total Deliveries: {data?.tiffins.zone1.length}
                            </span>
                        </div>
                        {data?.tiffins.zone1.map((order) => (
                            <OrderCard
                                mid={order._id}
                                orderType="tiffin"
                                orderId={order.orderId}
                                address={order.address.address}
                                status={order.status}
                                key={order._id}
                            />
                        ))}
                        <div className="my-5"></div>
                        <div className="mb-3 flex flex-col">
                            <h1 className="text-lg font-medium">Caterings</h1>
                            <span className="text-xs">
                                Total Deliveries: {data?.caterings.zone1.length}
                            </span>
                        </div>
                        {data?.caterings.zone1.map((order) => (
                            <OrderCard
                                mid={order._id}
                                orderType="catering"
                                orderId={order.orderId}
                                address={order.address.address}
                                status={order.status}
                                key={order._id}
                            />
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex-row justify-between items-center p-4">
                        <div>
                            <CardTitle className="text-lg">Trip 2</CardTitle>
                        </div>
                        <DeliveryBoySelect
                            staffs={staffs}
                            defaultValue={
                                staffs.find((staff) => staff.zone === 2)?._id
                            }
                            zone={2}
                        />
                    </CardHeader>
                    <div className="px-4 pb-4">
                        <Divider />
                    </div>
                    <CardContent className="px-4 pb-4">
                        <div className="mb-3 flex flex-col">
                            <h1 className="text-lg font-medium">Tiffins</h1>
                            <span className="text-xs">
                                Total Deliveries: {data?.tiffins.zone2.length}
                            </span>
                        </div>
                        {data?.tiffins.zone2.map((order) => (
                            <OrderCard
                                mid={order._id}
                                orderType="tiffin"
                                orderId={order.orderId}
                                address={order.address.address}
                                status={order.status}
                                key={order._id}
                            />
                        ))}
                        <div className="my-5"></div>
                        <div className="mb-3 flex flex-col">
                            <h1 className="text-lg font-medium">Caterings</h1>
                            <span className="text-xs">
                                Total Deliveries: {data?.caterings.zone2.length}
                            </span>
                        </div>
                        {data?.caterings.zone2.map((order) => (
                            <OrderCard
                                mid={order._id}
                                orderType="catering"
                                orderId={order.orderId}
                                address={order.address.address}
                                status={order.status}
                                key={order._id}
                            />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </>
    );
};

export default ScheduledDeliveries;
