import BottomNav from "@/components/delivery/bottom-nav";
import Navbar from "@/components/delivery/navbar";
import ErrorComponent from "@/components/error";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Store from "@/models/storeModel";
import { Provider } from "@/providers/auth-provider";
import { getServerSession } from "next-auth";

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
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

    await connectDB();
    const store = await Store.findById(session.user.storeId);

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 max-w-md mx-auto">
            {/* Header */}
            <Navbar store={store.location || "Not Found"} />
            <Provider session={session}>{children}</Provider>
            <BottomNav />
        </div>
    );
}
