import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NavUser } from "../nav/user";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import ErrorComponent from "../error";
import { MapPin } from "lucide-react";

const Navbar = async ({ store }: { store: string }) => {
    const session = await getServerSession(authOptions);
    if (
        !session?.user.id ||
        (!session?.user.storeId && session?.user.role !== "SUPERADMIN") ||
        session?.user.role !== "DELIVERY"
    ) {
        return (
            <ErrorComponent
                message="You are not authorized to access this page"
                code={403}
                key={"Forbidden"}
            />
        );
    }
    return (
        <header className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-sm">
            <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Delivery App
                    </h1>
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 border border-primary/20 rounded-md px-2 py-1">
                            <MapPin className="size-3 text-primary" />
                            <span className="text-xs">{store}</span>
                        </div>
                        <NavUser
                            user={{
                                avatar: "",
                                name: session.user.username,
                                role: session.user.role,
                            }}
                            triggerClassname="outline-none rounded-full"
                        >
                            <Avatar>
                                <AvatarImage
                                    src="/placeholder.svg?height=40&width=40"
                                    alt={session.user.username}
                                />
                                <AvatarFallback className="uppercase">
                                    {session.user.username[0]}
                                </AvatarFallback>
                            </Avatar>
                        </NavUser>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;
