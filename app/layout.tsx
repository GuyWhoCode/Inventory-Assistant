import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner"
import "./globals.css";
import { initDB } from "@/lib/db";

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
                {children}
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
}
