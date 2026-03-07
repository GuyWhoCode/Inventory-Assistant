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
import Link from "next/link";
import { useState } from "react";
import { ChartLineDots } from "./Chart";

type Item = {
    id: number;
    name: string;
    quantity: number;
    expiration: string;
    usage_rate: string;
};

function ItemCard({ item }: { item: Item }) {
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

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between">
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

            <CardContent className="space-y-2">
                <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="text-7xl font-bold tabular-nums border-none shadow-none px-0 focus-visible:ring-0 w-48 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
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
