import { Plus } from "lucide-react";
import { Button } from "../ui/button";
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
import {
    ZodStoreSchema,
    ZodUserSchemaWithPassword,
} from "@/lib/zod-schema/schema";
import { toast } from "sonner";
import { useState } from "react";
import { addStaffAction } from "@/actions/add-staff-action";
import AddressAutocomplete from "../address-autocomplete";
import { Textarea } from "../ui/textarea";
import { useDebounce } from "@/hooks/use-debounce";
import { useSearchAddress } from "@/api-hooks/use-search-address";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { addStoreAction } from "@/actions/add-store-action";

const AddStoreDialog = () => {
    const [loading, setLoading] = useState(false);
    const [placeId, setPlaceId] = useState("");
    const [addressInput, setAddressInput] = useState({
        address: "",
        key: 0,
    });

    const debouncedAddress = useDebounce(addressInput.address, 500);

    const { data: addressPredictions } = useSearchAddress({
        address: debouncedAddress,
        key: addressInput.key,
    });

    function handleSubmit(formData: FormData) {
        setLoading(true);

        const data = Object.fromEntries(formData);

        const result = ZodStoreSchema.safeParse({ ...data, placeId });

        if (!result.success) {
            toast.error("Invalid data format.");
            setAddressInput({ address: "", key: 0 });
            setPlaceId("");
            setLoading(false);
            return;
        }

        formData.set("placeId", placeId);

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await addStoreAction(formData);
                setLoading(false);
                setAddressInput({ address: "", key: 0 });
                setPlaceId("");
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Creating store...",
            success: () => "Store created successfully.",
            error: ({ error }) => (error ? error : "Failed to create store."),
        });
    }

    function setSelectedAddress(selectedAddress: PlaceAutocompleteResult) {
        setAddressInput({ address: selectedAddress.description, key: 0 });
        setPlaceId(selectedAddress.place_id);
    }

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button size={"sm"} className="flex items-center gap-2">
                    <Plus />
                    Add store
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add new store</DialogTitle>
                </DialogHeader>
                <form
                    id="add-store-form"
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
                        />
                    </div>
                    <div className="grid grid-cols-4 gap-2 items-center">
                        <Label htmlFor="address" className="text-right">
                            Address
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
                        <Label htmlFor="phone" className="text-right">
                            Phone
                        </Label>
                        <Input
                            placeholder="Phone (Optional)"
                            name="phone"
                            className="col-span-3"
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
                        />
                    </div>
                </form>
                <DialogFooter className="flex justify-end">
                    <LoadingButton
                        isLoading={loading}
                        size={"sm"}
                        type="submit"
                        form="add-store-form"
                    >
                        Create
                    </LoadingButton>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddStoreDialog;
