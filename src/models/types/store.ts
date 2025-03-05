export interface StoreDocument {
    _id: string;
    name: string;
    address: string;
    location: string;
    lat: number;
    lng: number;
    phone?: string;
}
