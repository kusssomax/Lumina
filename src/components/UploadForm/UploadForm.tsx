"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { ImageUp, Upload } from "lucide-react"
import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

import { FileDropzoneField } from "./FileDropzoneField"
import { LoadingOverlay } from "./LoadingOverlay"
import { MAX_PDF_MB } from "./upload-form.constants"
import {
  bookUploadSchema,
  type BookUploadValues,
} from "./upload-form.schema"
import { VoiceField } from "./VoiceField"

export type { BookUploadValues }

type UploadFormProps = {
  onSubmit?: (values: BookUploadValues) => void | Promise<void>
  className?: string
}

const UploadForm = ({ onSubmit: onSubmitProp, className }: UploadFormProps) => {
  const form = useForm({
    resolver: zodResolver(bookUploadSchema),
    defaultValues: {
      title: "",
      author: "",
      voice: "dave",
    },
  })

  async function onSubmit(values: BookUploadValues) {
    if (onSubmitProp) {
      await onSubmitProp(values)
      return
    }
    await new Promise((r) => setTimeout(r, 1200))
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
                  <Input
                    placeholder="ex: Rich Dad Poor Dad"
                    {...field}
                  />
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
                  <Input
                    placeholder="ex: Robert Kiyosaki"
                    {...field}
                  />
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
  )
}

export default UploadForm
