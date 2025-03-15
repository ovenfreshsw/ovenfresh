import axios from "@/config/axios.config";
import { ExpenseDetailsProps } from "@/lib/types/finance";
import { format } from "date-fns";
import { headers } from "next/headers";

export async function getExpenseDetailsServer() {
    const headerSequence = await headers();
    const cookie = headerSequence.get("cookie");
    const { data } = await axios.get("/api/admin/expense-details", {
        params: {
            month: format(new Date(), "MMM").toLowerCase(),
        },
        headers: {
            Cookie: `${cookie}`,
        },
    });

    return data.result as ExpenseDetailsProps[] | null;
}
