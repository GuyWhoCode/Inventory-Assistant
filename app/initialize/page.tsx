import Link from "next/link";
import EntryTabs from "./EntryTabs";
import ItemsConfirmationTable from "./ItemsConfirmationTable";
import { ItemsProvider } from "./ItemsContext";


function InitializeInfo() {
    return (
        <ItemsProvider>
            <div>
                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                    Initialize Inventory
                </h1>
                <EntryTabs />
                <ItemsConfirmationTable />
                
                <Link href="/">Go back to Dashboard</Link>
            </div>
        </ItemsProvider>
    );
}

export default InitializeInfo;
