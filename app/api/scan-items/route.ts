import { NextRequest, NextResponse } from "next/server";
import { countItemsInImage } from "./countItems";

export async function POST(req: NextRequest) {
    const formData = await req.formData();
    const file = formData.get("image") as File;

    if (!file) {
        return NextResponse.json(
            { error: "No image provided" },
            { status: 400 },
        );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
    const dataUrl = `data:image/${ext};base64,${buffer.toString("base64")}`;

    const result = await countItemsInImage(dataUrl);

    if (!result) {
        return NextResponse.json({ error: "Scan failed" }, { status: 500 });
    }

    return NextResponse.json(result);
}
