"use client";

import { CldUploadWidget, CloudinaryUploadWidgetInfo } from "next-cloudinary";

const Upload = ({
    setResource,
    folder,
}: {
    setResource: React.Dispatch<
        React.SetStateAction<string | CloudinaryUploadWidgetInfo | undefined>
    >;
    folder: string;
}) => {
    return (
        <CldUploadWidget
            uploadPreset="restaurant_ca"
            options={{
                folder,
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
                return <button onClick={handleOnClick}>Upload an Image</button>;
            }}
        </CldUploadWidget>
    );
};

export default Upload;
