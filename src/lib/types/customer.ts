import { AddressDocument } from "@/models/types/address";
import { CustomerDocument } from "@/models/types/customer";

export type CustomerSearchResult = CustomerDocument & {
    address: AddressDocument;
};
