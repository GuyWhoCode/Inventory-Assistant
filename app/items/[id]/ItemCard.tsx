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
import { useRouter } from "next/navigation";
import { Item } from "@/types";

function ItemCard({ item }: { item: Item }) {
    const router = useRouter();
    const [name, setName] = useState(item.name);
    const [quantity, setQuantity] = useState(item.quantity);
    const [loggedUsage, setLoggedUsage] = useState<number>(0);
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

    const handleLogUsage = () => {
        if (loggedUsage <= 0) return;
        try {
            fetch("/api/usage-log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    item_id: item.id,
                    usage_amount: loggedUsage,
                }),
            });
        } catch (err) {
            console.error("Failed to log usage:", err);
        }
        setLoggedUsage(0);
    };

    function handleSustainable() {
        // hook up to your procurement suggestion logic
    }

    return (
        <Card className="flex-1">
            <CardHeader className="flex flex-row items-start justify-between">
                <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="text-3xl font-semibold border-none shadow-none px-0 w-auto cursor-pointer"
                    placeholder="Item name..."
                />
                <CardTitle className="text-4xl text-muted-foreground whitespace-nowrap">
                    Item Details
                </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-row items-center gap-0">
                {/* Quantity */}
                <div className="flex flex-col pr-6">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Quantity
                    </p>
                    <Input
                        type="number"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                        className="text-7xl font-bold tabular-nums border-none shadow-none px-0 w-48 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none cursor-pointer"
                    />
                </div>

                {/* Avg Usage Rate */}
                <div className="flex flex-col gap-1 px-6 border-l">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Avg Usage Rate
                    </p>
                    <p className="text-2xl font-semibold tabular-nums">
                        {item.usage_rate}{" "}
                        <span className="text-sm font-normal text-muted-foreground">
                            / day
                        </span>
                    </p>
                </div>

                {/* Est. Days Remaining */}
                <div className="flex flex-col gap-1 px-6 border-l">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Est. Days Remaining
                    </p>
                    <p className="text-2xl font-semibold tabular-nums">
                        {item.usage_rate > 0
                            ? Math.floor(quantity / item.usage_rate)
                            : "—"}
                        <span className="text-sm font-normal text-muted-foreground">
                            {" "}
                            days
                        </span>
                    </p>
                </div>

                {/* Log Usage */}
                <div className="flex flex-col gap-2 px-6 border-l">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Log Today's Usage
                    </p>
                    <div className="flex items-center gap-2">
                        <Input
                            type="number"
                            value={loggedUsage}
                            onChange={(e) =>
                                setLoggedUsage(Number(e.target.value))
                            }
                            placeholder="0"
                            className="w-24 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleLogUsage}
                        >
                            Log
                        </Button>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 ml-auto pl-6 border-l">
                    <Button
                        variant="outline"
                        className="flex flex-col h-24 w-44 gap-2 text-destructive border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
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
        </Card>
    );
}

export default ItemCard;
