"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ItemScanner from "./ItemScanner";
import InventoryItemCard from "./InventoryItemCard";

export default function EntryTabs() {
    return (
        <Tabs defaultValue="automatic" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="automatic">Automatic</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
            </TabsList>
            <TabsContent value="automatic" className="flex justify-center">
                <ItemScanner />
            </TabsContent>
            <TabsContent value="manual" className="flex justify-center">
                <InventoryItemCard />
            </TabsContent>
        </Tabs>
    );
}
