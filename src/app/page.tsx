import AuthForm from "@/components/forms/auth-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import Image from "next/image";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (session?.user.id && session.user.role === "DELIVERY")
        redirect("/delivery");
    else if (session?.user.id) redirect("/dashboard");

    return (
        <div className="flex items-center justify-center min-h-screen bg-white sm:bg-gray-100 lg:py-10">
            <Card className="relative pt-24 sm:pt-3 w-full max-w-sm h-screen sm:h-auto rounded-none sm:rounded-2xl sm:p-3 shadow-none sm:shadow border-none sm:border-solid">
                <CardHeader className="text-primary">
                    <div className="my-5 absolute top-0 sm:-top-16 left-1/2 -translate-x-1/2">
                        <Image
                            src={"/logo.webp"}
                            alt="Logo"
                            width={80}
                            height={80}
                        />
                    </div>
                    <CardTitle className="text-lg">Welcome back!</CardTitle>
                    <CardDescription className="text-sm text-primary">
                        Enter your credentials to access your account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <AuthForm />
                </CardContent>
            </Card>
        </div>
    );
}
