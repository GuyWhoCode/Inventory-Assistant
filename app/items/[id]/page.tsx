
import ItemDetail from "./ItemDetail";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function ItemsPage({ params }: Props) {
    const { id } = await params;
    return <ItemDetail id={id} />;
}