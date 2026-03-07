import Link from "next/link";
import { db } from "@/lib/db";
import ItemCard from "./ItemCard";

type Props = {
    params: Promise<{ id: string }>;
};

async function ItemsPage({ params }: Props) {
    const { id } = await params;
    const { rows } = await db.query("SELECT * FROM ITEMS WHERE id = $1", [id]);

    const item = rows[0]

    if (!item) {
        return (
            <div>
                <p>Item with ID {id} was not found.</p>
                <Link href="/">Return Home</Link>
            </div>
        )
    }

    return (
        <div className="p-8">
            <ItemCard item={item} />
        </div>
    );
}

export default ItemsPage;
