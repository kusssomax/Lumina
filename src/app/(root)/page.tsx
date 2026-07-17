import LibraryHero from "@/components/LibraryHero";
import BookCard from "@/components/BookCard/BookCard";
import { getListOfBooks } from "@/lib/actions/books.actions";
import { TriangleAlertIcon, BookOpenIcon, Plus } from "lucide-react";

import Link from "next/link";
import AddBookButton from "@/components/AddBookButton";

const Page = async () => {
  const result = await getListOfBooks();

  const isUnauthorized = !result.success && result.message === "Unauthorized";
  const booksList = result.success ? result.data ?? [] : [];

  return (
    <>
      <LibraryHero />

      <div style={{ padding: "0 64px 80px", maxWidth: "1400px", margin: "0 auto" }}>
        {isUnauthorized ? (
          <div
            className="flex items-start gap-3 rounded-xl px-5 py-4"
            style={{
              border: "1px solid rgba(224,92,92,0.2)",
              background: "rgba(224,92,92,0.05)",
            }}
          >
            <TriangleAlertIcon className="mt-0.5 shrink-0 text-destructive" size={16} />
            <div>
              <p className="font-medium text-foreground text-sm">Sign in to your account</p>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-2)" }}>
                Please sign in or sign up to view your library and manage your books.
              </p>
            </div>
          </div>
        ) : booksList.length === 0 ? (
          <div
            className="flex flex-col items-center text-center"
            style={{ padding: "80px 40px" }}
          >
            <BookOpenIcon
              size={48}
              style={{ color: "var(--text-3)", opacity: 0.5, marginBottom: "20px" }}
            />
            <h2
              className="font-serif font-normal text-foreground mb-[10px]"
              style={{ fontSize: "30px" }}
            >
              Your library is empty
            </h2>
            <p className="mb-[28px]" style={{ fontSize: "14px", color: "var(--text-2)", lineHeight: 1.55 }}>
              You haven&apos;t added any books yet. Upload your first one to get started.
            </p>
            <Link
              href="/books/new"
              className="inline-flex items-center gap-2 font-medium transition-opacity hover:opacity-85"
              style={{
                background: "var(--primary)",
                color: "var(--primary-foreground)",
                fontSize: "14px",
                padding: "10px 24px",
                borderRadius: "10px",
              }}
            >
              <Plus size={14} />
              Add your first book
            </Link>
          </div>
        ) : (
          <>
            {/* Section header */}
            <div className="flex items-center justify-between mb-[28px]">
              <h2
                className="font-serif font-normal text-foreground"
                style={{ fontSize: "22px", letterSpacing: "0.02em" }}
              >
                Your Books
              </h2>
              <AddBookButton />
            </div>

            {/* Book grid */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(148px, 1fr))",
                gap: "22px",
              }}
            >
              {booksList.map((book) => (
                <BookCard
                  key={book._id}
                  title={book.title}
                  author={book.author}
                  slug={book.slug}
                  bookId={book._id}
                  coverURL={book.coverURL}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Page;
