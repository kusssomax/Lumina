import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { MAX_FILE_SIZE, MAX_IMAGE_SIZE, ACCEPTED_IMAGE_TYPES } from "@/lib/constants";

const COVER_IMAGE_CONTENT_TYPES = ACCEPTED_IMAGE_TYPES;
const GENERAL_CONTENT_TYPES = ["application/pdf", ...ACCEPTED_IMAGE_TYPES];

export async function POST(request: Request): Promise<NextResponse> {
    const body = await (request.json()) as HandleUploadBody;

    const { searchParams } = new URL(request.url);
    const kind = searchParams.get("kind");

    try {
        const jsonResponse = await handleUpload({
            token: process.env.BLOB_READ_WRITE_TOKEN,
            body,
            request,
            onBeforeGenerateToken: async () => {
            const { userId } = await auth();

            if (!userId) {
                throw new Error("Unauthorized");
            }

            const isCoverImage = kind === "cover-image";
            const maximumSizeInBytes = isCoverImage ? MAX_IMAGE_SIZE : MAX_FILE_SIZE;
            const allowedContentTypes = isCoverImage ? COVER_IMAGE_CONTENT_TYPES : GENERAL_CONTENT_TYPES;

            return {
                allowedContentTypes,
                addRandomSuffix: true,
                maximumSizeInBytes,
                tokenPayload: JSON.stringify({ userId, kind }),
            };
        },
        onUploadCompleted: async ({ blob, tokenPayload }) => {
            console.log("Upload completed:", blob.url);

            const payload = tokenPayload ? JSON.parse(tokenPayload) : null;
            const userId = payload?.userId;
        }

     });

     return NextResponse.json(jsonResponse);

    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to upload file";
        const status = message.includes("Unauthorized") ? 401 : 500;
        return NextResponse.json({ error: message }, { status });
    }
}

export async function DELETE(request: Request): Promise<NextResponse> {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { urls } = await request.json() as { urls: string[] };
        if (!Array.isArray(urls) || urls.length === 0) {
            return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
        }
        await del(urls);
        return NextResponse.json({ success: true });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Failed to delete blobs";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}