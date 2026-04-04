import * as React from "react"

import { useFormField } from "@/components/ui/form"
import { cn } from "@/lib/utils"

type DropzoneLabelProps = {
  className?: string
  children: React.ReactNode
}

export function DropzoneLabel({ className, children }: DropzoneLabelProps) {
  const { formItemId } = useFormField()
  return (
    <label
      htmlFor={formItemId}
      className={cn("cursor-pointer", className)}
    >
      {children}
    </label>
  )
}
