'use client';
import Link from "next/link";
import Image from "next/image";
import { deleteBook } from "@/lib/actions/books.actions";
import { Trash2 } from "lucide-react";
import { useTransition, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface BookCardProps {
  title: string;
  author: string;
  slug: string;
  coverURL: string;
  bookId: string;
}

const BookCard = ({ title, author, slug, coverURL, bookId }: BookCardProps) => {
  const [isPending, startTransition] = useTransition();
  const [hovered, setHovered] = useState(false);

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      await deleteBook(bookId);
    });
  };

  return (
    <Link
      href={`/books/${slug}`}
      className="block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          background: "var(--surface-1)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
          transform: hovered ? "translateY(-6px)" : "translateY(0)",
          boxShadow: hovered
            ? "0 20px 60px rgba(0,0,0,0.55)"
            : "none",
        }}
      >
        {/* Cover */}
        <div className="relative" style={{ aspectRatio: "2/3" }}>
          <Image
            src={coverURL}
            alt={title}
            fill
            sizes="(max-width: 640px) 50vw, 200px"
            className="object-cover"
          />
          {/* Delete button */}
          <button
            onClick={handleDelete}
            disabled={isPending}
            title="Delete book"
            className="absolute top-2 right-2 flex items-center justify-center transition-all duration-200"
            style={{
              width: "28px",
              height: "28px",
              borderRadius: "6px",
              background: "rgba(224,92,92,0.18)",
              border: "1px solid rgba(224,92,92,0.3)",
              color: "var(--destructive)",
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? "auto" : "none",
            }}
          >
            {isPending ? <Spinner className="size-3" /> : <Trash2 size={13} />}
          </button>
        </div>

        {/* Info */}
        <div style={{ padding: "11px 12px 13px" }}>
          <p
            className="font-medium truncate"
            style={{ fontSize: "13px", color: "var(--text-1)", marginBottom: "3px" }}
          >
            {title}
          </p>
          <p
            className="truncate"
            style={{ fontSize: "11px", color: "var(--text-3)" }}
          >
            {author}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default BookCard;
