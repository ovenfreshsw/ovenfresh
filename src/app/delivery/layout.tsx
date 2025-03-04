import ErrorComponent from "@/components/error";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Store from "@/models/storeModel";
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

    return <>{children}</>;
}
