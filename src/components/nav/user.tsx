"use client";

import { LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export function NavUser({
    children,
    triggerClassname,
    user,
}: {
    children: React.ReactNode;
    triggerClassname?: string;
    user: {
        name: string;
        avatar: string;
        role: string;
    };
}) {
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
        <DropdownMenu>
            <DropdownMenuTrigger className={triggerClassname}>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                align="end"
                sideOffset={4}
            >
                <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback className="rounded-full uppercase">
                                {user.name[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-semibold capitalize">
                                {user.name}
                            </span>
                            <span className="truncate text-xs capitalize">
                                {user.role}
                            </span>
                        </div>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut />
                    Log out
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
