import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

const steps = [
  {
    n: 1,
    title: "Upload PDF",
    caption: "Add your book file",
  },
  {
    n: 2,
    title: "AI processing",
    caption: "We analyze the content",
  },
  {
    n: 3,
    title: "Voice chat",
    caption: "Discuss with AI",
  },
] as const;

export default function LibraryHero() {
  return (
    <section className="w-full bg-background">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <Card className="rounded-2xl border-border/60 bg-card text-card-foreground shadow-sm p-6 md:p-8 gap-0">
          <div className="grid gap-8 lg:grid-cols-3 lg:gap-6 lg:items-stretch">
            <div className="flex flex-col justify-center gap-4 min-w-0">
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-semibold tracking-tight text-secondary-foreground">
                Your Library
              </h2>
              <p className="font-sans text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
                Convert your books into interactive AI conversations. Listen,
                learn, and discuss your favorite reads.
              </p>
              <div>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="text-card-foreground font-serif font-semibold"
                >
                  <Link href="/books/new" className="gap-2">
                    <Plus className="size-4 shrink-0" aria-hidden />
                    Add new book
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-center min-h-[200px] lg:min-h-0">
              <div
                className="relative flex w-full max-w-md mx-auto aspect-4/3 items-center justify-center rounded-lg"
                aria-hidden
              >
                <Image
                  src="/assets/bookImage.png"
                  alt="Book Image"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 28rem"
                />
              </div>
            </div>

            <div className="flex items-stretch">
              <Card className="w-full gap-0 rounded-lg py-0 shadow-sm flex flex-col justify-center">
                <CardContent className="px-5 py-5 md:px-6 md:py-6">
                  <ul className="flex flex-col gap-5">
                    {steps.map((step) => (
                      <li key={step.n} className="flex gap-3">
                        <span
                          className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border text-sm font-medium text-muted-foreground"
                          aria-hidden
                        >
                          {step.n}
                        </span>
                        <div className="min-w-0 pt-0.5">
                          <p className="font-sans font-semibold text-card-foreground text-sm sm:text-base">
                            {step.title}
                          </p>
                          <p className="font-sans text-sm text-muted-foreground mt-0.5">
                            {step.caption}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
