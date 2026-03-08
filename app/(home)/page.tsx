import Link from "next/link";
import ItemsClient from "./ItemsClient";

function HomePage() {
    return (
        <div>
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                Inventory Assistant
            </h1>
            <h2>Pages</h2>
            <Link href="/add">Add New Inventory</Link>

            <div className="flex h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <ItemsClient />
                </main>
            </div>
        </div>
    );
}

export default HomePage;
