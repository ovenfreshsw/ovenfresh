"use client";

import SignOutButton from "@/components/sign-out-button";
import Upload from "@/components/upload/upload";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";
import React, { useState } from "react";

const Home = () => {
    const [resource, setResource] = useState<
        CloudinaryUploadWidgetInfo & { url: string }
    >();
    return (
        <div>
            Home
            <SignOutButton />
            <Upload setResource={setResource} folder="catering_menu" />
            {resource?.url && (
                <Image src={resource.url} alt="Test" width={100} height={100} />
            )}
        </div>
    );
};

export default Home;
