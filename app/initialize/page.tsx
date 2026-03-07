import Link from "next/link";
import InventoryItemCard from "../(home)/InventoryItemCard";

function InitializeInfo() {
    return (
        <div>
            <h1>Initialize Inventory</h1>
            <InventoryItemCard
                defaultValues={{ name: "", quantity: 0, expiration: "" }}
            />
            <br />
            <Link href="/">Go back to Dashboard</Link>
        </div>
    );
}

export default InitializeInfo;
