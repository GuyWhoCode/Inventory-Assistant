import { DataTable } from "@/components/datatable";
import { columns } from "@/components/columns";
import Link from "next/link";
import { InventoryItem } from "./InventoryItem";
import ItemsClient from "./ItemsClient";

function HomePage() {
    const data: InventoryItem[] = [
        { name: "Milk", quantity: 2, expiration: "2026-03-10" },
        { name: "Eggs", quantity: 12, expiration: "2026-03-15" },
    ];

    return (
        <div>
            <h1>Pages</h1>
            <Link href="/initialize">Initialize Inventory</Link>
            <br />
            <Link href="/items/1">Item Details View</Link>

            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Inventory Assistant</h1>

            <DataTable columns={columns} data={data} />

            <ItemsClient />
        </div>
    );
}

export default HomePage;
