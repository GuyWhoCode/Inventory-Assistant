import { DataTable } from "@/components/datatable";
import { columns } from "@/components/columns";
import Link from "next/link";
import ItemsClient from "./ItemsClient";
import NotificationPanel from "./NotificationPanel";
import { Item } from "@/types";


function HomePage() {
    const data: Item[] = [
        { name: "Milk", quantity: 2, expiration: "2026-03-10", usage_rate: 0.5, created_at: "2024-01-01T00:00:00Z", id: 1 },
        { name: "Eggs", quantity: 12, expiration: "2026-03-15", usage_rate: 0.3, created_at: "2024-01-01T00:00:00Z", id: 2 },
    ];

    return (
        <div>
            <h1>Pages</h1>
            <Link href="/initialize">Initialize Inventory</Link>
            <br />
            <Link href="/items/1">Item Details View</Link>

            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                Inventory Assistant
            </h1>

            <DataTable columns={columns} data={data} />

            <div className="flex h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <ItemsClient />
                </main>

                <NotificationPanel />
            </div>
        </div>
    );
}

export default HomePage;
