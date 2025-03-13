import { CircleAlert, Loader2 } from "lucide-react";
import { CateringMenuDocumentPopulate } from "@/models/types/catering-menu";
import { VisualMenuSelector } from "./visual-menu-selector";
import { SelectedItemsList } from "./selected-items-list";

const SelectItems = ({
    data,
    isPending,
}: {
    data?: CateringMenuDocumentPopulate[] | null;
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-14 lg:pb-0 w-full">
                <div className="lg:col-span-2">
                    <VisualMenuSelector menuItems={data || []} />
                </div>
                <div>
                    <SelectedItemsList />
                </div>
            </div>
        </div>
    );
};

export default SelectItems;
