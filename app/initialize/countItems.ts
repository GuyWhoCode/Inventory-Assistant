// count-items.ts
import OpenAI from "openai";
import fs from "fs";
import path from "path";

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

function imageToDataUrl(imagePath: string): string {
    const ext = path.extname(imagePath).replace(".", "").toLowerCase() || "jpg";
    const b64 = fs.readFileSync(imagePath, { encoding: "base64" });
    return `data:image/${ext};base64,${b64}`;
}

/**
 * JSON Schema we will enforce via structured outputs.
 * Each item must exactly match { "name": string, "quantity": integer >= 1 }.
 * The top-level object includes items array, total_count, and uncertain flag.
 */
const jsonSchema = {
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
                        quantity: { type: "integer", minimum: 1 },
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
};

async function countItemsInImage(
    imagePath: string,
): Promise<ResponsePayload | null> {
    const dataUrl = imageToDataUrl(imagePath);

    // Prompt: be explicit about excluding ambiguous objects
    const userPrompt = [
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
        },
    ];

    try {
        const resp = await openai.responses.create({
            model: "gpt-4.1", // choose an available multimodal model in your account
            temperature: 0,
            input: [
                {
                    role: "user",
                    content: userPrompt,
                },
            ],
            text: {
                format: {
                    type: "json_schema",
                    json_schema: jsonSchema,
                },
            },
        });

        // The Responses API returns structured content in resp.output; the exact shape may vary.
        // We'll try to find JSON result in the response object's output array.
        // NOTE: adapt this if your SDK returns the JSON in a different field.
        let parsed: any = null;

        // Attempt to locate the structured JSON in common locations
        if (Array.isArray((resp as any).output)) {
            for (const o of (resp as any).output) {
                // Many Responses returns a content array with objects that have 'type' and 'json' or 'text'
                if (o?.content) {
                    for (const c of o.content) {
                        if (c?.type === "application/json" && c?.data) {
                            parsed = c.data;
                            break;
                        }
                        if (
                            c?.type === "output_text" &&
                            typeof c?.text === "string"
                        ) {
                            // try to parse text as JSON (fallback)
                            try {
                                const maybe = JSON.parse(c.text);
                                if (maybe && typeof maybe === "object") {
                                    parsed = maybe;
                                    break;
                                }
                            } catch {
                                // ignore
                            }
                        }
                        // sometimes the SDK exposes a json field directly:
                        if (c?.json) {
                            parsed = c.json;
                            break;
                        }
                    }
                }
                if (parsed) break;
            }
        }

        // Another fallback: resp.output_text (some SDKs expose this convenience)
        if (!parsed && typeof (resp as any).output_text === "string") {
            try {
                parsed = JSON.parse((resp as any).output_text);
            } catch {
                // ignore
            }
        }

        if (!parsed) {
            console.error(
                "Could not locate structured JSON in the model response. Full response:",
                JSON.stringify(resp, null, 2),
            );
            return null;
        }

        // Validate minimal shape locally
        if (!Array.isArray(parsed.items)) {
            throw new Error("Invalid response: 'items' must be an array.");
        }
        const items: Item[] = parsed.items.map((it: any) => {
            return {
                name: String(it.name),
                quantity: Number(it.quantity),
            } as Item;
        });

        const totalFromItems = items.reduce(
            (s, it) => s + (Number.isFinite(it.quantity) ? it.quantity : 0),
            0,
        );
        const total_count = Number(parsed.total_count ?? totalFromItems);
        const uncertain = Boolean(parsed.uncertain);

        // sanity check: make sure total_count equals sum(items). If not, prefer sum(items).
        const finalTotal =
            total_count === totalFromItems ? total_count : totalFromItems;

        return {
            items,
            total_count: finalTotal,
            uncertain,
        };
    } catch (err) {
        console.error("Error from OpenAI request:", err);
        return null;
    }
}

// Example usage
(async () => {
    const imagePath = "./image.jpg"; // <-- replace with your image path
    const result = await countItemsInImage(imagePath);
    if (!result) {
        console.error("Failed to get a valid response.");
        process.exitCode = 2;
        return;
    }

    console.log("Result (parsed):", JSON.stringify(result, null, 2));

    // Example: check reliability
    if (result.uncertain) {
        console.log(
            "Model declared the result uncertain. Consider retrying with clearer images or additional prompts.",
        );
    } else {
        console.log(`Detected total items: ${result.total_count}`);
        for (const it of result.items) {
            console.log(`- ${it.name}: ${it.quantity}`);
        }
    }
})();
