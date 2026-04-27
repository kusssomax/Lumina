import { X } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import * as React from "react"
import type { Control, FieldPath } from "react-hook-form"

import { Button } from "@/components/ui/button"
import { Field, FieldDescription } from "@/components/ui/field"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { cn } from "@/lib/utils"

import type { BookUploadValues } from "./upload-form.schema"
import { DropzoneLabel } from "./DropzoneLabel"

const dropzoneClassName =
  "relative flex min-h-[160px] flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-card p-8 text-center transition-colors focus-within:ring-2 focus-within:ring-ring/50"

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
}: FileDropzoneFieldProps) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <Field>
            <FormDescription className="sr-only">
              {srDescription}
            </FormDescription>
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
              className={cn(
                dropzoneClassName,
                field.value && "border-border bg-secondary/30 max-w-full"
              )}
            >
              {field.value ? (
                <>
                  <div className="flex w-full max-w-full items-center justify-center gap-2 px-2">
                    <Icon
                      className="size-8 shrink-0 text-muted-foreground"
                      aria-hidden
                    />
                    <span className="min-w-0 truncate font-medium text-foreground">
                      {(field.value as File).name}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        field.onChange(undefined)
                        if (inputRef.current) {
                          inputRef.current.value = ""
                        }
                      }}
                      aria-label={removeAriaLabel}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    Click to change file
                  </span>
                </>
              ) : (
                <>
                  <Icon
                    className="size-10 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="font-medium text-foreground">
                    {emptyTitle}
                  </span>
                  <FieldDescription>{emptyDescription}</FieldDescription>
                </>
              )}
            </DropzoneLabel>
            <FormMessage />
          </Field>
        </FormItem>
      )}
    />
  )
}
