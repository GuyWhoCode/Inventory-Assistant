"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { ItemEntry } from "@/types";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useItems } from "./ItemsContext";


interface EditableCellProps {
    value: string | undefined;
    row: Row<ItemEntry>;
    columnId: string;
    type?: string;
    className?: string;
}

function EditableCell({
    value: initialValue,
    row,
    columnId,
    type = "text",
    className,
}: EditableCellProps) {
    const { items, setItems } = useItems();
    const value = items[row.index]?.[columnId as keyof ItemEntry] ?? "";

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setItems((prev) =>
            prev.map((item, i) =>
                i === row.index
                    ? { ...item, [columnId]: e.target.value }
                    : item,
            ),
        );
    };

    return (
        <Input
            type={type}
            value={value}
            onChange={onChange}
            className={`h-8 w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-1 ${className ?? ""}`}
        />
    );
}

export const columns: ColumnDef<ItemEntry>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
                aria-label="Select all rows"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
        size: 40,
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ getValue, row, column }) => (
            <EditableCell
                value={getValue<string>()}
                row={row}
                columnId={column.id}
                className="font-medium"
            />
        ),
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ getValue, row, column }) => (
            <EditableCell
                value={String(getValue<number>())}
                row={row}
                columnId={column.id}
                type="number"
            />
        ),
    },
    {
        accessorKey: "expiration",
        header: "Expiration",
        cell: ({ getValue, row, column }) => (
            <EditableCell
                value={getValue<string>()}
                row={row}
                columnId={column.id}
                type="date"
            />
        ),
    },
];
