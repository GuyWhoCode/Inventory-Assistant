"use client";

import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { Item } from "@/types";

type ItemsContextType = {
    items: Item[];
    setItems: Dispatch<SetStateAction<Item[]>>;
    addItem: (item: Item) => void;
    deleteItems: (toDelete: Item[]) => void;
};

const ItemsContext = createContext<ItemsContextType | null>(null);

export function ItemsProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<Item[]>([]);

    const addItem = (item: Item) => {
        setItems((prev) => [...prev, item]);
    };

    const deleteItems = (toDelete: Item[]) => {
        setItems((prev) => prev.filter((item) => !toDelete.includes(item)));
    };

    return (
        <ItemsContext.Provider
            value={{ items, setItems, addItem, deleteItems }}
        >
            {children}
        </ItemsContext.Provider>
    );
}

export function useItems() {
    const ctx = useContext(ItemsContext);
    if (!ctx) throw new Error("useItems must be used within an ItemsProvider");
    return ctx;
}
