"use client"; // Error boundaries must be Client Components

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Error({
    error,
}: {
    error: Error & { digest?: string };
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error);
    }, [error]);

    return (
        <main className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="max-w-md w-full text-center space-y-6">
                <div className="space-y-2">
                    <div className="inline-block p-4 bg-destructive/10 rounded-full">
                        <AlertCircle
                            className="w-12 h-12 text-destructive"
                            aria-hidden="true"
                        />
                    </div>
                    <h1 className="text-4xl font-bold tracking-tighter">400</h1>
                    <h2 className="text-2xl font-semibold text-muted-foreground">
                        Bad Request
                    </h2>
                </div>

                <div className="space-y-4">
                    <h1 className="font-bold">- {error.message} -</h1>
                    <p className="text-muted-foreground">
                        Oops! The server cannot process this request due to
                        invalid syntax or missing parameters.
                    </p>

                    <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">
                            Here are some helpful links:
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2 justify-center">
                            <Button
                                variant={"outline"}
                                onClick={() => window.location.reload()}
                            >
                                Refresh
                            </Button>
                            <Button asChild>
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
