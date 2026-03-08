"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Item } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

async function fetchItems(): Promise<Item[]> {
    const res = await fetch(`/api/items`, {
        // Opt out of Next.js fetch cache so React Query controls caching
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch ITEMS: ${res.statusText}`);
    }

    return res.json().then((r) => r.items);
}

function ItemSkeleton() {
    return (
        <div className="rounded-lg border p-4 space-y-3" aria-hidden="true">
            <Skeleton className="h-3 w-1/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-4/5" />
        </div>
    );
}

function LoadingState() {
    return (
        <section
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            aria-label="Loading items…"
        >
            {Array.from({ length: 6 }).map((_, i) => (
                <ItemSkeleton key={i} />
            ))}
        </section>
    );
}

// ─── Item card ───────────────────────────────────────────────────────────────
function ItemCard({ item }: { item: Item }) {
    const router = useRouter();
    const handleClick = () => {
        router.push(`/items/${item.id}`);
    };

    return (
        <Card
            className="cursor-pointer transition-colors hover:bg-muted/50"
            id = {`item-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
            onClick={handleClick}
        >
            <CardHeader className="pb-2">
                <span className="text-xs text-muted-foreground font-mono">
                    #{item.id}
                </span>
                <CardTitle className="text-sm">{item.name}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-1">
                <p>Quantity: {item.quantity}</p>
                <p>Usage rate: {item.usage_rate}</p>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-1 border-t pt-3">
                <time
                    className="text-xs text-muted-foreground font-mono"
                    dateTime={item.expiration}
                >
                    Expires:{" "}
                    {new Date(item.expiration).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </time>
                <time
                    className="text-xs text-muted-foreground font-mono"
                    dateTime={item.created_at}
                >
                    Added:{" "}
                    {new Date(item.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                    })}
                </time>
            </CardFooter>
        </Card>
    );
}

// ─── Main client component ───────────────────────────────────────────────────

export default function ItemsClient() {
    const {
        data: items,
        isPending,
        isError,
        error,
    } = useQuery<Item[]>({
        queryKey: ["items"],
        queryFn: fetchItems,
    });

    return (
        <div className="p-6 max-w-6xl mx-auto space-y-6">
            <header className="flex items-baseline gap-3 border-b pb-4">
                <h1 className="text-2xl font-bold tracking-tight">Items</h1>
                {!isPending && items && (
                    <Badge variant="outline" className="font-mono">
                        {items.length} entries
                    </Badge>
                )}
            </header>
            {isPending && <LoadingState />}
            {isError && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Failed to load items</AlertTitle>
                    <AlertDescription>
                        {error instanceof Error
                            ? error.message
                            : "Unknown error"}
                    </AlertDescription>
                </Alert>
            )}
            {items && items.length === 0 && (
                <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
                    <p className="text-muted-foreground text-sm">
                        No items found.
                    </p>
                    <Button asChild>
                        <Link href="/initialize">Initialize Inventory</Link>
                    </Button>
                </div>
            )}
            {items && items.length > 0 && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </section>
            )}
        </div>
    );
}
