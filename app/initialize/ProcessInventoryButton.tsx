"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useItems } from "./ItemsContext";

function ProcessInventoryButton() {
    const { items } = useItems();
    const [isLoading, setIsLoading] = useState(false);

    const handleProcessInventory = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/items", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ items }),
            });

            if (!response.ok) {
                throw new Error(
                    `Request failed with status ${response.status}`,
                );
            }

            const data = await response.json();
            toast.success("Inventory processed successfully");
        } catch (error) {
            toast.error("Failed to process inventory", {
                description:
                    error instanceof Error
                        ? error.message
                        : "An unexpected error occurred",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button onClick={handleProcessInventory} disabled={isLoading}>
            {isLoading ? "Processing..." : "Process Inventory Entry"}
        </Button>
    );
}

export default ProcessInventoryButton;
