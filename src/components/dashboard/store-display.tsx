import { MapPin } from "lucide-react";
import { Show } from "../show";
import { Badge } from "../ui/badge";
import StoreSelect from "../select/store-select";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Store from "@/models/storeModel";
import { NavUser } from "../nav/user";

const StoreDisplay = async () => {
    const session = await getServerSession(authOptions);

    if (
        !session?.user.id ||
        (!session?.user.storeId && session?.user.role !== "SUPERADMIN")
    )
        return null;

    await connectDB();
    const allStores = await Store.find();
    const store = allStores.find((store) => store.id === session.user.storeId);
    return (
        <>
            <div className="flex items-center gap-2">
                <Show>
                    <Show.When isTrue={session.user.role !== "SUPERADMIN"}>
                        <Badge
                            variant="outline"
                            className="h-8 gap-1.5 rounded-lg px-3 text-sm font-light text-primary-foreground"
                        >
                            <MapPin className="h-4 w-4" />
                            <span className="capitalize">{store.location}</span>
                        </Badge>
                    </Show.When>
                    <Show.When isTrue={session.user.role === "SUPERADMIN"}>
                        <StoreSelect
                            active={store.id}
                            stores={allStores.map((store) => ({
                                id: store._id.toString(),
                                location: store.location,
                            }))}
                        />
                    </Show.When>
                </Show>
            </div>
            <NavUser
                user={{
                    avatar: "",
                    name: session.user.username,
                    role: session.user.role.toLowerCase(),
                }}
            />
        </>
    );
};

export default StoreDisplay;
