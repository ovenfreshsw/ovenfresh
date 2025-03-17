import { getMonthsUpToCurrent } from "@/lib/utils";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";
import { useSelector } from "react-redux";
import { RootState } from "@/store";

type MonthSelectProps = {
    monthFilter: string;
    setMonthFilter: React.Dispatch<React.SetStateAction<string>>;
    removeAllMonth?: boolean;
};

const MonthSelect = ({
    monthFilter,
    setMonthFilter,
    removeAllMonth = false,
}: MonthSelectProps) => {
    const yearFilter = useSelector((state: RootState) => state.selectYear);
    return (
        <Select value={monthFilter} onValueChange={setMonthFilter}>
            <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Month Filter" />
            </SelectTrigger>
            <SelectContent>
                {getMonthsUpToCurrent(removeAllMonth, Number(yearFilter)).map(
                    (month) => (
                        <SelectItem key={month.value} value={month.value}>
                            {month.name}
                        </SelectItem>
                    )
                )}
            </SelectContent>
        </Select>
    );
};

export default MonthSelect;
