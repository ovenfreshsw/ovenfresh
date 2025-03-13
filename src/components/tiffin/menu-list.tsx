"use client";

import { useTiffinMenu } from "@/api-hooks/tiffin/get-tiffin-menu";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2, Pencil, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { editTiffinMenuAction } from "@/actions/edit-catering-tiffin-action";
import getQueryClient from "@/lib/query-utils/get-query-client";

const TiffinMenuList = () => {
    const [edit, setEdit] = useState(false);
    const [loading, setLoading] = useState(false);

    const { data: menu, isPending } = useTiffinMenu();

    const queryClient = getQueryClient();

    function handleSubmit(formData: FormData) {
        setLoading(true);
        const data = Object.fromEntries(formData);

        const pickupMenu = {
            "2_weeks": Number(data.pickup_2_weeks),
            "3_weeks": Number(data.pickup_3_weeks),
            "4_weeks": Number(data.pickup_4_weeks),
        };

        const deliveryMenu = {
            "2_weeks": Number(data.delivery_2_weeks),
            "3_weeks": Number(data.delivery_3_weeks),
            "4_weeks": Number(data.delivery_4_weeks),
        };

        const promise = () =>
            new Promise(async (resolve, reject) => {
                const result = await editTiffinMenuAction({
                    pickupMenu,
                    deliveryMenu,
                });
                setLoading(false);
                setEdit(false);
                queryClient.invalidateQueries({ queryKey: ["menu", "tiffin"] });
                if (result.success) resolve(result);
                else reject(result);
            });

        toast.promise(promise, {
            loading: "Updating menu...",
            success: () => "Menu updated successfully.",
            error: ({ error }) => (error ? error : "Failed to update menu."),
        });
    }

    if (isPending) {
        return (
            <div className="py-10 flex justify-center items-center gap-2">
                <Loader2 className="animate-spin" />
                Loading...
            </div>
        );
    }

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-xl">Tiffin Menu</CardTitle>
                <div className="flex items-center gap-2">
                    <Button
                        size={"icon"}
                        className="rounded-full"
                        variant={"ghost"}
                        onClick={() => setEdit(!edit)}
                    >
                        {edit ? <X size={15} /> : <Pencil size={15} />}
                    </Button>
                    <Button
                        form="edit-tiffin-menu"
                        size={"sm"}
                        disabled={!edit || loading}
                    >
                        Save
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <form
                    id="edit-tiffin-menu"
                    action={handleSubmit}
                    className="grid grid-cols-2 md:grid-cols-3"
                >
                    <div className="pr-5 border-r border-black/30">
                        <h1 className="font-medium mb-3 text-lg">
                            Pickup Menu
                        </h1>
                        <div className="space-y-1">
                            <ItemDisplay
                                defaultValue={menu?.pickup["2_weeks"] || 0}
                                readOnly={!edit}
                                name="pickup_2_weeks"
                                label="2 Weeks"
                            />
                            <ItemDisplay
                                defaultValue={menu?.pickup["3_weeks"] || 0}
                                readOnly={!edit}
                                name="pickup_3_weeks"
                                label="3 Weeks"
                            />
                            <ItemDisplay
                                defaultValue={menu?.pickup["4_weeks"] || 0}
                                readOnly={!edit}
                                name="pickup_4_weeks"
                                label="4 Weeks"
                            />
                        </div>
                    </div>
                    <div className="pl-5">
                        <h1 className="font-medium mb-3 text-lg">
                            Delivery Menu
                        </h1>
                        <div className="space-y-1">
                            <ItemDisplay
                                defaultValue={menu?.delivery["2_weeks"] || 0}
                                readOnly={!edit}
                                name="delivery_2_weeks"
                                label="2 Weeks"
                            />
                            <ItemDisplay
                                defaultValue={menu?.delivery["3_weeks"] || 0}
                                readOnly={!edit}
                                name="delivery_3_weeks"
                                label="3 Weeks"
                            />
                            <ItemDisplay
                                defaultValue={menu?.delivery["4_weeks"] || 0}
                                readOnly={!edit}
                                name="delivery_4_weeks"
                                label="4 Weeks"
                            />
                        </div>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
};

export default TiffinMenuList;

function ItemDisplay({
    defaultValue,
    readOnly,
    name,
    label,
}: {
    defaultValue: number;
    readOnly: boolean;
    name: string;
    label: string;
}) {
    return (
        <div className="grid grid-cols-2 gap-1 items-center">
            <Label>{label}</Label>
            <div className="flex items-center gap-1">
                <span>$</span>
                <Input
                    type="number"
                    min={0}
                    slot="0.01"
                    name={name}
                    placeholder="Price"
                    readOnly={readOnly}
                    defaultValue={defaultValue}
                />
            </div>
        </div>
    );
}
