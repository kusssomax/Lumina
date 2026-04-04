import * as z from "zod"

import {
  MAX_COVER_BYTES,
  MAX_PDF_BYTES,
  MAX_PDF_MB,
} from "./upload-form.constants"

const coverMb = MAX_COVER_BYTES / (1024 * 1024)

export const voiceSchema = z.enum([
  "dave",
  "daniel",
  "chris",
  "rachel",
  "sarah",
])

export const bookUploadSchema = z.object({
  pdfFile: z
    .custom<File>((val): val is File => val instanceof File, {
      message: "Please upload a PDF",
    })
    .refine(
      (f) => f.size <= MAX_PDF_BYTES,
      `PDF must be at most ${MAX_PDF_MB}MB`
    )
    .refine(
      (f) =>
        f.type === "application/pdf" ||
        f.name.toLowerCase().endsWith(".pdf"),
      "File must be a PDF"
    ),
  coverImage: z
    .custom<File | undefined>(
      (val) => val === undefined || val instanceof File
    )
    .optional()
    .refine(
      (f) => !f || f.type.startsWith("image/"),
      "Cover must be an image"
    )
    .refine(
      (f) => !f || f.size <= MAX_COVER_BYTES,
      `Cover image must be at most ${coverMb}MB`
    ),
  title: z.string().trim().min(1, "Title is required"),
  author: z.string().trim().min(1, "Author name is required"),
  voice: voiceSchema,
})

export type BookUploadValues = z.infer<typeof bookUploadSchema>

export type VoiceId = z.infer<typeof voiceSchema>
