import * as z from "zod"

import {
  MAX_COVER_BYTES,
  MAX_PDF_BYTES,
  MAX_PDF_MB,
} from "./upload-form.constants"
import { ACCEPTED_IMAGE_TYPES } from "@/lib/constants"

const coverMb = MAX_COVER_BYTES / (1024 * 1024)

function isPdfFile(file: File): boolean {
  return file.type === "application/pdf" || /\.pdf$/i.test(file.name)
}

/** Required book PDF: non-empty, PDF type, within max size */
export const pdfFileSchema = z
  .instanceof(File, { message: "Please select a PDF file" })
  .refine((f) => f.size > 0, "PDF file is empty")
  .refine((f) => isPdfFile(f), "File must be a PDF")
  .refine((f) => f.size <= MAX_PDF_BYTES, `PDF must be no larger than ${MAX_PDF_MB}MB`)

/** Optional cover image: when set, must be an image within max size */
export const coverImageSchema = z
  .instanceof(File, { message: "Invalid cover image" })
  .refine((f) => ACCEPTED_IMAGE_TYPES.includes(f.type), "Cover must be a JPEG, PNG, or WebP image")
  .refine(
    (f) => f.size <= MAX_COVER_BYTES,
    `Cover image must be no larger than ${coverMb}MB`,
  )
  .optional()

export const personaSchema = z.enum([
  "dave",
  "daniel",
  "chris",
  "rachel",
  "sarah",
])

export const bookUploadSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(100, "Title must be less than 100 characters"),
  author: z.string().trim().min(1, "Author name is required").max(50, "Author name must be less than 50 characters"),
  persona: personaSchema,
  pdfFile: pdfFileSchema,
  coverImage: coverImageSchema,
})

export type BookUploadValues = z.infer<typeof bookUploadSchema>

export type personaId = z.infer<typeof personaSchema>
