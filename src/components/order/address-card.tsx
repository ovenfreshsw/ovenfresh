import { MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import EditAddressDialog from "../dialog/edit-address-dialog";
import { format } from "date-fns";
import { CateringDocumentPopulate } from "@/models/types/catering";

const AddressCard = ({
    address,
    deliveryDate,
    startDate,
    endDate,
    orderId,
    orderType,
    numberOfWeeks,
    order_type,
}: {
    address: CateringDocumentPopulate["address"];
    deliveryDate?: Date;
    startDate?: Date;
    endDate?: Date;
    orderId: string;
    orderType: "catering" | "tiffin";
    numberOfWeeks?: number;
    order_type?: "pickup" | "delivery";
}) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center space-y-0 justify-between">
                <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Delivery Address
                </CardTitle>
                <EditAddressDialog
                    address={address}
                    deliveryDate={deliveryDate}
                    endDate={endDate}
                    startDate={startDate}
                    orderId={orderId}
                    orderType={orderType}
                    numberOfWeeks={numberOfWeeks}
                />
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <div>{address.address}</div>
                    <div className="text-sm text-muted-foreground">
                        Coordinates: {address.lat}, {address.lng}
                    </div>
                    {orderType === "catering" && deliveryDate ? (
                        <>
                            <div className="text-sm text-muted-foreground">
                                Delivery Date:{" "}
                                {format(deliveryDate, "MMMM d, yyyy")}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Order Type:{" "}
                                <span className="capitalize">{order_type}</span>
                            </div>
                        </>
                    ) : (
                        startDate &&
                        endDate && (
                            <>
                                <div>
                                    Start Date:{" "}
                                    {format(startDate, "MMMM d, yyyy")}
                                </div>
                                <div>
                                    End Date: {format(endDate, "MMMM d, yyyy")}
                                </div>
                            </>
                        )
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default AddressCard;
