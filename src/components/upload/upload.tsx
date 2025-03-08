"use client";

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

const Upload = ({
    setResource,
    folder,
    children,
}: {
    setResource: React.Dispatch<
        React.SetStateAction<string | CloudinaryUploadWidgetInfo | undefined>
    >;
    folder: string;
    children: React.ReactNode;
}) => {
    return (
        <CldUploadWidget
            uploadPreset="restaurant_ca"
            options={{
                folder,
                defaultSource: "camera",
                sources: ["camera", "local"],
            }}
            onSuccess={(result) => {
                setResource(result?.info); // { public_id, secure_url, etc }
            }}
        >
            {({ open }) => {
                function handleOnClick() {
                    setResource(undefined);
                    open();
                    console.log("CLICKED");
                }
                return <div onClick={handleOnClick}>{children}</div>;
            }}
        </CldUploadWidget>
    );
};

export default Upload;
