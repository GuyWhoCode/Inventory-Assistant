"use client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useItems } from "./ItemsContext";


function InventoryItemCard() {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState<number>(0);
    const [expiration, setExpiration] = useState("");
    const [errors, setErrors] = useState<{ name?: string; quantity?: string }>(
        {},
    );
    const { addItem } = useItems();


    function validate(values: { name: string; quantity: number }) {
        const next: typeof errors = {};

        if (!values.name.trim()) next.name = "Name is required.";
        if (!Number.isFinite(values.quantity) || values.quantity <= 0) {
            next.quantity = "Quantity must be greater than 0.";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const cleaned = {
            id: Math.floor(Math.random() * 1000000),
            name: name.trim(),
            quantity,
            expiration,
            created_at: new Date().toISOString(),
            usage_rate: 0
        };

        if (!validate({ name: cleaned.name, quantity: cleaned.quantity }))
            return;

        try {
            // await fetch("/api/items", {
            //     method: "POST",
            //     headers: { "Content-Type": "application/json" },
            //     body: JSON.stringify(cleaned),
            // });
            addItem(cleaned);

            toast.success("Item saved", {
                description: `${cleaned.name} (qty ${cleaned.quantity}) added successfully.`,
            });
        } catch (err) {
            console.error("Error adding item:", err);
            toast.error("Failed to save item. Please try again.");
            return;
        }
    }

    return (
        <Card className="w-full max-w-md">
            <CardHeader>
                <CardTitle>Add inventory item</CardTitle>
                <CardDescription>Enter the item details below.</CardDescription>
            </CardHeader>

            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <Field>
                        <Label htmlFor="item-name">Name</Label>
                        <InputGroup>
                            <Input
                                id="item-name"
                                placeholder="e.g. Milk"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    if (errors.name)
                                        setErrors((p) => ({
                                            ...p,
                                            name: undefined,
                                        }));
                                }}
                                aria-invalid={!!errors.name}
                            />
                        </InputGroup>
                        {errors.name && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.name}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <Label htmlFor="item-quantity">Quantity</Label>
                        <InputGroup>
                            <Input
                                id="item-quantity"
                                type="number"
                                min={1}
                                step={1}
                                value={
                                    Number.isFinite(quantity) ? quantity : ""
                                }
                                onChange={(e) => {
                                    const v = e.target.value;
                                    setQuantity(v === "" ? NaN : Number(v));
                                    if (errors.quantity)
                                        setErrors((p) => ({
                                            ...p,
                                            quantity: undefined,
                                        }));
                                }}
                                aria-invalid={!!errors.quantity}
                            />
                        </InputGroup>
                        {errors.quantity && (
                            <p className="text-sm font-medium text-destructive">
                                {errors.quantity}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <Label htmlFor="item-expiration">Expiration</Label>
                        <InputGroup>
                            <Input
                                id="item-expiration"
                                type="date"
                                value={expiration}
                                onChange={(e) => setExpiration(e.target.value)}
                            />
                        </InputGroup>
                    </Field>
                </CardContent>

                <CardFooter className="gap-2">
                    <Button type="submit">Save item</Button>
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={() => {
                            setName("");
                            setQuantity(0);
                            setExpiration("");
                            setErrors({});
                        }}
                    >
                        Reset
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
}

export default InventoryItemCard