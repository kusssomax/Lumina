'use client';
import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "../ui/card";
import Image from "next/image";
import { deleteBook } from "@/lib/actions/books.actions";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { useTransition } from "react";
import { is } from "zod/locales";
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

  const handleDelete = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    startTransition(async () => {
      await deleteBook(bookId);
    });
  };

  return (
    <Link href={`/books/${slug}`} className="flex cursor-pointer">
      <Card className="flex flex-1 hover:shadow-md transition-all duration-300">
        <CardContent className="flex items-center justify-center">
          <div className="relative h-[200px] w-[133px] max-w-none shrink-0 overflow-hidden rounded-md">
            <Image
              src={coverURL}
              alt={title}
              fill
              sizes="133px"
              className="object-cover"
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between h-full">
          <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold text-left">{title}</h3>
          <p className="text-sm text-muted-foreground text-left">{author}</p>
          </div>
          <div className="flex self-end">
            <Button variant="destructive" className="cursor-pointer" title="Delete book" onClick={handleDelete} disabled={isPending}>
              {
                isPending ? <Spinner /> : <Trash2 size={16} />
                }
            </Button>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BookCard;
