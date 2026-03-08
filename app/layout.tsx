import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { initDB } from "@/lib/db";
import QueryProvider from "@/lib/QueryProvider";

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
                <QueryProvider>
                    {children}
                    <Toaster position="bottom-right" closeButton />
                </QueryProvider>
            </body>
        </html>
    );
}
