import LibraryHero from "@/components/LibraryHero";
import BookCard from "@/components/BookCard/BookCard";
import { getListOfBooks } from "@/lib/actions/books.actions";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { TriangleAlertIcon, BookOpenIcon } from "lucide-react";
import Link from "next/link";

const Page = async () => {
  const result = await getListOfBooks();

  const isUnauthorized = !result.success && result.message === "Unauthorized";
  const booksList = result.success ? result.data ?? [] : [];

  return (
    <>
      <LibraryHero />

      {isUnauthorized ? (
        <div className="mx-auto max-w-xl px-5 py-8">
          <Alert variant="destructive">
            <TriangleAlertIcon />
            <AlertTitle>Sign in to your account</AlertTitle>
            <AlertDescription>
              Please sign in or sign up to view your library and manage your books.
            </AlertDescription>
          </Alert>
        </div>
      ) : booksList.length === 0 ? (
        <div className="mx-auto px-5 py-8 flex min-h-64">
          <Empty>
            <EmptyHeader>
              <EmptyMedia>
                <BookOpenIcon className="size-10 text-muted-foreground" />
              </EmptyMedia>
              <EmptyTitle>Your library is empty</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t added any books yet.{" "}
                <Link href="/books/new" className="underline underline-offset-4 hover:text-primary">
                  Upload your first one
                </Link>
                .
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </div>
      ) : (
        <div className="mx-auto px-5 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
      )}
    </>
  );
};

export default Page;
