import { CircleAlert, Loader2 } from "lucide-react";
import { CateringMenuDocument } from "@/models/types/catering-menu";
import { VisualMenuSelector } from "./visual-menu-selector";
import { SelectedItemsList } from "./selected-items-list";
import { useEffect, useState } from "react";
import { getMenuItems } from "./action";
import { toast } from "sonner";

type MenuItem = {
    _id: string;
    category: string;
    name: string;
    variant?: string;
    smallPrice?: number;
    mediumPrice?: number;
    largePrice?: number;
    smallServingSize?: string;
    mediumServingSize?: string;
    largeServingSize?: string;
    image?: string;
};

const SelectItems = ({
    data,
    isPending,
}: {
    data?: CateringMenuDocument[] | null;
    isPending: boolean;
}) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadMenuItems() {
            try {
                const items = await getMenuItems();
                setMenuItems(items);
            } catch (error) {
                toast.error("Failed to load menu items.");
            } finally {
                setLoading(false);
            }
        }

        loadMenuItems();
    }, []);

    if (loading) {
        return <div className="text-center py-10">Loading menu items...</div>;
    }

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
                    <VisualMenuSelector menuItems={menuItems} />
                </div>
                <div>
                    <SelectedItemsList />
                </div>
            </div>
        </div>
    );
};

export default SelectItems;
