"use client";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import KitchenIcon from "@mui/icons-material/Kitchen";
import TakeoutDiningIcon from "@mui/icons-material/TakeoutDiningRounded";
import { usePathname } from "next/navigation";
import Link from "next/link";
// import { AddOrderDrawer } from "@/components/drawer/delivery/add-order-drawer";

const BottomNav = () => {
    const pathname = usePathname();
    const path = pathname.split("/").at(-1);

    return (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-20 items-center gap-1.5">
            <div className="bg-background rounded-full shadow-lg flex items-center p-1 border border-border">
                <Button
                    variant="ghost"
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-full",
                        path === "tiffin" && "bg-primary-foreground"
                    )}
                    asChild
                >
                    <Link href={"/delivery/tiffin"}>
                        <KitchenIcon className="size-5 text-primary" />
                        <span>Tiffin</span>
                    </Link>
                </Button>
                <div className="w-px h-8 bg-border mx-1"></div>
                <Button
                    variant="ghost"
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-full",
                        path === "catering" && "bg-primary-foreground"
                    )}
                    asChild
                >
                    <Link href={"/delivery/catering"}>
                        <TakeoutDiningIcon className="size-5 text-primary" />
                        <span>Catering</span>
                    </Link>
                </Button>
            </div>
            {/* <AddOrderDrawer /> */}
        </div>
    );
};

export default BottomNav;
