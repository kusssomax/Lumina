"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUp, Upload } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import { FileDropzoneField } from "./FileDropzoneField";
import { LoadingOverlay } from "./LoadingOverlay";
import { MAX_PDF_MB } from "./upload-form.constants";
import { bookUploadSchema, type BookUploadValues } from "./upload-form.schema";
import { VoiceField } from "./VoiceField";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { isBookExists, createBook, saveBookSegments } from "@/lib/actions/createBook";
import { useRouter } from "next/navigation";
export type { BookUploadValues };
import { parsePDFFile } from "@/lib/utils";
import { upload } from "@vercel/blob/client";

type UploadFormProps = {
  onSubmit?: (values: BookUploadValues) => void | Promise<void>;
  className?: string;
};

const UploadForm = ({ onSubmit: onSubmitProp, className }: UploadFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { userId } = useAuth();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(bookUploadSchema),
    defaultValues: {
      title: "",
      author: "",
      persona: "dave",
      pdfFile: undefined,
      coverImage: undefined,
    },
  });

  async function onSubmit(values: BookUploadValues) {
    if (!userId) {
      return toast.error("Please sign in / sign up to upload a book", {
        position: "top-right",
      });
    }

    // if (onSubmitProp) {
    //   await onSubmitProp(values)
    //   return
    // }

    try {
      setIsSubmitting(true);
      const isBookExistsResponse = await isBookExists(values.title);

      if (isBookExistsResponse.exists && isBookExistsResponse.book) {
        toast.error("Book already exists", { position: "top-right" });
        form.reset();
        router.push(`/books/${isBookExistsResponse.book.slug}`);
        return;
      }

      const fileTitle = values.title.replace(/\s+/g, " ").trim().toLowerCase();
      const pdfFile = values.pdfFile;
      const parsePdf = await parsePDFFile(pdfFile);

      if (parsePdf.content.length === 0) {
        toast.error(
          "Failed to parse PDF file, please try again with a different file",
          { position: "top-right" },
        );
        return;
      }

      const uploadedPdfBlob = await upload(fileTitle, pdfFile, {
        access: "public",
        handleUploadUrl: "/api/upload",
        contentType: "application/pdf",
      });

      let coverUrl: string;

      if (values.coverImage) {
        const coverFile = values.coverImage;
        const uploadedCoverBlob = await upload(`${fileTitle}-cover.png`, coverFile, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: coverFile.type,
        });

        coverUrl = uploadedCoverBlob.url;

      } else {
        const response = await fetch(parsePdf.cover);
        const blob = await response.blob();
        const uploadedCoverBlob = await upload(`${fileTitle}_cover.png`, blob, {
          access: "public",
          handleUploadUrl: "/api/upload",
          contentType: "image/png",
        });

        coverUrl = uploadedCoverBlob.url;
      }

      const book = await createBook({
        clerkId: userId,
        title: values.title,
        author: values.author,
        persona: values.persona,
        fileURL: uploadedPdfBlob.url,
        fileBlobKey: uploadedPdfBlob.pathname,
        coverURL: coverUrl,
        fileSize: pdfFile.size,
      });

      if (!book.success) throw new Error(book.message);

      if (book.alreadyExists) {
        toast.error("Book with the same title already exists", { position: "top-right" });
        form.reset();
        router.push(`/books/${book.data?.slug}`);
        return;
      }

      const segments = await saveBookSegments(book.data._id, userId, parsePdf.content);

      if (!segments.success) {
        toast.error("Failed to save book segments", { position: "top-right" });
        throw new Error(segments.message);
      }

      form.reset();
      router.push(`/books/${book.data.slug}`);

    } catch (error) {
      console.error("Failed to upload book", error);
      toast.error("Failed to upload book", { position: "top-right" });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <LoadingOverlay visible={form.formState.isSubmitting} />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("mx-auto w-full max-w-lg space-y-8", className)}
        >
          <FileDropzoneField
            control={form.control}
            name="pdfFile"
            accept="application/pdf,.pdf"
            srDescription={`Upload a PDF file, maximum ${MAX_PDF_MB} megabytes`}
            icon={Upload}
            removeAriaLabel="Remove PDF"
            emptyTitle="Click to upload PDF"
            emptyDescription={`PDF file (max ${MAX_PDF_MB}MB)`}
          />

          <FileDropzoneField
            control={form.control}
            name="coverImage"
            accept="image/*"
            srDescription="Optional cover image, or leave empty to auto-generate from the PDF"
            icon={ImageUp}
            removeAriaLabel="Remove cover image"
            emptyTitle="Click to upload cover image"
            emptyDescription="Leave empty to auto-generate from PDF"
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormDescription className="sr-only">
                  Book title, required
                </FormDescription>
                <FormControl>
                  <Input placeholder="ex: Rich Dad Poor Dad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Author Name</FormLabel>
                <FormDescription className="sr-only">
                  Author name, required
                </FormDescription>
                <FormControl>
                  <Input placeholder="ex: Robert Kiyosaki" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <VoiceField control={form.control} />

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="h-12 w-full font-serif text-base"
          >
            Begin Synthesis
          </Button>
        </form>
      </Form>
    </>
  );
};

export default UploadForm;
