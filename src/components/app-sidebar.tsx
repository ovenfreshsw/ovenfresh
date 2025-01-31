"use client";

import * as React from "react";
import {
    AudioWaveform,
    BookOpen,
    Bot,
    Circle,
    Command,
    Frame,
    GalleryVerticalEnd,
    Home,
    Map,
    NotebookPen,
    Package,
    PieChart,
    Settings,
    Settings2,
    SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";

// This is sample data.
const data = {
    user: {
        name: "Prajil K",
        email: "prajil@rentit.com",
        avatar: "https://avatar.iran.liara.run/public/17",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],
    navMain: [
        {
            title: "Playground",
            url: "#",
            icon: SquareTerminal,
            isActive: true,
            items: [
                {
                    title: "History",
                    url: "#",
                },
                {
                    title: "Starred",
                    url: "#",
                },
                {
                    title: "Settings",
                    url: "#",
                },
            ],
        },
        {
            title: "Models",
            url: "#",
            icon: Bot,
            items: [
                {
                    title: "Genesis",
                    url: "#",
                },
                {
                    title: "Explorer",
                    url: "#",
                },
                {
                    title: "Quantum",
                    url: "#",
                },
            ],
        },
        {
            title: "Documentation",
            url: "#",
            icon: BookOpen,
            items: [
                {
                    title: "Introduction",
                    url: "#",
                },
                {
                    title: "Get Started",
                    url: "#",
                },
                {
                    title: "Tutorials",
                    url: "#",
                },
                {
                    title: "Changelog",
                    url: "#",
                },
            ],
        },
        {
            title: "Settings",
            url: "#",
            icon: Settings2,
            items: [
                {
                    title: "General",
                    url: "#",
                },
                {
                    title: "Team",
                    url: "#",
                },
                {
                    title: "Billing",
                    url: "#",
                },
                {
                    title: "Limits",
                    url: "#",
                },
            ],
        },
    ],
    projects: [
        {
            name: "Design Engineering",
            url: "#",
            icon: Frame,
        },
        {
            name: "Sales & Marketing",
            url: "#",
            icon: PieChart,
        },
        {
            name: "Travel",
            url: "#",
            icon: Map,
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar
            collapsible="icon"
            {...props}
            className="border-none [&_[data-sidebar=sidebar]]:bg-[#f4f4f4]"
        >
            <SidebarHeader>
                <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                    <div className="flex items-center justify-center rounded-lg aspect-square size-8 bg-sidebar-primary text-sidebar-primary-foreground">
                        <Circle className="size-4" />
                    </div>
                    <div className="grid flex-1 text-sm leading-tight text-left">
                        <span className="font-semibold truncate">RentIt</span>
                        <span className="text-xs truncate">Enterpsie</span>
                    </div>
                </SidebarMenuButton>
            </SidebarHeader>
            <hr />
            <SidebarContent className="scrollbar-thin py-4">
                <SidebarGroup>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip={"Booking"}
                                className="hover:bg-gray-200"
                                asChild
                            >
                                <Link
                                    href={"/b"}
                                    className="flex items-center gap-2 w-full"
                                >
                                    <NotebookPen size={17} />
                                    <span className="text-sm font-medium">
                                        Booking
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip={"Home"}
                                className="hover:bg-gray-200"
                                asChild
                            >
                                <Link
                                    href={"/b"}
                                    className="flex items-center gap-2 w-full"
                                >
                                    <Home size={17} />
                                    <span className="text-sm font-medium">
                                        Home
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip={"Orders"}
                                className="hover:bg-gray-200"
                                asChild
                            >
                                <Link
                                    href={"/b"}
                                    className="flex items-center relative gap-2 w-full"
                                >
                                    <Package size={17} />
                                    <span className="text-sm font-medium">
                                        Orders
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                tooltip={"Settings"}
                                className="hover:bg-gray-200"
                                asChild
                            >
                                <Link
                                    href={"/a"}
                                    className="flex items-center relative gap-2 w-full"
                                >
                                    <Settings size={17} />
                                    <span className="text-sm font-medium">
                                        Settings
                                    </span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroup>
                <NavMain items={data.navMain} />
                <NavProjects projects={data.projects} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser user={data.user} />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
