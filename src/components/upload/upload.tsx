"use client";

import { CldUploadWidget } from "next-cloudinary";

const Upload = ({
    setResource,
    folder,
}: {
    setResource: React.Dispatch<any>;
    folder: string;
}) => {
    return (
        <CldUploadWidget
            uploadPreset="restaurant_ca"
            options={{
                folder,
            }}
            onSuccess={(result, { widget }) => {
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
