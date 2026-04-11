"use server";
import { CreateBook, TextSegment } from "../../../types";
import { connectToMongoDB } from "@/database/mongoose";
import { generateSlug, serializeData } from "../utils";
import Book from "@/database/models/book.model";
import BookSegment from "@/database/models/book-segment.model";

export const isBookExists = async (title: string) => {
  try {
    await connectToMongoDB();
    const slug = generateSlug(title);

    const existingBook = await Book.findOne({ slug }).lean();

    if (existingBook) {
      return {
        exists: true,
        book: serializeData(existingBook),
      };
    }
    return {
      exists: false,
      book: null,
    };

  } catch (error) {
    console.error("Failed to check if book exists", error);
    throw error;
  }
};

export const createBook = async (book: CreateBook) => {
  try {
    await connectToMongoDB();

    const slug = generateSlug(book.title);

    const existingBook = await Book.findOne({ slug }).lean();
    if (existingBook) {
      return {
        success: true,
        data: serializeData(existingBook),
        alreadyExists: true,
      };
    }

    const newBook = await Book.create({ ...book, slug, totalSegments: 0 });

    return {
      success: true,
      data: serializeData(newBook),
    };
  } catch (error) {
    // Handle duplicate key race condition: another request created the same slug
    // between our findOne check and Book.create
    if ((error as { code?: number }).code === 11000) {
      const existing = await Book.findOne({ slug: generateSlug(book.title) }).lean();
      if (existing) {
        return {
          success: true,
          data: serializeData(existing),
          alreadyExists: true,
        };
      }
    }

    console.error("Failed to create book", error);
    return {
      success: false,
      message: "Failed to create book",
      error: error as Error,
    };
  }
};

export const saveBookSegments = async (
  bookId: string,
  clerkId: string,
  segments: TextSegment[],
  totalSegments?: number,
) => {
  try {
    await connectToMongoDB();

    const segmentsToInsert = segments.map(
      ({ text, segmentIndex, pageNumber, wordCount }) => ({
        clerkId,
        bookId,
        content: text,
        segmentIndex,
        pageNumber,
        wordCount,
      }),
    );

    await BookSegment.insertMany(segmentsToInsert);

    if (totalSegments !== undefined) {
      await Book.findByIdAndUpdate(bookId, { totalSegments });
    }

    return {
      success: true,
      data: {
        segmentsCreated: segments.length,
      },
    };
  } catch (error) {
    console.error("Failed to save book segments", error);

    await BookSegment.deleteMany({ bookId, clerkId });
    await Book.findByIdAndDelete(bookId);

    return {
      success: false,
      message: "Failed to save book segments",
      error: error as Error,
    };
  }
};

export const getListOfBooks = async () => {

  try {
    await connectToMongoDB();
    const books = await Book.find().sort({ createdAt: -1 }).lean();

    return {
      success: true,
      data: serializeData(books),
    }

  } catch (error) {
    console.error("Failed to get list of books", error);

    return {
      success: false,
      message: "Failed to get list of books",
      error: error as Error,
    }
  }
}