"use client";

import { signOut } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "./ui/button";

const SignOutButton = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    async function handleSignOut() {
        try {
            await signOut({
                redirect: true,
                callbackUrl: "/",
            });
            toast.success("Signed out successfully.");
        } catch {
            toast.error("Something went wrong");
        }
    }

    return (
        <Button onClick={handleSignOut} color="primary" className={className}>
            {children ? children : "Sign out"}
        </Button>
    );
};

export default SignOutButton;
