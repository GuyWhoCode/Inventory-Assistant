import OpenAI from "openai";

type Item = {
    name: string;
    quantity: number;
};

type ResponsePayload = {
    items: Item[];
    total_count: number;
    uncertain: boolean;
};

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function countItemsInImage(
    dataUrl: string,
): Promise<ResponsePayload | null> {

    try {
        const resp = await openai.responses.create({
            model: "gpt-5-mini",
            input: [
                {
                    role: "user",
                    content: [
                        {
                            type: "input_text",
                            text:
                                "You will be given an image. Identify distinct object types you are certain about and " +
                                "produce a JSON object matching the required schema. IMPORTANT: " +
                                "If any individual object in the image is ambiguous or you are NOT confident it is a distinct object, DO NOT include it in the items list. " +
                                "Group identical visible objects together into a single item entry with a positive integer 'quantity'. " +
                                "Return ONLY the JSON that matches the schema; do not add extra explanation or text.",
                        },
                        {
                            type: "input_image",
                            image_url: dataUrl,
                            detail: "auto",
                        },
                    ],
                },
            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "count_items_schema",
                    strict: true,
                    schema: {
                        type: "object",
                        properties: {
                            items: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        name: { type: "string" },
                                        quantity: {
                                            type: "integer",
                                            minimum: 1,
                                        },
                                    },
                                    required: ["name", "quantity"],
                                    additionalProperties: false,
                                },
                            },
                            total_count: { type: "integer", minimum: 0 },
                            uncertain: { type: "boolean" },
                        },
                        required: ["items", "total_count", "uncertain"],
                        additionalProperties: false,
                    },
                },
            },
        });

        // output_text is the convenience accessor on the Responses API
        const raw = (resp as any).output_text;

        if (!raw || typeof raw !== "string") {
            console.error(
                "Could not locate output_text in response:",
                JSON.stringify(resp, null, 2),
            );
            return null;
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed.items)) {
            throw new Error("Invalid response: 'items' must be an array.");
        }

        const items: Item[] = parsed.items.map((it: any) => ({
            name: String(it.name),
            quantity: Number(it.quantity),
        }));

        const totalFromItems = items.reduce(
            (s, it) => s + (Number.isFinite(it.quantity) ? it.quantity : 0),
            0,
        );

        return {
            items,
            total_count: totalFromItems,
            uncertain: Boolean(parsed.uncertain),
        };
    } catch (err) {
        console.error("Error from OpenAI request:", err);
        return null;
    }
}
