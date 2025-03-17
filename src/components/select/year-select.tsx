"use client";

import { getYearsUpToCurrent } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useDispatch } from "react-redux";
import { setYear } from "@/store/slices/selectYearSlice";
import getQueryClient from "@/lib/query-utils/get-query-client";

const YearSelect = () => {
    const yearFilter = useSelector((state: RootState) => state.selectYear);
    const dispatch = useDispatch();
    const queryClient = getQueryClient();

    async function onValueChange(year: string) {
        dispatch(setYear(year));
        Promise.all([
            queryClient.invalidateQueries({
                queryKey: ["revenue"],
            }),
            queryClient.invalidateQueries({
                queryKey: ["profit-details"],
            }),
            queryClient.invalidateQueries({
                queryKey: ["expense"],
            }),
        ]);
    }

    return (
        <Select value={yearFilter} onValueChange={onValueChange}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Year Filter" />
            </SelectTrigger>
            <SelectContent>
                {getYearsUpToCurrent().map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                        {year}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
};

export default YearSelect;
