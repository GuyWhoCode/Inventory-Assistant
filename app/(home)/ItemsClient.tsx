"use client";

import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

type Item = {
  id: number;
  name: string;
  quantity: number;
  created_at: string;
};

async function fetchItems(): Promise<Item[]> {
  const res = await fetch(`/api/items`, {
    // Opt out of Next.js fetch cache so React Query controls caching
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ITEMS: ${res.statusText}`);
  }

  return res.json().then(r => r.items);
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
    return (
        <article className="rounded-lg border p-4 space-y-2 hover:bg-muted/50 transition-colors">
            <span className="text-xs text-muted-foreground font-mono">
                #{item.id}
            </span>
            <h2 className="font-semibold text-sm">{item.name}</h2>
            <p className="text-sm text-muted-foreground">{item.description}</p>
            <time
                className="block text-xs text-muted-foreground border-t pt-2 font-mono"
                dateTime={item.created_at}
            >
                {new Date(item.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                })}
            </time>
        </article>
    );
}

// ─── Main client component ───────────────────────────────────────────────────

export default function ItemsClient() {
    const {
        data: items,
        isLoading,
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
                {!isLoading && items && (
                    <span className="text-xs text-muted-foreground border rounded-full px-2 py-0.5 font-mono">
                        {items.length} entries
                    </span>
                )}
            </header>

            {isLoading && <LoadingState />}

            {isError && (
                <div
                    className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive"
                    role="alert"
                >
                    <p className="font-medium">Failed to load items.</p>
                    <pre className="mt-1 text-xs opacity-70">
                        {error instanceof Error
                            ? error.message
                            : "Unknown error"}
                    </pre>
                </div>
            )}

            {items && (
                <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map((item) => (
                        <ItemCard key={item.id} item={item} />
                    ))}
                </section>
            )}
        </div>
    );
}
