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

    if (session?.user.id) redirect("/dashboard");

    return (
        <div className="flex items-center justify-center min-h-screen bg-white sm:bg-gray-100 lg:py-10">
            <Card className="w-full max-w-md h-screen sm:h-auto rounded-none sm:rounded-2xl sm:p-5 shadow-none sm:shadow border-none sm:border-solid">
                <CardHeader>
                    <div className="my-5 relative">
                        <Image
                            src={"/logo.webp"}
                            alt="Logo"
                            width={60}
                            height={100}
                        />
                    </div>
                    <CardTitle className="text-lg">Welcome back!</CardTitle>
                    <CardDescription className="text-sm">
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
