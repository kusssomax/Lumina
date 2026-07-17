import { X } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import * as React from "react"
import type { Control, FieldPath } from "react-hook-form"

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"

import type { BookUploadValues } from "./upload-form.schema"
import { DropzoneLabel } from "./DropzoneLabel"

type FileDropzoneName = Extract<
  FieldPath<BookUploadValues>,
  "pdfFile" | "coverImage"
>

type FileDropzoneFieldProps = {
  control: Control<BookUploadValues>
  name: FileDropzoneName
  accept: string
  srDescription: string
  icon: LucideIcon
  removeAriaLabel: string
  emptyTitle: string
  emptyDescription: string
  label: string
  optional?: boolean
}

export function FileDropzoneField({
  control,
  name,
  accept,
  srDescription,
  icon: Icon,
  removeAriaLabel,
  emptyTitle,
  emptyDescription,
  label,
  optional,
}: FileDropzoneFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {/* Label */}
          <div className="mb-[9px]">
            <span
              className="uppercase font-medium"
              style={{ fontSize: "11px", color: "var(--text-3)", letterSpacing: "0.08em" }}
            >
              {label}{" "}
              {optional ? (
                <span style={{ color: "var(--text-3)", fontWeight: 400, textTransform: "none", letterSpacing: 0, fontSize: "12px" }}>
                  (optional)
                </span>
              ) : (
                <span style={{ color: "var(--primary)" }}>*</span>
              )}
            </span>
          </div>

          <FormDescription className="sr-only">{srDescription}</FormDescription>

          <FormControl>
            <input
              ref={(el) => {
                field.ref(el)
                inputRef.current = el
              }}
              type="file"
              accept={accept}
              className="sr-only"
              onChange={(e) => {
                const file = e.target.files?.[0]
                field.onChange(file)
              }}
            />
          </FormControl>

          <DropzoneLabel
            style={
              field.value
                ? {
                    border: "1.5px solid rgba(200,149,108,0.35)",
                    borderRadius: "12px",
                    cursor: "default",
                    overflow: "hidden",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "16px 20px",
                    transition: "border-color .2s, background .2s",
                  }
                : {
                    border: "1.5px dashed var(--border-warm)",
                    borderRadius: "12px",
                    cursor: "pointer",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column" as const,
                    alignItems: "center",
                    padding: "40px 24px",
                    gap: "9px",
                    textAlign: "center" as const,
                    transition: "border-color .2s, background .2s",
                  }
            }
            className="group hover:[border-color:var(--primary)] hover:[background:rgba(200,149,108,0.04)]"
          >
            {field.value ? (
              <>
                <Icon className="shrink-0" size={20} style={{ color: "var(--text-2)" }} aria-hidden />
                <span
                  className="min-w-0 truncate flex-1"
                  style={{ fontSize: "14px", color: "var(--text-1)" }}
                >
                  {(field.value as File).name}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    field.onChange(undefined)
                    if (inputRef.current) {
                      inputRef.current.value = ""
                    }
                  }}
                  aria-label={removeAriaLabel}
                  style={{ color: "var(--text-3)", background: "none", border: "none", cursor: "pointer", padding: "4px" }}
                  className="shrink-0 transition-colors hover:text-destructive"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <>
                <Icon size={32} style={{ color: "var(--text-3)" }} aria-hidden />
                <span style={{ fontSize: "14px", color: "var(--text-2)" }}>{emptyTitle}</span>
                <span style={{ fontSize: "13px", color: "var(--text-3)" }}>{emptyDescription}</span>
              </>
            )}
          </DropzoneLabel>

          <FormMessage />
        </FormItem>
      )}
    />
  )
}
