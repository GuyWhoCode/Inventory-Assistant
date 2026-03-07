import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

function DeleteItemForm() {
    const [deleteId, setDeleteId] = useState<string>("");

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();

                fetch("/api/items", {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: deleteId }),
                })
                    .then(() => toast.success("Item deleted"))
                    .catch((err) => {
                        console.error("Error deleting item:", err);
                        toast.error("Failed to delete item. Please try again.");
                    });
            }}
        >
            <Field>
                <Label htmlFor="delete-id">Item ID to delete</Label>
                <InputGroup>
                    <Input
                        id="delete-id"
                        type="number"
                        min={1}
                        step={1}
                        value={deleteId}
                        onChange={(e) => setDeleteId(e.target.value)}
                    />
                </InputGroup>
            </Field>
            <Button type="submit" variant="destructive">
                Delete Item
            </Button>
        </form>
    );
}

export default DeleteItemForm