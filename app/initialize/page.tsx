import Link from "next/link";
import EntryTabs from "./EntryTabs";
import ItemsConfirmationTable from "./ItemsConfirmationTable";
import { ItemsProvider } from "./ItemsContext";
import ProcessInventoryButton from "./ProcessInventoryButton";


function InitializeInfo() {
    return (
        <ItemsProvider>
            <div>
                <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                    Initialize Inventory
                </h1>
                <EntryTabs />
                <ItemsConfirmationTable />

                <ProcessInventoryButton />
                
                <br />
                <Link href="/">Go back to Dashboard</Link>
            </div>
        </ItemsProvider>
    );
}

export default InitializeInfo;
