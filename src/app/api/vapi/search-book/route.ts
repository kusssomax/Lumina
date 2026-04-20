import { NextResponse } from "next/server";
import { searchBookSegments } from "@/lib/actions/createBook";

// Vapi sends the shared secret in the "x-vapi-secret" header
export async function POST(request: Request): Promise<NextResponse> {
    const secret = request.headers.get("x-vapi-secret");
    if (!secret || secret !== process.env.VAPI_SECRET) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const toolCall = body?.message?.toolCalls?.[0];

        if (!toolCall || toolCall.function?.name !== "search_book") {
            return NextResponse.json({ error: "Invalid tool call" }, { status: 400 });
        }

        const { bookId, query } = toolCall.function.arguments ?? {};

        if (!bookId || !query) {
            return NextResponse.json({ error: "Missing bookId or query" }, { status: 400 });
        }

        const { success, data } = await searchBookSegments(bookId, query, 3);

        const segments = success && Array.isArray(data) ? data : [];
        const result = segments.length
            ? segments.map((s) => (s as { content: string }).content).join("\n\n")
            : "No information found about this topic.";

        return NextResponse.json({
            results: [{ toolCallId: toolCall.id, result }],
        });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Internal server error";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
