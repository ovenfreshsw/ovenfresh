import { useStores } from "@/api-hooks/stores/get-stores";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { StoreDocument } from "@/models/types/store";

const StoreSelectStaff = ({
    stores,
    defaultValue,
}: {
    stores: StoreDocument[];
    defaultValue?: string;
}) => {
    return (
        <Select name="store" defaultValue={defaultValue}>
            <SelectTrigger className="col-span-3 text-primary">
                <SelectValue placeholder="Store" />
            </SelectTrigger>
            <SelectContent className="z-[1560]">
                {stores?.map((store, i) => (
                    <SelectItem value={store._id} key={i}>
                        {store.location}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default StoreSelectStaff;
