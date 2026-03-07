"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Field } from "@/components/ui/field";
import { InputGroup } from "@/components/ui/input-group";

type InventoryItem = {
    name: string;
    quantity: number;
    expiration: string;
};

type Props = {
    onSubmit?: (item: InventoryItem) => void;
    defaultValues: InventoryItem;
};

export function InventoryItemCard({ onSubmit, defaultValues }: Props) {
    const [name, setName] = useState(defaultValues.name);
    const [quantity, setQuantity] = useState<number>(defaultValues.quantity);
    const [expiration, setExpiration] = useState(defaultValues.expiration);

    const [errors, setErrors] = useState<{ name?: string; quantity?: string }>(
        {},
    );

    function validate(values: { name: string; quantity: number }) {
        const next: typeof errors = {};

        if (!values.name.trim()) next.name = "Name is required.";
        if (!Number.isFinite(values.quantity) || values.quantity <= 0) {
            next.quantity = "Quantity must be greater than 0.";
        }

        setErrors(next);
        return Object.keys(next).length === 0;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const cleaned = {
            name: name.trim(),
            quantity,
            expiration,
        };

        if (!validate({ name: cleaned.name, quantity: cleaned.quantity }))
            return;

        onSubmit?.(cleaned);

        toast.success("Item saved", {
            description: `${cleaned.name} (qty ${cleaned.quantity}) added successfully.`,
        });
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
                            setName(defaultValues.name);
                            setQuantity(defaultValues.quantity);
                            setExpiration(defaultValues.expiration);
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

function HomePage() {
    return (
        <div>
            <h1>Inventory Assistant</h1>
            <p>Welcome to the Inventory Assistant!</p>

            <h2>Initialize Inventory</h2>
            <InventoryItemCard
                defaultValues={{ name: "", quantity: 0, expiration: "" }}
                onSubmit={(item) => {
                    console.log("New item:", item);
                    // Here you would typically send the item to your backend API
                }}
            />
        </div>
    );
}

export default HomePage;
