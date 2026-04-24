import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mic, MicOff } from "lucide-react";
import { getBookBySlug } from "@/lib/actions/books.actions";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import VapiControls from "@/components/VapiControls/VapiControls";

interface Props {
  params: Promise<{ slug: string }>;
}

const Page = async ({ params }: Props) => {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const { slug } = await params;
  const { success, data: book } = await getBookBySlug(slug);
  if (!success || !book) redirect("/");

  return (
    <section className="relative mx-auto max-w-4xl px-5 py-8 flex flex-col gap-6">
      {/* Floating back button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed top-24 left-6 z-50 rounded-full shadow-md"
        asChild
      >
        <Link href="/"><ArrowLeft className="size-4" /></Link>
      </Button>

      {/* Transcript area */}
      <VapiControls book={book} />
    </section>
  );
};

export default Page;
