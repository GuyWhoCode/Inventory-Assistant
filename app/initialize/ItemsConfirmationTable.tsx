"use client";

import { DataTable } from "@/components/datatable";
import { columns } from "./columns";
import { useState } from "react";
import { Item } from "@/types";

function ItemsConfirmationTable() {
    const initialData: Item[] = [
        {
            name: "Milk",
            quantity: 2,
            expiration: "2026-03-10",
            usage_rate: 0.5,
            created_at: "2024-01-01T00:00:00Z",
            id: 1,
        },
        {
            name: "Eggs",
            quantity: 12,
            expiration: "2026-03-15",
            usage_rate: 0.3,
            created_at: "2024-01-01T00:00:00Z",
            id: 2,
        },
    ];
    const [data, setData] = useState<Item[]>(initialData);

    const handleDeleteRows = (rowsToDelete: Item[]) => {
        setData((prev) => prev.filter((item) => !rowsToDelete.includes(item)));
    };

    
    return (
        <div>
            <DataTable columns={columns} data={data} onDeleteRows={handleDeleteRows} />;
        </div>
    );
}

export default ItemsConfirmationTable;
