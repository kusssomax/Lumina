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

interface BookCardProps {
  title: string;
  author: string;
  slug: string;
  coverURL: string;
}

const BookCard = ({ title, author, slug, coverURL }: BookCardProps) => {
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
        <CardFooter className="flex flex-col gap-2 h-full justify-start items-start">
          <h3 className="text-lg font-semibold text-left">{title}</h3>
          <p className="text-sm text-muted-foreground text-left">{author}</p>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default BookCard;
