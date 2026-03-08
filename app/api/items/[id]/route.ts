import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params

    const { rowCount } = await db.query("DELETE FROM ITEMS WHERE id = $1", [id])

    if (rowCount === 0) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return new NextResponse(null, { status: 204 })
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const { name, quantity } = await request.json()

    const { rowCount } = await db.query(
        "UPDATE ITEMS SET name = $1, quantity = $2 WHERE id = $3",
        [name, quantity, id]
    )

    if (rowCount === 0) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ id, name, quantity }, { status: 200 })
}


export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const result = await db.query("SELECT * FROM ITEMS WHERE id = $1", [id])

    if (result.rows.length === 0) {
        return NextResponse.json({ error: "Item not found" }, { status: 404 })
    }

    return NextResponse.json({ item: result.rows[0] }, { status: 200 })
}