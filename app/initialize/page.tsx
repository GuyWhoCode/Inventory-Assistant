import Link from "next/link";
import InventoryItemCard from "../(home)/InventoryItemCard";
import ItemScanner from "./ItemScanner";

function InitializeInfo() {
    return (
        <div>
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">Initialize Inventory</h1>
            
            <ItemScanner />
            <InventoryItemCard
                defaultValues={{ name: "", quantity: 0, expiration: "" }}
            />
            <br />
            
            <Link href="/">Go back to Dashboard</Link>
        </div>
    );
}

export default InitializeInfo;
