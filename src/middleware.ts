export { default } from "next-auth/middleware";

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/sticker/:path*",
        "/summary/:path*",
        "/delivery/:path*",
    ],
};
