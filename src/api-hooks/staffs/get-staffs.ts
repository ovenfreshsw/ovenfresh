import axios from "@/config/axios.config";
import { UserDocumentPopulate } from "@/models/types/user";
import { useQuery } from "@tanstack/react-query";

async function getStaffs() {
    const { data } = await axios.get("/api/staffs");
    if (data && data.staffs)
        return data.staffs as UserDocumentPopulate[] | null;
    return null;
}

export function useStaffs() {
    return useQuery({
        queryKey: ["staffs"],
        queryFn: getStaffs,
    });
}
