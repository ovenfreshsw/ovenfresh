import axios from "@/config/axios.config";
import { OnErrorType } from "@/lib/types/react-query";
import {
    QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export async function handleConfirm({
    orderType,
    orderId,
}: {
    orderType: "catering" | "tiffin";
    orderId: string;
}) {
    console.log(orderType, orderId);

    const { data: result } = await axios.patch("/api/order/delivery/confirm", {
        orderId,
        orderType,
    });
    return result;
}

export function useConfirmDelivery(
    onSuccess: (queryClient: QueryClient) => void
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleConfirm,
        onSuccess: () => onSuccess(queryClient),
        onError: (error: OnErrorType) => {
            toast.error(
                error.response.data.message || "Error in delivering order!"
            );
        },
    });
}
