"use client";

import {
    CldUploadWidget,
    CloudinaryUploadWidgetInfo,
    CloudinaryUploadWidgetOptions,
} from "next-cloudinary";

const Upload = ({
    setResource,
    folder,
    children,
    defaultSource = "camera",
    sources = ["camera", "local"],
    extraOptions,
}: {
    setResource: React.Dispatch<
        React.SetStateAction<string | CloudinaryUploadWidgetInfo | undefined>
    >;
    folder: string;
    children: React.ReactNode;
    defaultSource?: string;
    sources?: CloudinaryUploadWidgetOptions["sources"];
    extraOptions?: Partial<CloudinaryUploadWidgetInfo>;
}) => {
    return (
        <CldUploadWidget
            uploadPreset="restaurant_ca"
            options={{
                folder,
                defaultSource,
                sources,
                ...extraOptions,
            }}
            onSuccess={(result) => {
                setResource(result?.info); // { public_id, secure_url, etc }
            }}
        >
            {({ open }) => {
                function handleOnClick() {
                    setResource(undefined);
                    open();
                }
                return <div onClick={handleOnClick}>{children}</div>;
            }}
        </CldUploadWidget>
    );
};

export default Upload;
