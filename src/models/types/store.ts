export interface StoreDocument {
    _id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
    phone?: string;
}
