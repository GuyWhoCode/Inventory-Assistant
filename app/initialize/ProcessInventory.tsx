import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function ProcessInventory() {
    return (
        <div>
            <Button
                onClick={() => {
                    fetch("/api/items/clear", { method: "POST" })
                        .then(() => {
                            toast.success("Inventory cleared");
                        })
                        .catch(() => {
                            toast.error("Failed to clear inventory");
                        });
                }}
            >
                Clear Inventory
            </Button>
        </div>
    );
}

export default ProcessInventory;
