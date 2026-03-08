"use client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useItems } from "./ItemsContext";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
function ProcessInventoryButton() {
    const { items } = useItems();
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
    const router = useRouter();
    const handleProcessInventory = async () => {
        const missingExpiration = items.filter((item) => !item.expiration);
        if (missingExpiration.length > 0) {
            toast.error("Missing expiration dates", {
                description: `${missingExpiration.length} item${missingExpiration.length > 1 ? "s are" : " is"} missing an expiration date.`,
            });
            return;
        }

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
            await queryClient.invalidateQueries({ queryKey: ["items"] });
            toast.success("Inventory processed successfully");
            router.push("/");
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
        <Button
            onClick={handleProcessInventory}
            disabled={isLoading}
            className="mx-auto block"
        >
            {isLoading ? "Processing..." : "Process Inventory Entry"}
        </Button>
    );
}
export default ProcessInventoryButton;