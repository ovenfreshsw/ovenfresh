"use client";

import { useStores } from "@/api-hooks/stores/get-stores";
import { RootState } from "@/store";
import { useSelector } from "react-redux";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import AddressAutocomplete from "../address-autocomplete";
import { useState } from "react";
import { useSearchAddress } from "@/api-hooks/use-search-address";
import { useDebounce } from "@/hooks/use-debounce";
import { Textarea } from "../ui/textarea";
import { PlaceAutocompleteResult } from "@googlemaps/google-maps-services-js";
import { getStoreCoordinatesAction } from "@/actions/get-store-coor-action";
import { toast } from "sonner";
import { Label } from "../ui/label";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";

const ReadOnlyMap = dynamic(() => import("./read-only-map"), {
    ssr: false,
    loading: () => <p>Loading...</p>,
});

const CanWeDeliver = () => {
    const [addressInput, setAddressInput] = useState({
        address: "",
        key: 0,
    });
    const [position, setPosition] = useState<number[] | null>(null);

    const { data: stores, isPending } = useStores();
    const currentStore = useSelector((state: RootState) => state.selectStore);
    const selectedStore = stores?.find((store) => store._id === currentStore);
    const debouncedAddress = useDebounce(addressInput.address, 500);

    const { data: addressPredictions } = useSearchAddress({
        address: debouncedAddress,
        key: addressInput.key,
    });

    function setSelectedAddress(selectedAddress: PlaceAutocompleteResult) {
        setAddressInput({ address: selectedAddress.description, key: 0 });

        // Call api to get coordinates
        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await getStoreCoordinatesAction(
                    selectedAddress.place_id
                );
                if (result.success) {
                    setPosition([result.lat, result.lng]);
                    resolve(result);
                } else reject(result);
            });

        toast.promise(promise, {
            loading: "Fetching coordinates...",
            success: () => "Coordinates fetched successfully.",
            error: ({ error }) =>
                error ? error : "Failed to fetch coordinates.",
        });
    }

    if (!selectedStore) return null;

    if (isPending) {
        <div className="flex justify-center items-center h-32 flex-col">
            <Loader2 className="animate-spin" />
            <span>Loading...</span>
        </div>;
    }
    return (
        <Card>
            <CardHeader className="px-3 md:px-6">
                <CardTitle>Can We Deliver?</CardTitle>
                <CardDescription>
                    Enter the delivery address to see if we can deliver.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 px-3 md:px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="space-y-1 col-span-3">
                        <Label htmlFor="address" className="text-base">
                            Enter delivery Address
                        </Label>
                        <AddressAutocomplete
                            addresses={addressPredictions || []}
                            setSelectedAddress={setSelectedAddress}
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
                    <ul className="ms-auto mt-auto">
                        <li className="flex items-center gap-2">
                            <div className="w-[20px] flex items-center justify-center">
                                <Image
                                    src={"/leaflet/store.svg"}
                                    alt="marker"
                                    width={20}
                                    height={20}
                                />
                            </div>
                            <span className="text-xs">Store</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <div className="w-[20px] flex items-center justify-center">
                                <Image
                                    src={"/leaflet/marker-icon.png"}
                                    alt="marker"
                                    width={13}
                                    height={13}
                                />
                            </div>
                            <span className="text-xs">Delivery Point</span>
                        </li>
                    </ul>
                </div>
                <div className="h-fit w-full rounded-md border">
                    <ReadOnlyMap
                        storeLocation={[selectedStore.lat, selectedStore.lng]}
                        addressLocation={position as [number, number]}
                    />
                </div>
            </CardContent>
        </Card>
    );
};

export default CanWeDeliver;
