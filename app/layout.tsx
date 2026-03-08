import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { initDB } from "@/lib/db";
import QueryProvider from "@/lib/QueryProvider";
import { ItemsProvider } from "./add/ItemsContext";

export const metadata: Metadata = {
    title: "Inventory Assistant",
    description: "Inventory Assistant",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    await initDB();

    return (
        <html lang="en">
            <body>
                <ItemsProvider>
                    <QueryProvider>
                        {children}
                        <Toaster position="bottom-right" closeButton />
                    </QueryProvider>
                </ItemsProvider>
            </body>
        </html>
    );
}
