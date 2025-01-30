"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "./ui/breadcrumb"
import React from "react";

const NavBreadcrumb = () => {
    const pathname = usePathname();
    const paths = pathname.split("/").filter(Boolean);
    
  return (
    <Breadcrumb>
        <BreadcrumbList>
            {paths.slice(0, paths.length - 1).map((path, i) => (
                <React.Fragment key={i}>
                    <BreadcrumbItem className="hidden md:block">
                        <BreadcrumbLink href={`/${paths.slice(0, i + 1).join("/")}`} className="capitalize">
                            {path}
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                </React.Fragment>
            ))}
            <BreadcrumbItem>
                <BreadcrumbPage className="capitalize">
                    {paths[paths.length - 1]}
                </BreadcrumbPage>
            </BreadcrumbItem>
        </BreadcrumbList>
    </Breadcrumb>
  )
}

export default NavBreadcrumb