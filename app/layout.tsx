import type { Metadata } from "next";
import { ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner"

export const metadata: Metadata = {
    title: "Inventory Assistant",
    description: "Inventory Assistant",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                {children}
                <Toaster position="bottom-right" />
            </body>
        </html>
    );
}
