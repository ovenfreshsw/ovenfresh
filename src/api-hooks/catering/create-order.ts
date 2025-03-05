import axios from "@/config/axios.config";
import { OnErrorType } from "@/lib/types/react-query";
import { ZodCateringSchema } from "@/lib/zod-schema/schema";
import {
    QueryClient,
    useMutation,
    useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export async function handleCreate(values: z.infer<typeof ZodCateringSchema>) {
    const { data: result } = await axios.post("/api/order/catering", values);
    return result;
}

export function useCreateCateringOrder(
    onSuccess: (queryClient: QueryClient) => void
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: handleCreate,
        onSuccess: () => onSuccess(queryClient),
        onError: (error: OnErrorType) => {
            if (error.response.status === 403)
                toast.error(
                    error.response.data.message || "Error in creating order!"
                );
            else toast.error("Error in creating order!");
        },
    });
}
