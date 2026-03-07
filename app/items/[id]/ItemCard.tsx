"use client";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trash2, Leaf } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { ChartLineDots } from "./Chart";
import { useRouter } from "next/navigation";

type Item = {
    id: number;
    name: string;
    quantity: number;
    expiration: string;
    usage_rate: string;
};

function ItemCard({ item }: { item: Item }) {
    const router = useRouter();
    const [name, setName] = useState(item.name);
    const [quantity, setQuantity] = useState(item.quantity);
    const isDirty = name !== item.name || quantity !== item.quantity;

    async function handleSave() {
        await fetch(`/api/items/${item.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, quantity }),
        });
    }

    async function handleDelete() {
        try {
            await fetch(`/api/items/${item.id}`, { method: "DELETE" });
            router.push("/");
        } catch (err) {
            console.error("Failed to delete item:", err);
        }
    }

    function handleSustainable() {
        // hook up to your procurement suggestion logic
    }

    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row items-start justify-between">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-3xl font-semibold border-none shadow-none px-0 focus-visible:ring-0 w-auto"
                    placeholder="Item name..."
                />
                <CardTitle className="text-4xl text-muted-foreground whitespace-nowrap">
                    Item Details
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-row items-start gap-4">
                <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="text-7xl font-bold tabular-nums border-none shadow-none px-0 focus-visible:ring-0 w-48 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />

                <div className="flex flex-col gap-2 ml-auto">
                    <Button
                        variant="outline"
                        className="flex flex-col h-24 w-22 gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                        onClick={handleDelete}
                    >
                        <Trash2 className="h-5 w-5" />
                    </Button>
                    <Button
                        variant="outline"
                        className="flex flex-col h-24 w-44 gap-2 text-green-600 border-green-600/30 hover:bg-green-600/10 hover:text-green-700"
                        onClick={handleSustainable}
                    >
                        <Leaf className="h-5 w-5" />
                        <span className="text-xs text-center leading-tight">
                            Suggest Sustainable Procurement
                        </span>
                    </Button>
                </div>
            </CardContent>

            <CardFooter className="flex items-center justify-between">
                <Link
                    href="/"
                    className="text-sm text-muted-foreground hover:underline"
                >
                    ← Back to Home
                </Link>
                {isDirty && <Button onClick={handleSave}>Save Changes</Button>}
            </CardFooter>

            <ChartLineDots />
        </Card>
    );
}

export default ItemCard;
