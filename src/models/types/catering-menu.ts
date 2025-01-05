export interface CateringMenuDocument {
    _id: string;
    name: string;
    price: number;
    description: string;
    image: string | null;
    publicId: string | null;
    disabled: boolean;
}
