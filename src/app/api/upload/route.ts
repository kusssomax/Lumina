import { handleUpload, HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { MAX_FILE_SIZE } from "@/lib/constants";

export async function POST(request: Request): Promise<NextResponse> {
    const body = await (request.json()) as HandleUploadBody;

    try {
        const jsonResponse = await handleUpload({ 
            token: process.env.BLOB_READ_WRITE_TOKEN,
            body,
            request,
            onBeforeGenerateToken: async () => {
            const userId = await auth();

            if (!userId) {
                throw new Error("Unauthorized");
            }

            return {
                allowedContentTypes: ["application/pdf", "image/png", "image/jpeg", "image/jpg", "image/webp"],         
                addRandomSuffix: true,
                maximumSizeInBytes: MAX_FILE_SIZE,
                tokenPayload: JSON.stringify({ userId }),
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