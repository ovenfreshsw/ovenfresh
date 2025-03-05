"use server";

import { revalidatePath } from "next/cache";

export async function revalidateOrder(orderString: string) {
    revalidatePath(`/dashboard/orders/${orderString}`);
}
