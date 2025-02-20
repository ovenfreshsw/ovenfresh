import axios from "@/config/axios.config";
import { CateringItemsState } from "@/lib/types/catering/catering-order-state";
import { OnErrorType } from "@/lib/types/react-query";
import {
    QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export async function handleCreate({
    orderId,
    menuItems,
}: {
    orderId: string;
    menuItems: CateringItemsState[];
}) {
    const { data: result } = await axios.patch(
        `/api/order/catering/${orderId}`,
        {
            items: menuItems.map((item) => ({
                itemId: item._id,
                priceAtOrder: item.priceAtOrder,
                quantity: item.quantity,
            })),
        }
    );
    return result;
}

export function useAddItems(onSuccess: (queryClient: QueryClient) => void) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleCreate,
        onSuccess: () => onSuccess(queryClient),
        onError: (error: OnErrorType) => {
            if (error.response.status === 403)
                toast.error(
                    error.response.data.message || "Error in updating order!"
                );
            else toast.error("Error in updating order!");
        },
    });
}
