import LibraryHero from "@/components/LibraryHero";
import { sampleBooks } from "@/lib/constants";
import BookCard from "@/components/BookCard/BookCard";
import { getListOfBooks } from "@/lib/actions/createBook";

const Page = async () => {

  const { success, data } = await getListOfBooks();

  const booksList = success ? data ?? []: [];

  return (
    <>
      <LibraryHero />
      <div className="mx-auto px-5 py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {booksList.map((book) => (
          <BookCard
            key={book._id}
            title={book.title}
            author={book.author}
            slug={book.slug}
            coverURL={book.coverURL}
          />
        ))}
      </div>
    </>
  );
};

export default Page;
