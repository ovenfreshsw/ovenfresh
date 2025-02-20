import { CircleAlert, Loader2 } from "lucide-react";
import ItemCard from "./item-card";
import SummaryCard from "./summary-card";
import { CateringMenuDocument } from "@/models/types/catering-menu";

const SelectItems = ({
    data,
    isPending,
}: {
    data?: CateringMenuDocument[] | null;
    isPending: boolean;
}) => {
    if (isPending)
        return (
            <div className="flex justify-center flex-col items-center gap-2">
                <Loader2 className="animate-spin text-primary" />
                <span>Loading...</span>
            </div>
        );

    if (data?.length === 0)
        return (
            <div className="flex justify-center flex-col items-center gap-2">
                <CircleAlert className="text-primary" />
                <span>No catering menu found!</span>
            </div>
        );

    return (
        <div className="flex flex-col lg:flex-row gap-2">
            {/* Items Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 flex-grow h-fit gap-2">
                {data?.map((item) => (
                    <ItemCard key={item._id} menu={item} />
                ))}
            </div>

            <div className="w-full h-36 lg:hidden col-span-3"></div>
            {/* Summary Container - Fixed Width */}
            <div className="w-full lg:w-[30%] flex-shrink-0">
                <SummaryCard />
            </div>
        </div>
    );
};

export default SelectItems;
