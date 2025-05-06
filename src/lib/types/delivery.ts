import { CateringDocumentPopulate } from "@/models/types/catering";
import { TiffinOrderStatusDocumentPopulate } from "@/models/types/tiffin-order-status";

export type DeliveryProof = {
    _id: string;
    orderId: string;
    order_id: string;
    user: string;
    image: string;
    deliveryDate: Date;
    store: string;
};

export type Coords = { lat: number; lng: number };
export type TiffinInputProps = TiffinOrderStatusDocumentPopulate & {
    id: string;
    lat: number;
    lng: number;
};
export type CateringInputProps = CateringDocumentPopulate & {
    id: string;
    lat: number;
    lng: number;
};
