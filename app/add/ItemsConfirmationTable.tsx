"use client";

import { DataTable } from "@/components/datatable";
import { columns } from "./columns";
import { useItems } from "./ItemsContext";

function ItemsConfirmationTable() {
    const { items, deleteItems } = useItems();
    console.log("Current items in context:", items);

    return (
        <div>
            <DataTable columns={columns} data={items} onDeleteRows={deleteItems} />
        </div>
    );
}

export default ItemsConfirmationTable;
