"use client";

import { DataTable } from "@/components/datatable";
import { columns } from "@/components/columns";
import Link from "next/link";
import InventoryItemCard from "./InventoryItemCard";
import DeleteItemForm from "./DeleteItemForm";
import { InventoryItem } from "./InventoryItem";


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
            <Link href="/">Dashboard View</Link>
            <br />
            <Link href="/items/1">Item Details View</Link>

            <h1>Inventory Assistant</h1>
            <p>Welcome to the Inventory Assistant!</p>

            <h2>Initialize Inventory</h2>
            <InventoryItemCard
                defaultValues={{ name: "", quantity: 0, expiration: "" }}
            />

            <h2>Delete Item</h2>
            <DeleteItemForm />

            <DataTable columns={columns} data={data} />
        </div>
    );
}

export default HomePage;
