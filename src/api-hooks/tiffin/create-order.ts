import axios from "@/config/axios.config";
import { OnErrorType } from "@/lib/types/react-query";
import { ZodTiffinSchema } from "@/lib/zod-schema/schema";
import {
    QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

type CreateTiffinOrderProps = {
    values: z.infer<typeof ZodTiffinSchema>;
    googleAddress: {
        address: string;
        placeId: string;
    };
    sentToWhatsapp?: boolean;
};

export async function handleCreate({
    values,
    googleAddress,
    sentToWhatsapp = false,
}: CreateTiffinOrderProps) {
    const { data: result } = await axios.post("/api/order/tiffin", {
        ...values,
        googleAddress,
        sentToWhatsapp,
    });
    return result;
}

export function useCreateTiffinOrder(
    onSuccess: (queryClient: QueryClient) => void
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleCreate,
        onSuccess: (result) => {
            onSuccess(queryClient);
            result.messageSent === false
                ? toast.error("Error sending whatsapp message.")
                : toast.success("Order details sent to customer.");
        },
        onError: (error: OnErrorType) => {
            if (error.response.status === 403)
                toast.error(
                    error.response.data.message || "Error in creating order!"
                );
            else toast.error("Error in creating order!");
        },
    });
}
