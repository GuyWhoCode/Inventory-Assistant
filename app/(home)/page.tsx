import ItemsClient from "./ItemsClient";
import NotificationPanel from "./NotificationPanel";

function HomePage() {
    return (
        <div>
            <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
                Inventory Assistant
            </h1>

            <div className="flex h-screen overflow-hidden">
                <main className="flex-1 overflow-y-auto">
                    <ItemsClient />
                </main>

                <NotificationPanel />
            </div>
        </div>
    );
}

export default HomePage;
