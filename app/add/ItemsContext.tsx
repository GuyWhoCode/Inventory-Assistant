"use client";
import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState,
} from "react";
import { ItemEntry } from "@/types";
import sampleData from "../../deliverables/sampleData.json";

const isSampleDataSet = process.env.NEXT_PUBLIC_SAMPLE_DATA_SET === "true";

type ItemsContextType = {
    items: ItemEntry[];
    setItems: Dispatch<SetStateAction<ItemEntry[]>>;
    addItem: (item: ItemEntry) => void;
    deleteItems: (toDelete: ItemEntry[]) => void;
};

const ItemsContext = createContext<ItemsContextType | null>(null);

export function ItemsProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<ItemEntry[]>(
        isSampleDataSet ? sampleData : [],
    );

    const addItem = (item: ItemEntry) => {
        setItems((prev) => [...prev, item]);
    };

    const deleteItems = (toDelete: ItemEntry[]) => {
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
