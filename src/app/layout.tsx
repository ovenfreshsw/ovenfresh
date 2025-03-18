import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { HeroUIProvider } from "@heroui/system";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { Poppins } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import QueryProvider from "@/providers/query-provider";
import theme from "../theme";
import { Provider } from "@/providers/auth-provider";
import ReduxProvider from "@/store/provider";

const poppins = Poppins({
    weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
    variable: "--font-poppins",
});

export const metadata: Metadata = {
    title: "The Oven Fresh",
    description: "Your Favorite South Indian Restaurant",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <Provider session={session}>
                <body className={`${poppins.variable} antialiased`}>
                    <ReduxProvider>
                        <AppRouterCacheProvider>
                            <QueryProvider>
                                <ThemeProvider theme={theme}>
                                    <HeroUIProvider>{children}</HeroUIProvider>
                                </ThemeProvider>
                            </QueryProvider>
                        </AppRouterCacheProvider>
                    </ReduxProvider>
                    <Toaster
                        position="top-right"
                        richColors
                        className="z-[1560]"
                    />
                </body>
            </Provider>
        </html>
    );
}
