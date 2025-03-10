import { Pencil } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import LoadingButton from "../ui/loading-button";
import { ZodStoreSchema } from "@/lib/zod-schema/schema";
import { toast } from "sonner";
import { useState } from "react";
import { StoreDocument } from "@/models/types/store";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchAddress } from "@/api-hooks/use-search-address";
import AddressAutocomplete from "../address-autocomplete";
import { Textarea } from "../ui/textarea";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { editStoreAction } from "@/actions/edit-store-action";

const EditStoreDialog = ({ store }: { store: StoreDocument }) => {
    const [loading, setLoading] = useState(false);
    const [addressInput, setAddressInput] = useState({
        address: store.address,
        key: 0,
    });
    const [placeId, setPlaceId] = useState<string>(store.placeId);

    const debouncedAddress = useDebounce(addressInput.address, 500);

    const { data: addressPredictions } = useSearchAddress({
        address: debouncedAddress,
        key: addressInput.key,
    });

    function handleSubmit(formData: FormData) {
        setLoading(true);

        const data = Object.fromEntries(formData);

        const result = ZodStoreSchema.safeParse({
            ...data,
            placeId,
        });

        if (!result.success) {
            toast.error("Invalid data format.");
            setLoading(false);
            return;
        }

        formData.set("placeId", placeId);
        formData.set("id", store._id);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await editStoreAction(formData);
                setLoading(false);
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating store...",
            success: () => "Store updated successfully.",
            error: ({ error }) => (error ? error : "Failed to update store."),
        });
    }

    function setSelectedAddress(selectedAddress: PlaceAutocompleteResult) {
        setAddressInput({ address: selectedAddress.description, key: 0 });
        setPlaceId(selectedAddress.place_id);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button>
                    <Pencil
                        size={18}
                        className="stroke-2 text-muted-foreground"
                    />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit store</DialogTitle>
                </DialogHeader>
                <form
                    id="edit-store-form"
                    action={handleSubmit}
                    className="grid gap-4 py-4"
                >
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            placeholder="Name"
                            name="name"
                            className="col-span-3"
                            defaultValue={store.name}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="" className="text-right">
                            Role
                        </Label>
                        <AddressAutocomplete
                            addresses={addressPredictions || []}
                            setSelectedAddress={setSelectedAddress}
                            className="col-span-3"
                        >
                            <Textarea
                                placeholder="Address"
                                value={addressInput.address}
                                name="address"
                                onChange={(e) =>
                                    setAddressInput({
                                        address: e.target.value,
                                        key: 1,
                                    })
                                }
                            />
                        </AddressAutocomplete>
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="pheon" className="text-right">
                            Phone
                        </Label>
                        <Input
                            placeholder="Phone"
                            name="phone"
                            className="col-span-3"
                            defaultValue={store.phone}
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="location" className="text-right">
                            Location
                        </Label>
                        <Input
                            placeholder="Location"
                            name="location"
                            className="col-span-3"
                            defaultValue={store.location}
                        />
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="edit-store-form"
                    >
                        Update
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditStoreDialog;
