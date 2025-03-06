import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
    interface User extends DefaultUser {
        username: string;
        role: string;
        storeId: string; // Add storeId to the User interface
    }
    interface Session extends DefaultSession {
        user: User & {
            username: string;
        };
        session: {
            username: string;
        };
    }
}
