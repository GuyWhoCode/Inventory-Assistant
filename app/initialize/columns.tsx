"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Item } from "@/types";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { useEffect, useState } from "react";

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        updateData: (rowIndex: number, columnId: string, value: string) => void;
    }
}

interface EditableCellProps {
    value: string | undefined;
    row: Row<Item>;
    columnId: string;
    table: Table<Item>;
    type?: string;
    className?: string;
}

function EditableCell({
    value: initialValue,
    row,
    columnId,
    table,
    type = "text",
    className,
}: EditableCellProps) {
    const [value, setValue] = useState(initialValue ?? "");

    useEffect(() => {
        setValue(initialValue ?? "");
    }, [initialValue]);

    const onBlur = () => {
        table.options.meta?.updateData(row.index, columnId, value);
    };

    return (
        <Input
            type={type}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
            className={`h-8 w-full border-0 bg-transparent p-0 shadow-none focus-visible:ring-1 ${className ?? ""}`}
        />
    );
}

export const columns: ColumnDef<Item>[] = [
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
        cell: ({ getValue, row, column, table }) => (
            <EditableCell
                value={getValue<string>()}
                row={row}
                columnId={column.id}
                table={table}
                className="font-medium"
            />
        ),
    },
    {
        accessorKey: "quantity",
        header: "Quantity",
        cell: ({ getValue, row, column, table }) => (
            <EditableCell
                value={String(getValue<number>())}
                row={row}
                columnId={column.id}
                table={table}
                type="number"
            />
        ),
    },
    {
        accessorKey: "expiration",
        header: "Expiration",
        cell: ({ getValue, row, column, table }) => (
            <EditableCell
                value={getValue<string>()}
                row={row}
                columnId={column.id}
                table={table}
                type="date"
            />
        ),
    },
];
