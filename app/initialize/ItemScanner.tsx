"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload, Loader2 } from "lucide-react";
import { useItems } from "./ItemsContext";
import { ItemEntry } from "@/types";

type ScanResult = {
    items: ItemEntry[];
    total_count: number;
    uncertain: boolean;
};

export default function ItemScanner() {
    const [isLoading, setIsLoading] = useState(false);
    const { setItems } = useItems();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        setIsLoading(true);

        try {
            const res = await fetch("/api/scan-items", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Scan failed");

            const data: ScanResult = await res.json();
            setItems(data.items);
            toast.success("Image scanned successfully.");
        } catch (err) {
            toast.error("Failed to scan image. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle className="text-sm">Scan Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Upload button */}
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors">
                    {isLoading ? (
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    ) : (
                        <>
                            <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                            <span className="text-xs text-muted-foreground">
                                Click to upload an image
                            </span>
                        </>
                    )}
                    <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                        disabled={isLoading}
                    />
                </label>
            </CardContent>
        </Card>
    );
}
