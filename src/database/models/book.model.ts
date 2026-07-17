import { IBook } from "@/types";
import { models, Schema, model } from "mongoose";
import BookSegment from "./book-segment.model";
import VoiceSession from "./voice-session.model";

const BookSchema = new Schema<IBook>({
    clerkId: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true, },
    author: { type: String, required: true },
    persona: { type: String },
    fileURL: { type: String, required: true },
    fileBlobKey: { type: String, required: true },
    coverURL: { type: String },
    coverBlobKey: { type: String },
    fileSize: { type: Number, required: true },
    totalSegments: { type: Number, default: 0 },
}, { timestamps: true });

// Cascade delete: remove all related documents when a book is deleted
BookSchema.pre("findOneAndDelete", async function () {
    const book = await this.model.findOne(this.getFilter(), { _id: 1 }).lean() as { _id: unknown } | null;
    if (!book) return;
    await Promise.all([
        BookSegment.deleteMany({ bookId: book._id }),
        VoiceSession.deleteMany({ bookId: book._id }),
    ]);
});

const Book = models.Book || model<IBook>("Book", BookSchema);

export default Book;