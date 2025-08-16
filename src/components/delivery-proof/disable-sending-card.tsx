"use client";

import { useSettings } from "@/api-hooks/settings/get-settings";
import { useSettingsMutation } from "@/api-hooks/settings/update-settings-mutation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RootState } from "@/store";
import { Switch } from "@mui/material";
import { QueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { toast } from "sonner";

const DisableSendingCard = () => {
    const store = useSelector((state: RootState) => state.selectStore);

    const { data: settings, isPending } = useSettings(store);

    function onSuccess(queryClient: QueryClient) {
        queryClient.invalidateQueries({
            queryKey: ["settings"],
        });
        toast.success("Settings updated successfully!");
    }

    const mutation = useSettingsMutation(onSuccess);

    function handleChange(
        _: React.ChangeEvent<HTMLInputElement>,
        checked: boolean
    ) {
        mutation.mutate({
            disable_sending_proof: checked,
        });
    }

    return (
        <Card>
            <CardHeader className="pb-0">
                <CardTitle className="text-lg">
                    Disable sending proof to customer.
                </CardTitle>
            </CardHeader>
            <CardContent className="flex justify-between items-center">
                <p>
                    This will stop automatically sending proof to customer
                    through Whatsapp.
                </p>
                <Switch
                    checked={settings?.disable_sending_proof || false}
                    disabled={isPending || mutation.isPending}
                    onChange={handleChange}
                />
            </CardContent>
        </Card>
    );
};

export default DisableSendingCard;
